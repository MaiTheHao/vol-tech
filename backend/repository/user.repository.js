import { connectDB } from '../lib/mongoose.js';
import User from '../models/user.model.js';
import { Types } from 'mongoose';

/**
 * Repository class for User model operations
 * Implements singleton pattern and provides standardized CRUD operations
 */
class UserRepository {
	static _instance = null;

	/**
	 * Get singleton instance of UserRepository
	 * @returns {UserRepository} The singleton instance
	 */
	static getInstance() {
		if (!UserRepository._instance) {
			UserRepository._instance = new UserRepository();
		}
		return UserRepository._instance;
	}

	// ==================== CRUD OPERATIONS ====================

	/**
	 * Create a new user
	 * @async
	 * @param {Object} userData - User data to create
	 * @param {string} userData.name - User's name
	 * @param {string} userData.email - User's email
	 * @param {string} userData.passwordHashed - Hashed password
	 * @param {Buffer} userData.salt - Password salt
	 * @param {Date} userData.birthDate - User's birth date
	 * @param {string} userData.unit - User's unit/organization
	 * @param {string} userData.phone - User's phone number
	 * @param {number} [userData.score=0] - User's initial score
	 * @returns {Promise<Object>} Promise resolving to created user document
	 * @throws {Error} If validation fails or database error occurs
	 */
	async create(userData) {
		await connectDB();
		const user = new User(userData);
		return user.save();
	}

	/**
	 * Create multiple users in a single operation
	 * @async
	 * @param {Array<Object>} usersData - Array of user data objects
	 * @returns {Promise<Array<Object>>} Promise resolving to array of created user documents
	 * @throws {Error} If validation fails or database error occurs
	 */
	async bulkCreate(usersData) {
		await connectDB();
		return User.insertMany(usersData);
	}

	/**
	 * Find user by ID
	 * @async
	 * @param {string|Types.ObjectId} id - User ID
	 * @param {Object} [options={}] - Query options
	 * @param {string|Array} [options.select] - Fields to select
	 * @param {string|Array} [options.populate] - Fields to populate
	 * @param {boolean} [options.lean=false] - Return plain object
	 * @returns {Promise<Object|null>} Promise resolving to user document or null
	 */
	async getById(id, options = {}) {
		await connectDB();
		let query = User.findById(id);

		if (options.select) query = query.select(options.select);
		if (options.populate) query = query.populate(options.populate);
		if (options.lean) query = query.lean();

		return query.exec();
	}

	/**
	 * Find user by email
	 * @async
	 * @param {string} email - User's email address
	 * @param {Object} [options={}] - Query options
	 * @param {string|Array} [options.select] - Fields to select
	 * @param {boolean} [options.lean=false] - Return plain object
	 * @returns {Promise<Object|null>} Promise resolving to user document or null
	 */
	async getByEmail(email, options = {}) {
		await connectDB();
		let query = User.findOne({ email });

		if (options.select) query = query.select(options.select);
		if (options.lean) query = query.lean();

		return query.exec();
	}

	/**
	 * Update user by ID
	 * @async
	 * @param {string|Types.ObjectId} id - User ID
	 * @param {Object} updateData - Data to update
	 * @param {Object} [options={}] - Update options
	 * @param {boolean} [options.new=true] - Return updated document
	 * @param {boolean} [options.runValidators=true] - Run model validators
	 * @returns {Promise<Object|null>} Promise resolving to updated user document or null
	 */
	async update(id, updateData, options = {}) {
		await connectDB();
		const updateOptions = {
			new: options.new !== false,
			runValidators: options.runValidators !== false,
			...options,
		};
		return User.findByIdAndUpdate(id, updateData, updateOptions).exec();
	}

	/**
	 * Update multiple users matching filter
	 * @async
	 * @param {Object} filter - Filter criteria
	 * @param {Object} updateData - Data to update
	 * @param {Object} [options={}] - Update options
	 * @returns {Promise<Object>} Promise resolving to update result
	 */
	async bulkUpdate(filter, updateData, options = {}) {
		await connectDB();
		return User.updateMany(filter, updateData, options).exec();
	}

	/**
	 * Delete user by ID
	 * @async
	 * @param {string|Types.ObjectId} id - User ID
	 * @returns {Promise<Object|null>} Promise resolving to deleted user document or null
	 */
	async delete(id) {
		await connectDB();
		return User.findByIdAndDelete(id).exec();
	}

	/**
	 * Delete multiple users matching filter
	 * @async
	 * @param {Object} filter - Filter criteria
	 * @returns {Promise<Object>} Promise resolving to delete result
	 */
	async bulkDelete(filter) {
		await connectDB();
		return User.deleteMany(filter).exec();
	}

	/**
	 * Check if user exists by ID
	 * @async
	 * @param {string|Types.ObjectId} id - User ID
	 * @returns {Promise<boolean>} Promise resolving to existence boolean
	 */
	async exists(id) {
		await connectDB();
		const result = await User.exists({ _id: id }).exec();
		return !!result;
	}

	/**
	 * Count users matching filter
	 * @async
	 * @param {Object} [filter={}] - Filter criteria
	 * @returns {Promise<number>} Promise resolving to count
	 */
	async count(filter = {}) {
		await connectDB();
		return User.countDocuments(filter).exec();
	}

	// ==================== QUERY OPERATIONS ====================

	/**
	 * Get list of users with advanced filtering and options
	 * @async
	 * @param {Object} [filter={}] - Filter criteria
	 * @param {Object} [options={}] - Query options
	 * @param {Object} [options.sort] - Sort criteria
	 * @param {number} [options.limit] - Maximum number of documents
	 * @param {number} [options.skip] - Number of documents to skip
	 * @param {string|Array} [options.select] - Fields to select
	 * @param {string|Array} [options.populate] - Fields to populate
	 * @param {boolean} [options.lean=false] - Return plain objects
	 * @returns {Promise<Array>} Promise resolving to array of user documents
	 */
	async getList(filter = {}, options = {}) {
		await connectDB();
		let query = User.find(filter);

		if (options.select) query = query.select(options.select);
		if (options.populate) {
			if (Array.isArray(options.populate)) {
				options.populate.forEach((pop) => (query = query.populate(pop)));
			} else {
				query = query.populate(options.populate);
			}
		}
		if (options.sort) query = query.sort(options.sort);
		if (options.skip) query = query.skip(options.skip);
		if (options.limit) query = query.limit(options.limit);
		if (options.lean) query = query.lean();

		return query.exec();
	}

	/**
	 * Get top users by score
	 * @async
	 * @param {number} [limit=10] - Number of top users to return
	 * @param {Object} [options={}] - Additional query options
	 * @returns {Promise<Array>} Promise resolving to array of top users with activity stats
	 */
	async getTopUsers(limit = 10, options = {}) {
		await connectDB();
		return this.getUsersWithActivityStats(
			{},
			{
				sort: { score: -1 },
				limit,
				...options,
			}
		);
	}

	/**
	 * Get users by unit/organization
	 * @async
	 * @param {string} unit - Unit/organization name
	 * @param {Object} [options={}] - Query options
	 * @returns {Promise<Array>} Promise resolving to array of users with activity stats
	 */
	async getUsersByUnit(unit, options = {}) {
		await connectDB();
		return this.getUsersWithActivityStats({ unit }, options);
	}

	// ==================== AGGREGATE OPERATIONS ====================

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
