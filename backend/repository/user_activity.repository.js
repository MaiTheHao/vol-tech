import { connectDB } from '../lib/mongoose.js';
import UserActivity from '../models/user_activity.model.js';

class UserActivityRepository {
	static _instance = null;

	static getInstance() {
		if (!UserActivityRepository._instance) {
			UserActivityRepository._instance = new UserActivityRepository();
		}
		return UserActivityRepository._instance;
	}

	async create(userActivityData) {
		await connectDB();
		const userActivity = new UserActivity(userActivityData);
		return userActivity.save();
	}

	async getById(id) {
		await connectDB();
		return UserActivity.findById(id).exec();
	}

	async update(id, updateData) {
		await connectDB();
		return UserActivity.findByIdAndUpdate(id, updateData, { new: true }).exec();
	}

	async delete(id) {
		await connectDB();
		return UserActivity.findByIdAndDelete(id).exec();
	}

	async getList(filter = {}, options = {}) {
		await connectDB();
		return UserActivity.find(filter, null, options).exec();
	}

	/**
	 * Lấy danh sách hoạt động của người dùng kèm thông tin chi tiết
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Lọc theo userId
	 * - Join với collection activities để lấy thông tin hoạt động
	 * - Join với collection users để lấy thông tin người dùng
	 * - Join với collection provinces để lấy thông tin tỉnh
	 * - Join với collection communes để lấy thông tin xã/phường
	 * - Sắp xếp theo thời gian tham gia (mặc định mới nhất trước)
	 * - Hỗ trợ phân trang với limit và skip
	 *
	 * @async
	 * @param {string} userId - ID của người dùng
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @param {Object} [options.sort] - Điều kiện sắp xếp (mặc định: { joinedAt: -1 })
	 * @param {number} [options.limit] - Số lượng bản ghi tối đa trả về
	 * @param {number} [options.skip] - Số lượng bản ghi bỏ qua (cho phân trang)
	 * @returns {Promise<Array>} Promise trả về danh sách hoạt động với thông tin chi tiết
	 */
	async getUserActivitiesWithDetails(userId, options = {}) {
		await connectDB();
		const pipeline = [
			{ $match: { userId } },
			{
				$lookup: {
					from: 'activities',
					localField: 'activityId',
					foreignField: '_id',
					as: 'activity',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $unwind: '$activity' },
			{ $unwind: '$user' },
			{
				$lookup: {
					from: 'provinces',
					localField: 'activity.provinceId',
					foreignField: '_id',
					as: 'province',
				},
			},
			{
				$lookup: {
					from: 'communes',
					localField: 'activity.communeId',
					foreignField: '_id',
					as: 'commune',
				},
			},
			{ $unwind: { path: '$province', preserveNullAndEmptyArrays: true } },
			{ $unwind: { path: '$commune', preserveNullAndEmptyArrays: true } },
			{ $sort: options.sort || { joinedAt: -1 } },
			...(options.limit ? [{ $limit: options.limit }] : []),
			...(options.skip ? [{ $skip: options.skip }] : []),
		];

		return UserActivity.aggregate(pipeline).exec();
	}

	/**
	 * Lấy danh sách người tham gia của một hoạt động
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Lọc theo activityId
	 * - Join với collection users để lấy thông tin người dùng
	 * - Join với collection activities để lấy thông tin hoạt động
	 * - Sắp xếp theo thời gian tham gia (mặc định cũ nhất trước)
	 * - Hỗ trợ phân trang với limit và skip
	 *
	 * @async
	 * @param {string} activityId - ID của hoạt động
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @param {Object} [options.sort] - Điều kiện sắp xếp (mặc định: { joinedAt: 1 })
	 * @param {number} [options.limit] - Số lượng bản ghi tối đa trả về
	 * @param {number} [options.skip] - Số lượng bản ghi bỏ qua (cho phân trang)
	 * @returns {Promise<Array>} Promise trả về danh sách người tham gia với thông tin chi tiết
	 */
	async getActivityParticipants(activityId, options = {}) {
		await connectDB();
		const pipeline = [
			{ $match: { activityId } },
			{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$lookup: {
					from: 'activities',
					localField: 'activityId',
					foreignField: '_id',
					as: 'activity',
				},
			},
			{ $unwind: '$user' },
			{ $unwind: '$activity' },
			{ $sort: options.sort || { joinedAt: 1 } },
			...(options.limit ? [{ $limit: options.limit }] : []),
			...(options.skip ? [{ $skip: options.skip }] : []),
		];

		return UserActivity.aggregate(pipeline).exec();
	}

	/**
	 * Lấy thống kê hoạt động của người dùng
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Lọc theo userId
	 * - Join với collection activities để lấy thông tin hoạt động
	 * - Nhóm dữ liệu theo userId và tính toán:
	 *   + Tổng số hoạt động tham gia
	 *   + Số hoạt động đã hoàn thành (status = 1)
	 *   + Số hoạt động đang chờ (status = 0)
	 *   + Số hoạt động đã hủy (status = 2)
	 *   + Tổng điểm đã kiếm được
	 *   + Tổng điểm có thể đạt được
	 *
	 * @async
	 * @param {string} userId - ID của người dùng
	 * @returns {Promise<Object>} Promise trả về thống kê hoạt động của người dùng
	 */
	async getUserActivityStats(userId) {
		await connectDB();
		const pipeline = [
			{ $match: { userId } },
			{
				$lookup: {
					from: 'activities',
					localField: 'activityId',
					foreignField: '_id',
					as: 'activity',
				},
			},
			{ $unwind: '$activity' },
			{
				$group: {
					_id: '$userId',
					totalActivities: { $sum: 1 },
					completedActivities: {
						$sum: { $cond: [{ $eq: ['$status', 1] }, 1, 0] },
					},
					pendingActivities: {
						$sum: { $cond: [{ $eq: ['$status', 0] }, 1, 0] },
					},
					cancelledActivities: {
						$sum: { $cond: [{ $eq: ['$status', 2] }, 1, 0] },
					},
					totalEarnedScore: { $sum: '$score' },
					totalPossibleScore: { $sum: '$activity.totalScore' },
				},
			},
		];

		const result = await UserActivity.aggregate(pipeline).exec();
		return result[0] || {};
	}

	/**
	 * Lấy thống kê của một hoạt động
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Lọc theo activityId
	 * - Join với collection users để lấy thông tin người dùng
	 * - Nhóm dữ liệu theo activityId và tính toán:
	 *   + Tổng số người tham gia
	 *   + Số người đã hoàn thành (status = 1)
	 *   + Số người đang chờ (status = 0)
	 *   + Số người đã hủy (status = 2)
	 *   + Điểm trung bình của người dùng
	 *   + Tổng điểm đã phân phối
	 *
	 * @async
	 * @param {string} activityId - ID của hoạt động
	 * @returns {Promise<Object>} Promise trả về thống kê của hoạt động
	 */
	async getActivityStats(activityId) {
		await connectDB();
		const pipeline = [
			{ $match: { activityId } },
			{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $unwind: '$user' },
			{
				$group: {
					_id: '$activityId',
					totalParticipants: { $sum: 1 },
					completedParticipants: {
						$sum: { $cond: [{ $eq: ['$status', 1] }, 1, 0] },
					},
					pendingParticipants: {
						$sum: { $cond: [{ $eq: ['$status', 0] }, 1, 0] },
					},
					cancelledParticipants: {
						$sum: { $cond: [{ $eq: ['$status', 2] }, 1, 0] },
					},
					avgUserScore: { $avg: '$user.score' },
					totalScoreDistributed: { $sum: '$score' },
				},
			},
		];

		const result = await UserActivity.aggregate(pipeline).exec();
		return result[0] || {};
	}
}

const userActivityRepository = UserActivityRepository.getInstance();
export default userActivityRepository;
