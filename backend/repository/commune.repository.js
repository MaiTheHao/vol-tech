import { connectDB } from '../lib/mongoose.js';
import Commune from '../models/commune.model.js';
import Province from '../models/province.model.js';
import { Types } from 'mongoose';
import { isNumber, isBoolean, isString, isArray } from '../utils/index.js';

/**
 * Lớp Repository cho các thao tác với model Commune
 * Triển khai singleton và cung cấp các thao tác CRUD chuẩn hóa
 */
class CommuneRepository {
	static _instance = null;

	/**
	 * Lấy instance singleton của CommuneRepository
	 * @returns {CommuneRepository} Instance singleton
	 */
	static getInstance() {
		if (!CommuneRepository._instance) {
			CommuneRepository._instance = new CommuneRepository();
		}
		return CommuneRepository._instance;
	}

	// ==================== CRUD OPERATIONS ====================

	/**
	 * Tạo mới một commune
	 * @async
	 * @param {Object} communeData - Dữ liệu commune cần tạo
	 * @param {string|Types.ObjectId} communeData.provinceId - ID tỉnh
	 * @param {string} communeData.code - Mã commune (chữ hoa)
	 * @param {string} communeData.name - Tên commune
	 * @returns {Promise<Object>} Commune vừa tạo
	 * @throws {Error} Nếu validate thất bại hoặc lỗi DB
	 */
	async create(communeData) {
		await connectDB();
		const commune = new Commune(communeData);
		return commune.save();
	}

	/**
	 * Tạo nhiều commune cùng lúc
	 * @async
	 * @param {Array<Object>} communesData - Mảng dữ liệu commune
	 * @returns {Promise<Array<Object>>} Mảng commune vừa tạo
	 * @throws {Error} Nếu validate thất bại hoặc lỗi DB
	 */
	async bulkCreate(communesData) {
		await connectDB();
		return Commune.insertMany(communesData);
	}

	/**
	 * Tìm commune theo ID
	 * @async
	 * @param {string|Types.ObjectId} id - ID commune
	 * @param {Object} [options={}] - Tùy chọn truy vấn
	 * @param {string|Array} [options.select] - Trường cần lấy
	 * @param {string|Array} [options.populate] - Trường cần populate
	 * @param {boolean} [options.lean=false] - Trả về object thuần
	 * @returns {Promise<Object|null>} Commune hoặc null
	 */
	async getById(id, options = {}) {
		await connectDB();
		let query = Commune.findById(id);

		if (options.select) query = query.select(options.select);
		if (options.populate) {
			if (isArray(options.populate)) {
				options.populate.forEach((pop) => (query = query.populate(pop)));
			} else {
				query = query.populate(options.populate);
			}
		}
		if (isBoolean(options.lean) && options.lean) query = query.lean();

		return query.exec();
	}

	/**
	 * Tìm commune theo tỉnh và mã
	 * @async
	 * @param {string|Types.ObjectId} provinceId - ID tỉnh
	 * @param {string} code - Mã commune
	 * @param {Object} [options={}] - Tùy chọn truy vấn
	 * @returns {Promise<Object|null>} Commune hoặc null
	 */
	async getByProvinceAndCode(provinceId, code, options = {}) {
		await connectDB();
		let query = Commune.findOne({ provinceId, code });

		if (options.select) query = query.select(options.select);
		if (options.populate) {
			if (isArray(options.populate)) {
				options.populate.forEach((pop) => (query = query.populate(pop)));
			} else {
				query = query.populate(options.populate);
			}
		}
		if (isBoolean(options.lean) && options.lean) query = query.lean();

		return query.exec();
	}

	/**
	 * Cập nhật commune theo ID
	 * @async
	 * @param {string|Types.ObjectId} id - ID commune
	 * @param {Object} updateData - Dữ liệu cập nhật
	 * @param {Object} [options={}] - Tùy chọn cập nhật
	 * @param {boolean} [options.new=true] - Trả về document mới
	 * @param {boolean} [options.runValidators=true] - Chạy validator
	 * @returns {Promise<Object|null>} Commune đã cập nhật hoặc null
	 */
	async update(id, updateData, options = {}) {
		await connectDB();
		const updateOptions = {
			new: options.new !== false,
			runValidators: options.runValidators !== false,
			...options,
		};
		return Commune.findByIdAndUpdate(id, updateData, updateOptions).exec();
	}

	/**
	 * Cập nhật nhiều commune theo filter
	 * @async
	 * @param {Object} filter - Điều kiện lọc
	 * @param {Object} updateData - Dữ liệu cập nhật
	 * @param {Object} [options={}] - Tùy chọn cập nhật
	 * @returns {Promise<Object>} Kết quả cập nhật
	 */
	async bulkUpdate(filter, updateData, options = {}) {
		await connectDB();
		return Commune.updateMany(filter, updateData, options).exec();
	}

	/**
	 * Xóa commune theo ID
	 * @async
	 * @param {string|Types.ObjectId} id - ID commune
	 * @returns {Promise<Object|null>} Commune đã xóa hoặc null
	 */
	async delete(id) {
		await connectDB();
		return Commune.findByIdAndDelete(id).exec();
	}

	/**
	 * Xóa nhiều commune theo filter
	 * @async
	 * @param {Object} filter - Điều kiện lọc
	 * @returns {Promise<Object>} Kết quả xóa
	 */
	async bulkDelete(filter) {
		await connectDB();
		return Commune.deleteMany(filter).exec();
	}

	/**
	 * Kiểm tra commune tồn tại theo ID
	 * @async
	 * @param {string|Types.ObjectId} id - ID commune
	 * @returns {Promise<boolean>} true nếu tồn tại
	 */
	async exists(id) {
		await connectDB();
		const result = await Commune.exists({ _id: id }).exec();
		return !!result;
	}

	/**
	 * Đếm số commune theo filter
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc
	 * @returns {Promise<number>} Số lượng commune
	 */
	async count(filter = {}) {
		await connectDB();
		return Commune.countDocuments(filter).exec();
	}

	// ==================== QUERY OPERATIONS ====================

	/**
	 * Lấy danh sách commune theo filter và các tùy chọn nâng cao
	 *
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc
	 * @param {Object} [options={}] - Tùy chọn truy vấn
	 * @param {Object} [options.sort] - Điều kiện sắp xếp
	 * @param {number} [options.limit] - Số lượng bản ghi tối đa
	 * @param {number} [options.page] - Trang hiện tại (bắt đầu từ 1)
	 * @param {number} [options.skip] - Số lượng bản ghi bỏ qua (ưu tiên hơn page nếu có)
	 * @param {string|Array} [options.select] - Trường cần lấy
	 * @param {string|Array} [options.populate] - Trường cần populate
	 * @param {boolean} [options.lean=false] - Trả về object thuần
	 * @returns {Promise<Array>} Danh sách commune
	 */
	async getList(filter = {}, options = {}) {
		await connectDB();

		let query = Commune.find(filter);

		if (options.select) {
			query = query.select(options.select);
		}

		if (options.populate) {
			if (isArray(options.populate)) {
				options.populate.forEach((pop) => {
					query = query.populate(pop);
				});
			} else {
				query = query.populate(options.populate);
			}
		}

		if (options.sort) {
			query = query.sort(options.sort);
		}

		let page = 1,
			limit = 10;
		if (isNumber(options.page) || (isString(options.page) && !isNaN(options.page))) {
			page = parseInt(options.page);
		}
		if (isNumber(options.limit) || (isString(options.limit) && !isNaN(options.limit))) {
			limit = parseInt(options.limit);
		}

		if (options.skip != null && (isNumber(options.skip) || (isString(options.skip) && !isNaN(options.skip)))) {
			query = query.skip(parseInt(options.skip));
		} else {
			query = query.skip((page - 1) * limit);
		}
		query = query.limit(limit);

		if (isBoolean(options.lean) && options.lean) {
			query = query.lean();
		}

		return query.exec();
	}
}

const communeRepository = CommuneRepository.getInstance();
export default communeRepository;
