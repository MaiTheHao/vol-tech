import { connectDB } from '../lib/mongoose.js';
import Province from '../models/province.model.js';

class ProvinceRepository {
	static _instance = null;

	static getInstance() {
		if (!ProvinceRepository._instance) {
			ProvinceRepository._instance = new ProvinceRepository();
		}
		return ProvinceRepository._instance;
	}

	async create(provinceData) {
		await connectDB();
		const province = new Province(provinceData);
		return province.save();
	}

	async getById(id) {
		await connectDB();
		return Province.findById(id).exec();
	}

	async getByCode(code) {
		await connectDB();
		return Province.findOne({ code }).exec();
	}

	async update(id, updateData) {
		await connectDB();
		return Province.findByIdAndUpdate(id, updateData, { new: true }).exec();
	}

	async delete(id) {
		await connectDB();
		return Province.findByIdAndDelete(id).exec();
	}

	async getList(filter = {}, options = {}) {
		await connectDB();
		return Province.find(filter, null, options).exec();
	}

	/**
	 * Lấy thông tin tỉnh kèm danh sách xã/phường và hoạt động
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Tìm tỉnh theo provinceId
	 * - Join với collection communes để lấy danh sách xã/phường
	 * - Join với collection activities để lấy danh sách hoạt động
	 * - Tính toán số lượng xã/phường và hoạt động
	 *
	 * @async
	 * @param {string} provinceId - ID của tỉnh
	 * @returns {Promise<Object|null>} Promise trả về thông tin tỉnh với xã/phường và thống kê hoạt động, hoặc null nếu không tìm thấy
	 */
	async getProvinceWithCommunes(provinceId) {
		await connectDB();
		const pipeline = [
			{ $match: { _id: provinceId } },
			{
				$lookup: {
					from: 'communes',
					localField: '_id',
					foreignField: 'provinceId',
					as: 'communes',
				},
			},
			{
				$lookup: {
					from: 'activities',
					localField: '_id',
					foreignField: 'provinceId',
					as: 'activities',
				},
			},
			{
				$addFields: {
					communeCount: { $size: '$communes' },
					activityCount: { $size: '$activities' },
				},
			},
		];

		const result = await Province.aggregate(pipeline).exec();
		return result[0] || null;
	}

	/**
	 * Lấy danh sách tỉnh kèm thống kê chi tiết
	 * Sử dụng MongoDB aggregation pipeline để:
	 * - Lọc tỉnh theo điều kiện filter
	 * - Join với collection communes để lấy danh sách xã/phường
	 * - Join với collection activities để lấy danh sách hoạt động
	 * - Tính toán thống kê cho mỗi tỉnh:
	 *   + Số lượng xã/phường
	 *   + Số lượng hoạt động
	 *   + Tổng điểm từ tất cả hoạt động
	 * - Sắp xếp theo số lượng hoạt động (mặc định giảm dần)
	 * - Hỗ trợ phân trang với limit và skip
	 *
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc tỉnh
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @param {Object} [options.sort] - Điều kiện sắp xếp (mặc định: { activityCount: -1 })
	 * @param {number} [options.limit] - Số lượng bản ghi tối đa trả về
	 * @param {number} [options.skip] - Số lượng bản ghi bỏ qua (cho phân trang)
	 * @returns {Promise<Array>} Promise trả về danh sách tỉnh với thống kê chi tiết
	 */
	async getProvincesWithStats(filter = {}, options = {}) {
		await connectDB();
		const pipeline = [
			{ $match: filter },
			{
				$lookup: {
					from: 'communes',
					localField: '_id',
					foreignField: 'provinceId',
					as: 'communes',
				},
			},
			{
				$lookup: {
					from: 'activities',
					localField: '_id',
					foreignField: 'provinceId',
					as: 'activities',
				},
			},
			{
				$addFields: {
					communeCount: { $size: '$communes' },
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

		return Province.aggregate(pipeline).exec();
	}
}

const provinceRepository = ProvinceRepository.getInstance();
export default provinceRepository;
