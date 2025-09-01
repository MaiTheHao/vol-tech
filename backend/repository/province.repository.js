import { connectDB } from '../lib/mongoose.js';
import Province from '../models/province.model.js';
import { Types } from 'mongoose';

/**
 * Repository class for Province model operations
 * Implements singleton pattern and provides standardized CRUD operations
 */
class ProvinceRepository {
	static _instance = null;

	/**
	 * Get singleton instance of ProvinceRepository
	 * @returns {ProvinceRepository} The singleton instance
	 */
	static getInstance() {
		if (!ProvinceRepository._instance) {
			ProvinceRepository._instance = new ProvinceRepository();
		}
		return ProvinceRepository._instance;
	}

	// ==================== CRUD OPERATIONS ====================

	/**
	 * Create a new province
	 * @async
	 * @param {Object} provinceData - Province data to create
	 * @param {string} provinceData.code - Province code (unique, uppercase)
	 * @param {string} provinceData.name - Province name
	 * @returns {Promise<Object>} Promise resolving to created province document
	 * @throws {Error} If validation fails or database error occurs
	 */
	async create(provinceData) {
		await connectDB();
		const province = new Province(provinceData);
		return province.save();
	}

	/**
	 * Create multiple provinces in a single operation
	 * @async
	 * @param {Array<Object>} provincesData - Array of province data objects
	 * @returns {Promise<Array<Object>>} Promise resolving to array of created documents
	 * @throws {Error} If validation fails or database error occurs
	 */
	async bulkCreate(provincesData) {
		await connectDB();
		return Province.insertMany(provincesData);
	}

	/**
	 * Find province by ID
	 * @async
	 * @param {string|Types.ObjectId} id - Province ID
	 * @param {Object} [options={}] - Query options
	 * @param {string|Array} [options.select] - Fields to select
	 * @param {string|Array} [options.populate] - Fields to populate
	 * @param {boolean} [options.lean=false] - Return plain object
	 * @returns {Promise<Object|null>} Promise resolving to province document or null
	 */
	async getById(id, options = {}) {
		await connectDB();
		let query = Province.findById(id);

		if (options.select) query = query.select(options.select);
		if (options.populate) {
			if (Array.isArray(options.populate)) {
				options.populate.forEach((pop) => (query = query.populate(pop)));
			} else {
				query = query.populate(options.populate);
			}
		}
		if (options.lean) query = query.lean();

		return query.exec();
	}

	/**
	 * Find province by code
	 * @async
	 * @param {string} code - Province code
	 * @param {Object} [options={}] - Query options
	 * @returns {Promise<Object|null>} Promise resolving to province document or null
	 */
	async getByCode(code, options = {}) {
		await connectDB();
		let query = Province.findOne({ code });

		if (options.select) query = query.select(options.select);
		if (options.lean) query = query.lean();

		return query.exec();
	}

	/**
	 * Update province by ID
	 * @async
	 * @param {string|Types.ObjectId} id - Province ID
	 * @param {Object} updateData - Data to update
	 * @param {Object} [options={}] - Update options
	 * @param {boolean} [options.new=true] - Return updated document
	 * @param {boolean} [options.runValidators=true] - Run model validators
	 * @returns {Promise<Object|null>} Promise resolving to updated province document or null
	 */
	async update(id, updateData, options = {}) {
		await connectDB();
		const updateOptions = {
			new: options.new !== false,
			runValidators: options.runValidators !== false,
			...options,
		};
		return Province.findByIdAndUpdate(id, updateData, updateOptions).exec();
	}

	/**
	 * Update multiple provinces matching filter
	 * @async
	 * @param {Object} filter - Filter criteria
	 * @param {Object} updateData - Data to update
	 * @param {Object} [options={}] - Update options
	 * @returns {Promise<Object>} Promise resolving to update result
	 */
	async bulkUpdate(filter, updateData, options = {}) {
		await connectDB();
		return Province.updateMany(filter, updateData, options).exec();
	}

	/**
	 * Delete province by ID
	 * @async
	 * @param {string|Types.ObjectId} id - Province ID
	 * @returns {Promise<Object|null>} Promise resolving to deleted province document or null
	 */
	async delete(id) {
		await connectDB();
		return Province.findByIdAndDelete(id).exec();
	}

	/**
	 * Delete multiple provinces matching filter
	 * @async
	 * @param {Object} filter - Filter criteria
	 * @returns {Promise<Object>} Promise resolving to delete result
	 */
	async bulkDelete(filter) {
		await connectDB();
		return Province.deleteMany(filter).exec();
	}

	/**
	 * Check if province exists by ID
	 * @async
	 * @param {string|Types.ObjectId} id - Province ID
	 * @returns {Promise<boolean>} Promise resolving to existence boolean
	 */
	async exists(id) {
		await connectDB();
		const result = await Province.exists({ _id: id }).exec();
		return !!result;
	}

	/**
	 * Count provinces matching filter
	 * @async
	 * @param {Object} [filter={}] - Filter criteria
	 * @returns {Promise<number>} Promise resolving to count
	 */
	async count(filter = {}) {
		await connectDB();
		return Province.countDocuments(filter).exec();
	}

	// ==================== QUERY OPERATIONS ====================

	/**
	 * Lấy danh sách province theo bộ lọc và tùy chọn nâng cao
	 *
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @param {Object} [options.sort] - Điều kiện sắp xếp
	 * @param {number} [options.limit] - Số lượng bản ghi tối đa
	 * @param {number} [options.skip] - Số lượng bản ghi bỏ qua
	 * @param {string|Array} [options.select] - Các trường cần lấy
	 * @param {boolean} [options.lean=false] - Trả về plain object
	 * @returns {Promise<Array>} Promise trả về danh sách province
	 */
	async getList(filter = {}, options = {}) {
		await connectDB();

		// Build query
		let query = Province.find(filter);

		// Apply select
		if (options.select) {
			query = query.select(options.select);
		}

		// Apply sort
		if (options.sort) {
			query = query.sort(options.sort);
		}

		// Apply pagination
		if (options.skip) {
			query = query.skip(options.skip);
		}

		if (options.limit) {
			query = query.limit(options.limit);
		}

		// Apply lean
		if (options.lean) {
			query = query.lean();
		}

		return query.exec();
	}

	// Aggregate/Stats methods
	/**
	 * Lấy thông tin tỉnh kèm danh sách xã/phường và hoạt động
	 */
	async getProvinceWithCommunes(provinceId, options = {}) {
		await connectDB();

		const objectId = typeof provinceId === 'string' ? new Types.ObjectId(provinceId) : provinceId;
		const {
			collections = {
				communes: 'communes',
				activities: 'activities',
			},
			includeActivities = true,
			includeCommunes = true,
		} = options;

		const pipeline = [{ $match: { _id: objectId } }];

		if (includeCommunes) {
			pipeline.push({
				$lookup: {
					from: collections.communes,
					localField: '_id',
					foreignField: 'provinceId',
					as: 'communes',
				},
			});
		}

		if (includeActivities) {
			pipeline.push({
				$lookup: {
					from: collections.activities,
					localField: '_id',
					foreignField: 'provinceId',
					as: 'activities',
				},
			});
		}

		const addFields = {};
		if (includeCommunes) addFields.communeCount = { $size: '$communes' };
		if (includeActivities) addFields.activityCount = { $size: '$activities' };

		if (Object.keys(addFields).length > 0) {
			pipeline.push({ $addFields: addFields });
		}

		const result = await Province.aggregate(pipeline).exec();
		return result[0] || null;
	}

	/**
	 * Lấy danh sách tỉnh kèm thống kê chi tiết
	 */
	async getProvincesWithStats(filter = {}, options = {}) {
		await connectDB();

		const {
			collections = {
				communes: 'communes',
				activities: 'activities',
			},
			sort = { activityCount: -1 },
			limit,
			skip,
			includeActivities = true,
			includeCommunes = true,
		} = options;

		const pipeline = [{ $match: filter }];

		if (includeCommunes) {
			pipeline.push({
				$lookup: {
					from: collections.communes,
					localField: '_id',
					foreignField: 'provinceId',
					as: 'communes',
				},
			});
		}

		if (includeActivities) {
			pipeline.push({
				$lookup: {
					from: collections.activities,
					localField: '_id',
					foreignField: 'provinceId',
					as: 'activities',
				},
			});
		}

		const addFields = {};
		if (includeCommunes) addFields.communeCount = { $size: '$communes' };
		if (includeActivities) {
			addFields.activityCount = { $size: '$activities' };
			addFields.totalScore = {
				$sum: {
					$map: {
						input: '$activities',
						as: 'activity',
						in: '$$activity.totalScore',
					},
				},
			};
		}

		if (Object.keys(addFields).length > 0) {
			pipeline.push({ $addFields: addFields });
		}

		pipeline.push({ $sort: sort });

		if (skip) pipeline.push({ $skip: skip });
		if (limit) pipeline.push({ $limit: limit });

		return Province.aggregate(pipeline).exec();
	}
}

const provinceRepository = ProvinceRepository.getInstance();
export default provinceRepository;
