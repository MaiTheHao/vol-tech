import { connectDB } from '../lib/mongoose.js';
import User from '../models/user.model.js';

class UserRepository {
	static _instance = null;

	static getInstance() {
		if (!UserRepository._instance) {
			UserRepository._instance = new UserRepository();
		}
		return UserRepository._instance;
	}

	async create(userData) {
		await connectDB();
		const user = new User(userData);
		return user.save();
	}

	async getById(id) {
		await connectDB();
		return User.findById(id).exec();
	}

	async getByEmail(email) {
		await connectDB();
		return User.findOne({ email }).exec();
	}

	async update(id, updateData) {
		await connectDB();
		return User.findByIdAndUpdate(id, updateData, { new: true }).exec();
	}

	async delete(id) {
		await connectDB();
		return User.findByIdAndDelete(id).exec();
	}

	async getList(filter = {}, options = {}) {
		await connectDB();
		return User.find(filter, null, options).exec();
	}

	/**
	 * Lấy thông tin người dùng kèm danh sách hoạt động đã tham gia
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Tìm người dùng theo userId
	 * - Join với collection useractivities để lấy danh sách hoạt động tham gia
	 * - Join với collection activities để lấy thông tin chi tiết hoạt động
	 * - Tính toán thống kê:
	 *   + Tổng số hoạt động tham gia
	 *   + Số hoạt động đã hoàn thành
	 *   + Số hoạt động đang chờ
	 *   + Tổng điểm đã kiếm được
	 *
	 * @async
	 * @param {string} userId - ID của người dùng
	 * @returns {Promise<Object|null>} Promise trả về thông tin người dùng với thống kê hoạt động, hoặc null nếu không tìm thấy
	 */
	async getUserWithActivities(userId) {
		await connectDB();
		const pipeline = [
			{ $match: { _id: userId } },
			{
				$lookup: {
					from: 'useractivities',
					localField: '_id',
					foreignField: 'userId',
					as: 'userActivities',
				},
			},
			{
				$lookup: {
					from: 'activities',
					localField: 'userActivities.activityId',
					foreignField: '_id',
					as: 'activities',
				},
			},
			{
				$addFields: {
					totalActivities: { $size: '$userActivities' },
					completedActivities: {
						$size: {
							$filter: {
								input: '$userActivities',
								cond: { $eq: ['$$this.status', 1] },
							},
						},
					},
					pendingActivities: {
						$size: {
							$filter: {
								input: '$userActivities',
								cond: { $eq: ['$$this.status', 0] },
							},
						},
					},
					earnedScore: {
						$sum: {
							$map: {
								input: '$userActivities',
								as: 'ua',
								in: '$$ua.score',
							},
						},
					},
				},
			},
		];

		const result = await User.aggregate(pipeline).exec();
		return result[0] || null;
	}

	/**
	 * Lấy danh sách người dùng kèm thống kê hoạt động
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Lọc người dùng theo điều kiện filter
	 * - Join với collection useractivities để lấy danh sách hoạt động tham gia
	 * - Tính toán thống kê cho mỗi người dùng:
	 *   + Tổng số hoạt động tham gia
	 *   + Số hoạt động đã hoàn thành
	 *   + Tổng điểm đã kiếm được
	 * - Sắp xếp theo điểm số (mặc định giảm dần)
	 * - Hỗ trợ phân trang với limit và skip
	 *
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc người dùng
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @param {Object} [options.sort] - Điều kiện sắp xếp (mặc định: { score: -1 })
	 * @param {number} [options.limit] - Số lượng bản ghi tối đa trả về
	 * @param {number} [options.skip] - Số lượng bản ghi bỏ qua (cho phân trang)
	 * @returns {Promise<Array>} Promise trả về danh sách người dùng với thống kê hoạt động
	 */
	async getUsersWithActivityStats(filter = {}, options = {}) {
		await connectDB();
		const pipeline = [
			{ $match: filter },
			{
				$lookup: {
					from: 'useractivities',
					localField: '_id',
					foreignField: 'userId',
					as: 'userActivities',
				},
			},
			{
				$addFields: {
					totalActivities: { $size: '$userActivities' },
					completedActivities: {
						$size: {
							$filter: {
								input: '$userActivities',
								cond: { $eq: ['$$this.status', 1] },
							},
						},
					},
					earnedScore: {
						$sum: {
							$map: {
								input: '$userActivities',
								as: 'ua',
								in: '$$ua.score',
							},
						},
					},
				},
			},
			{ $sort: options.sort || { score: -1 } },
			...(options.limit ? [{ $limit: options.limit }] : []),
			...(options.skip ? [{ $skip: options.skip }] : []),
		];

		return User.aggregate(pipeline).exec();
	}

	async getTopUsers(limit = 10) {
		await connectDB();
		return this.getUsersWithActivityStats({}, { sort: { score: -1 }, limit });
	}

	/**
	 * Lấy danh sách người dùng theo đơn vị với thống kê hoạt động
	 * Sử dụng getUsersWithActivityStats() để lọc người dùng theo đơn vị
	 *
	 * @async
	 * @param {string} unit - Tên đơn vị
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @returns {Promise<Array>} Promise trả về danh sách người dùng trong đơn vị với thống kê
	 */
	async getUsersByUnit(unit, options = {}) {
		await connectDB();
		return this.getUsersWithActivityStats({ unit }, options);
	}

	/**
	 * Lấy thống kê tổng quan về người dùng
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Nhóm tất cả người dùng và tính toán:
	 *   + Tổng số người dùng
	 *   + Tổng điểm của tất cả người dùng
	 *   + Điểm trung bình
	 *   + Điểm cao nhất và thấp nhất
	 * - Join để lấy thống kê theo đơn vị:
	 *   + Số lượng người dùng trong mỗi đơn vị
	 *   + Điểm trung bình của mỗi đơn vị
	 *   + Sắp xếp theo số lượng người dùng giảm dần
	 *
	 * @async
	 * @returns {Promise<Object>} Promise trả về thống kê tổng quan về người dùng và theo đơn vị
	 */
	async getUserStatistics() {
		await connectDB();
		const pipeline = [
			{
				$group: {
					_id: null,
					totalUsers: { $sum: 1 },
					totalScore: { $sum: '$score' },
					avgScore: { $avg: '$score' },
					maxScore: { $max: '$score' },
					minScore: { $min: '$score' },
				},
			},
			{
				$lookup: {
					from: 'users',
					pipeline: [
						{
							$group: {
								_id: '$unit',
								count: { $sum: 1 },
								avgScore: { $avg: '$score' },
							},
						},
						{ $sort: { count: -1 } },
					],
					as: 'unitStats',
				},
			},
		];

		const result = await User.aggregate(pipeline).exec();
		return result[0] || {};
	}
}

const userRepository = UserRepository.getInstance();
export default userRepository;
