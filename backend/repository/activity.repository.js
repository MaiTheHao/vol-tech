import { connectDB } from '../lib/mongoose.js';
import Activity from '../models/activity.model.js';

class ActivityRepository {
	static _instance = null;

	static getInstance() {
		if (!ActivityRepository._instance) {
			ActivityRepository._instance = new ActivityRepository();
		}
		return ActivityRepository._instance;
	}

	async create(activityData) {
		await connectDB();
		const activity = new Activity(activityData);
		return activity.save();
	}

	async getById(id) {
		await connectDB();
		return Activity.findById(id).exec();
	}

	async update(id, updateData) {
		await connectDB();
		return Activity.findByIdAndUpdate(id, updateData, { new: true }).exec();
	}

	async delete(id) {
		await connectDB();
		return Activity.findByIdAndDelete(id).exec();
	}

	async getList(filter = {}, options = {}) {
		await connectDB();
		return Activity.find(filter, null, options).exec();
	}

	/**
	 * Lấy danh sách hoạt động kèm thông tin địa điểm và thống kê người tham gia
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Lọc hoạt động theo điều kiện filter
	 * - Join với collection provinces để lấy thông tin tỉnh
	 * - Join với collection communes để lấy thông tin xã/phường
	 * - Join với collection user_activities để lấy danh sách người tham gia
	 * - Tính toán thống kê:
	 *   + Số lượng người tham gia
	 *   + Trạng thái đầy chỗ (so sánh curAmountOfPerson với totalPerson)
	 * - Sắp xếp theo thời gian tạo (mặc định mới nhất trước)
	 * - Hỗ trợ phân trang với limit và skip
	 *
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc hoạt động
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @param {Object} [options.sort] - Điều kiện sắp xếp (mặc định: { createdAt: -1 })
	 * @param {number} [options.limit] - Số lượng bản ghi tối đa trả về
	 * @param {number} [options.skip] - Số lượng bản ghi bỏ qua (cho phân trang)
	 * @returns {Promise<Array>} Promise trả về danh sách hoạt động với thông tin địa điểm và thống kê
	 */
	async getActivitiesWithLocation(filter = {}, options = {}) {
		await connectDB();
		const pipeline = [
			{ $match: filter },
			{
				$lookup: {
					from: 'provinces',
					localField: 'provinceId',
					foreignField: '_id',
					as: 'province',
				},
			},
			{
				$lookup: {
					from: 'communes',
					localField: 'communeId',
					foreignField: '_id',
					as: 'commune',
				},
			},
			{ $unwind: '$province' },
			{ $unwind: '$commune' },
			{
				$lookup: {
					from: 'user_activities',
					localField: '_id',
					foreignField: 'activityId',
					as: 'participants',
				},
			},
			{
				$addFields: {
					participantCount: { $size: '$participants' },
					isFullyBooked: { $gte: ['$curAmountOfPerson', '$totalPerson'] },
				},
			},
			{ $sort: options.sort || { createdAt: -1 } },
			...(options.limit ? [{ $limit: options.limit }] : []),
			...(options.skip ? [{ $skip: options.skip }] : []),
		];

		return Activity.aggregate(pipeline).exec();
	}

	/**
	 * Lấy thông tin chi tiết của một hoạt động kèm danh sách người tham gia
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Tìm hoạt động theo activityId
	 * - Join với collection provinces để lấy thông tin tỉnh
	 * - Join với collection communes để lấy thông tin xã/phường
	 * - Join với collection user_activities để lấy danh sách người tham gia
	 * - Tính toán thống kê:
	 *   + Số lượng người tham gia hiện tại
	 *   + Số chỗ còn lại (totalPerson - curAmountOfPerson)
	 *
	 * @async
	 * @param {string} activityId - ID của hoạt động
	 * @returns {Promise<Object|null>} Promise trả về thông tin hoạt động với địa điểm và thống kê người tham gia, hoặc null nếu không tìm thấy
	 */
	async getActivityWithParticipants(activityId) {
		await connectDB();
		const pipeline = [
			{ $match: { _id: activityId } },
			{
				$lookup: {
					from: 'provinces',
					localField: 'provinceId',
					foreignField: '_id',
					as: 'province',
				},
			},
			{
				$lookup: {
					from: 'communes',
					localField: 'communeId',
					foreignField: '_id',
					as: 'commune',
				},
			},
			{
				$lookup: {
					from: 'user_activities',
					localField: '_id',
					foreignField: 'activityId',
					as: 'userActivities',
				},
			},
			{ $unwind: { path: '$province', preserveNullAndEmptyArrays: true } },
			{ $unwind: { path: '$commune', preserveNullAndEmptyArrays: true } },
			{
				$addFields: {
					participantCount: { $size: '$userActivities' },
					availableSlots: { $subtract: ['$totalPerson', '$curAmountOfPerson'] },
				},
			},
		];

		const result = await Activity.aggregate(pipeline).exec();
		return result[0] || null;
	}

	/**
	 * Lấy danh sách hoạt động theo tỉnh
	 * Sử dụng getActivitiesWithLocation() với filter theo provinceId
	 *
	 * @async
	 * @param {string} provinceId - ID của tỉnh
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @returns {Promise<Array>} Promise trả về danh sách hoạt động trong tỉnh
	 */
	async getActivitiesByProvince(provinceId, options = {}) {
		await connectDB();
		return this.getActivitiesWithLocation({ provinceId }, options);
	}

	/**
	 * Lấy danh sách hoạt động theo xã/phường
	 * Sử dụng getActivitiesWithLocation() với filter theo communeId
	 *
	 * @async
	 * @param {string} communeId - ID của xã/phường
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @returns {Promise<Array>} Promise trả về danh sách hoạt động trong xã/phường
	 */
	async getActivitiesByCommune(communeId, options = {}) {
		await connectDB();
		return this.getActivitiesWithLocation({ communeId }, options);
	}
}

const activityRepository = ActivityRepository.getInstance();
export default activityRepository;
