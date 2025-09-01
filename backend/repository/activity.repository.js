import { connectDB } from '../lib/mongoose.js';
import Activity from '../models/activity.model.js';
import { Types } from 'mongoose';
import Province from '../models/province.model.js';
import Commune from '../models/commune.model.js';
import ACTIVITY_STATUS from '../enums/activity-status.enum.js';
import { isNumber, isString, isArray, isObject } from '../utils/index.js';

/**
 * Lớp Repository cho các thao tác với model Activity
 * Áp dụng singleton pattern và cung cấp các thao tác CRUD chuẩn hóa
 */
class ActivityRepository {
	static _instance = null;

	/**
	 * Lấy instance singleton của ActivityRepository
	 * Get singleton instance of ActivityRepository
	 * @returns {ActivityRepository} Instance singleton
	 */
	static getInstance() {
		if (!ActivityRepository._instance) {
			ActivityRepository._instance = new ActivityRepository();
		}
		return ActivityRepository._instance;
	}

	// ==================== CRUD OPERATIONS ====================

	/**
	 * Tạo mới một activity
	 * @async
	 * @param {Object} activityData - Dữ liệu activity để tạo
	 * @param {string} activityData.title - Tiêu đề activity
	 * @param {string} activityData.summary - Tóm tắt activity
	 * @param {string} activityData.description - Mô tả activity
	 * @param {string|Types.ObjectId} activityData.provinceId - ID tỉnh
	 * @param {string|Types.ObjectId} activityData.communeId - ID xã/phường
	 * @param {number} [activityData.status=0] - Trạng thái activity
	 * @param {number} activityData.totalScore - Tổng điểm cho activity
	 * @param {number} activityData.totalPerson - Số người tham gia tối đa
	 * @param {number} [activityData.curAmountOfPerson=0] - Số người hiện tại
	 * @param {Date} activityData.startDate - Ngày bắt đầu
	 * @param {Date} activityData.endDate - Ngày kết thúc
	 * @returns {Promise<Object>} Activity vừa tạo
	 * @throws {Error} Nếu validate thất bại hoặc lỗi DB
	 */
	async create(activityData) {
		await connectDB();
		const activity = new Activity(activityData);
		return activity.save();
	}

	/**
	 * Tạo nhiều activity cùng lúc
	 * @async
	 * @param {Array<Object>} activitiesData - Mảng dữ liệu activity
	 * @returns {Promise<Array<Object>>} Mảng activity đã tạo
	 * @throws {Error} Nếu validate thất bại hoặc lỗi DB
	 */
	async bulkCreate(activitiesData) {
		await connectDB();
		return Activity.insertMany(activitiesData);
	}

	/**
	 * Tìm activity theo ID
	 * @async
	 * @param {string|Types.ObjectId} id - ID activity
	 * @param {Object} [options={}] - Tuỳ chọn truy vấn
	 * @param {string|Array} [options.select] - Trường cần lấy
	 * @param {string|Array} [options.populate] - Trường cần populate
	 * @param {boolean} [options.lean=false] - Trả về object thuần
	 * @returns {Promise<Object|null>} Activity hoặc null
	 */
	async getById(id, options = {}) {
		await connectDB();
		let query = Activity.findById(id);

		if (options.select) query = query.select(options.select);
		if (options.populate) {
			if (isArray(options.populate)) {
				options.populate.forEach((pop) => (query = query.populate(pop)));
			} else {
				query = query.populate(options.populate);
			}
		}
		if (options.lean) query = query.lean();

		return query.exec();
	}

	/**
	 * Cập nhật activity theo ID
	 * @async
	 * @param {string|Types.ObjectId} id - ID activity
	 * @param {Object} updateData - Dữ liệu cập nhật
	 * @param {Object} [options={}] - Tuỳ chọn cập nhật
	 * @param {boolean} [options.new=true] - Trả về document đã cập nhật
	 * @param {boolean} [options.runValidators=true] - Chạy validator
	 * @returns {Promise<Object|null>} Activity đã cập nhật hoặc null
	 */
	async update(id, updateData, options = {}) {
		await connectDB();
		const updateOptions = {
			new: options.new !== false,
			runValidators: options.runValidators !== false,
			...options,
		};
		return Activity.findByIdAndUpdate(id, updateData, updateOptions).exec();
	}

	/**
	 * Cập nhật nhiều activity theo filter
	 * @async
	 * @param {Object} filter - Điều kiện lọc
	 * @param {Object} updateData - Dữ liệu cập nhật
	 * @param {Object} [options={}] - Tuỳ chọn cập nhật
	 * @returns {Promise<Object>} Kết quả cập nhật
	 */
	async bulkUpdate(filter, updateData, options = {}) {
		await connectDB();
		return Activity.updateMany(filter, updateData, options).exec();
	}

	/**
	 * Xoá activity theo ID
	 * @async
	 * @param {string|Types.ObjectId} id - ID activity
	 * @returns {Promise<Object|null>} Activity đã xoá hoặc null
	 */
	async delete(id) {
		await connectDB();
		return Activity.findByIdAndDelete(id).exec();
	}

	/**
	 * Xoá nhiều activity theo filter
	 * @async
	 * @param {Object} filter - Điều kiện lọc
	 * @returns {Promise<Object>} Kết quả xoá
	 */
	async bulkDelete(filter) {
		await connectDB();
		return Activity.deleteMany(filter).exec();
	}

	/**
	 * Kiểm tra activity tồn tại theo ID
	 * @async
	 * @param {string|Types.ObjectId} id - ID activity
	 * @returns {Promise<boolean>} true nếu tồn tại, ngược lại false
	 */
	async exists(id) {
		await connectDB();
		const result = await Activity.exists({ _id: id }).exec();
		return !!result;
	}

	/**
	 * Đếm số activity theo filter
	 * Count activities matching filter
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc
	 * @returns {Promise<number>} Số lượng activity
	 */
	async count(filter = {}) {
		await connectDB();
		return Activity.countDocuments(filter).exec();
	}

	// ==================== QUERY OPERATIONS ====================

	/**
	 * Lấy danh sách activity với filter nâng cao, lọc theo trạng thái và các tuỳ chọn
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc
	 * @param {Object} [options={}] - Tuỳ chọn truy vấn
	 * @param {ACTIVITY_STATUS|Array<ACTIVITY_STATUS>} [options.status] - Trạng thái activity hoặc mảng trạng thái
	 * @param {Object} [options.sort] - Tiêu chí sắp xếp (mặc định: { createdAt: -1 })
	 * @param {number} [options.limit] - Số lượng mỗi trang
	 * @param {number} [options.page] - Trang hiện tại
	 * @param {number} [options.skip] - Số lượng bỏ qua (ưu tiên hơn page nếu có)
	 * @param {string|Array} [options.select] - Trường cần lấy
	 * @param {string|Array} [options.populate] - Trường cần populate
	 * @param {boolean} [options.lean=false] - Trả về object thuần
	 * @returns {Promise<Array>} Mảng activity
	 */
	async getList(filter = {}, options = {}) {
		await connectDB();

		if (options.status !== undefined) {
			if (isArray(options.status)) {
				filter.status = { $in: options.status };
			} else {
				filter.status = options.status;
			}
		}

		let query = Activity.find(filter);

		if (options.select) query = query.select(options.select);
		if (options.populate) {
			if (isArray(options.populate)) {
				options.populate.forEach((pop) => (query = query.populate(pop)));
			} else {
				query = query.populate(options.populate);
			}
		}

		if (options.sort) query = query.sort(options.sort);

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

		if (options.lean) query = query.lean();

		const data = await query.exec();
		const mappedData = data.map((doc) => {
			const obj = doc.toObject ? doc.toObject() : doc;
			const { communeId, provinceId, status, ...rest } = obj;
			return {
				...rest,
				commune: communeId,
				province: provinceId,
			};
		});
		return mappedData;
	}
}

const activityRepository = ActivityRepository.getInstance();
export default activityRepository;
