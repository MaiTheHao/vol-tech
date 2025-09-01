import { connectDB } from '../lib/mongoose.js';
import Commune from '../models/commune.model.js';

class CommuneRepository {
	static _instance = null;

	static getInstance() {
		if (!CommuneRepository._instance) {
			CommuneRepository._instance = new CommuneRepository();
		}
		return CommuneRepository._instance;
	}

	async create(communeData) {
		await connectDB();
		const commune = new Commune(communeData);
		return commune.save();
	}

	async getById(id) {
		await connectDB();
		return Commune.findById(id).exec();
	}

	async update(id, updateData) {
		await connectDB();
		return Commune.findByIdAndUpdate(id, updateData, { new: true }).exec();
	}

	async delete(id) {
		await connectDB();
		return Commune.findByIdAndDelete(id).exec();
	}

	/**
	 * Lấy danh sách commune theo bộ lọc và tùy chọn
	 *
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc
	 * @param {Object} [options={}] - Các tùy chọn truy vấn (sort, limit, skip, etc.)
	 * @returns {Promise<Array>} Promise trả về danh sách commune
	 */
	async getList(filter = {}, options = {}) {
		await connectDB();
		return Commune.find(filter, null, options).exec();
	}

	/**
	 * Lấy thông tin chi tiết của một commune kèm theo thông tin tỉnh và thống kê hoạt động
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Tìm commune theo ID
	 * - Join với collection provinces để lấy thông tin tỉnh
	 * - Join với collection activities để lấy danh sách hoạt động
	 * - Tính toán số lượng hoạt động (activityCount)
	 * - Tính tổng điểm từ tất cả hoạt động (totalScore)
	 *
	 * @async
	 * @param {string} communeId - ID của commune cần lấy thông tin
	 * @returns {Promise<Object|null>} Promise trả về thông tin commune với tỉnh và thống kê hoạt động, hoặc null nếu không tìm thấy
	 */
	async getCommuneWithProvince(communeId) {
		await connectDB();
		const pipeline = [
			{ $match: { _id: communeId } },
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
					from: 'activities',
					localField: '_id',
					foreignField: 'communeId',
					as: 'activities',
				},
			},
			{ $unwind: { path: '$province', preserveNullAndEmptyArrays: true } },
			{
				$addFields: {
					activityCount: { $size: '$activities' },
					totalScore: {
						$sum: {
							$map: {
								input: '$activities',
								as: 'activity',
								in: '$$activity.totalScore',
							},
						},
					},
				},
			},
		];

		const result = await Commune.aggregate(pipeline).exec();
		return result[0] || null;
	}

	/**
	 * Lấy danh sách commune theo tỉnh kèm thống kê hoạt động
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Lọc commune theo provinceId
	 * - Join với collection provinces để lấy thông tin tỉnh
	 * - Join với collection activities để lấy danh sách hoạt động
	 * - Tính toán số lượng hoạt động cho mỗi commune
	 * - Sắp xếp theo số lượng hoạt động (mặc định giảm dần)
	 * - Hỗ trợ phân trang với limit và skip
	 *
	 * @async
	 * @param {string} provinceId - ID của tỉnh cần lấy danh sách commune
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @param {Object} [options.sort] - Điều kiện sắp xếp (mặc định: { activityCount: -1 })
	 * @param {number} [options.limit] - Số lượng bản ghi tối đa trả về
	 * @param {number} [options.skip] - Số lượng bản ghi bỏ qua (cho phân trang)
	 * @returns {Promise<Array>} Promise trả về danh sách commune với thông tin tỉnh và số lượng hoạt động
	 */
	async getCommunesByProvince(provinceId, options = {}) {
		await connectDB();
		const pipeline = [
			{ $match: { provinceId } },
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
					from: 'activities',
					localField: '_id',
					foreignField: 'communeId',
					as: 'activities',
				},
			},
			{ $unwind: { path: '$province', preserveNullAndEmptyArrays: true } },
			{
				$addFields: {
					activityCount: { $size: '$activities' },
				},
			},
			{ $sort: options.sort || { activityCount: -1 } },
			...(options.limit ? [{ $limit: options.limit }] : []),
			...(options.skip ? [{ $skip: options.skip }] : []),
		];

		return Commune.aggregate(pipeline).exec();
	}

	/**
	 * Lấy danh sách commune với thống kê chi tiết về hoạt động
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Lọc commune theo điều kiện filter
	 * - Join với collection provinces để lấy thông tin tỉnh
	 * - Join với collection activities để lấy danh sách hoạt động
	 * - Tính toán số lượng hoạt động (activityCount)
	 * - Tính tổng điểm từ tất cả hoạt động (totalScore)
	 * - Sắp xếp theo số lượng hoạt động (mặc định giảm dần)
	 * - Hỗ trợ phân trang với limit và skip
	 *
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc commune
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @param {Object} [options.sort] - Điều kiện sắp xếp (mặc định: { activityCount: -1 })
	 * @param {number} [options.limit] - Số lượng bản ghi tối đa trả về
	 * @param {number} [options.skip] - Số lượng bản ghi bỏ qua (cho phân trang)
	 * @returns {Promise<Array>} Promise trả về danh sách commune với thông tin tỉnh, số lượng hoạt động và tổng điểm
	 */
	async getCommunesWithStats(filter = {}, options = {}) {
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
					from: 'activities',
					localField: '_id',
					foreignField: 'communeId',
					as: 'activities',
				},
			},
			{ $unwind: { path: '$province', preserveNullAndEmptyArrays: true } },
			{
				$addFields: {
					activityCount: { $size: '$activities' },
					totalScore: {
						$sum: {
							$map: {
								input: '$activities',
								as: 'activity',
								in: '$$activity.totalScore',
							},
						},
					},
				},
			},
			{ $sort: options.sort || { activityCount: -1 } },
			...(options.limit ? [{ $limit: options.limit }] : []),
			...(options.skip ? [{ $skip: options.skip }] : []),
		];

		return Commune.aggregate(pipeline).exec();
	}
}

const communeRepository = CommuneRepository.getInstance();
export default communeRepository;
