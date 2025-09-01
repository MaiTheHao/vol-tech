import { connectDB } from '../lib/mongoose.js';
import UserActivity from '../models/user_activity.model.js';
import { Types } from 'mongoose';

/**
 * Repository class for UserActivity model operations
 * Implements singleton pattern and provides standardized CRUD operations
 */
class UserActivityRepository {
	static _instance = null;

	/**
	 * Get singleton instance of UserActivityRepository
	 * @returns {UserActivityRepository} The singleton instance
	 */
	static getInstance() {
		if (!UserActivityRepository._instance) {
			UserActivityRepository._instance = new UserActivityRepository();
		}
		return UserActivityRepository._instance;
	}

	// ==================== CRUD OPERATIONS ====================

	/**
	 * Create a new user activity relationship
	 * @async
	 * @param {Object} userActivityData - User activity data to create
	 * @param {string|Types.ObjectId} userActivityData.userId - User ID
	 * @param {string|Types.ObjectId} userActivityData.activityId - Activity ID
	 * @param {Date} [userActivityData.joinedAt] - Join timestamp
	 * @param {number} [userActivityData.status=0] - Status (0: pending, 1: completed, 2: cancelled)
	 * @param {number} [userActivityData.score=0] - Score earned
	 * @returns {Promise<Object>} Promise resolving to created user activity document
	 * @throws {Error} If validation fails or database error occurs
	 */
	async create(userActivityData) {
		await connectDB();
		const userActivity = new UserActivity(userActivityData);
		return userActivity.save();
	}

	/**
	 * Create multiple user activities in a single operation
	 * @async
	 * @param {Array<Object>} userActivitiesData - Array of user activity data objects
	 * @returns {Promise<Array<Object>>} Promise resolving to array of created documents
	 * @throws {Error} If validation fails or database error occurs
	 */
	async bulkCreate(userActivitiesData) {
		await connectDB();
		return UserActivity.insertMany(userActivitiesData);
	}

	/**
	 * Find user activity by ID
	 * @async
	 * @param {string|Types.ObjectId} id - User activity ID
	 * @param {Object} [options={}] - Query options
	 * @param {string|Array} [options.select] - Fields to select
	 * @param {string|Array} [options.populate] - Fields to populate
	 * @param {boolean} [options.lean=false] - Return plain object
	 * @returns {Promise<Object|null>} Promise resolving to user activity document or null
	 */
	async getById(id, options = {}) {
		await connectDB();
		let query = UserActivity.findById(id);

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
	 * Find user activity by user and activity IDs
	 * @async
	 * @param {string|Types.ObjectId} userId - User ID
	 * @param {string|Types.ObjectId} activityId - Activity ID
	 * @param {Object} [options={}] - Query options
	 * @returns {Promise<Object|null>} Promise resolving to user activity document or null
	 */
	async getByUserAndActivity(userId, activityId, options = {}) {
		await connectDB();
		let query = UserActivity.findOne({ userId, activityId });

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
	 * Update user activity by ID
	 * @async
	 * @param {string|Types.ObjectId} id - User activity ID
	 * @param {Object} updateData - Data to update
	 * @param {Object} [options={}] - Update options
	 * @param {boolean} [options.new=true] - Return updated document
	 * @param {boolean} [options.runValidators=true] - Run model validators
	 * @returns {Promise<Object|null>} Promise resolving to updated document or null
	 */
	async update(id, updateData, options = {}) {
		await connectDB();
		const updateOptions = {
			new: options.new !== false,
			runValidators: options.runValidators !== false,
			...options,
		};
		return UserActivity.findByIdAndUpdate(id, updateData, updateOptions).exec();
	}

	/**
	 * Update multiple user activities matching filter
	 * @async
	 * @param {Object} filter - Filter criteria
	 * @param {Object} updateData - Data to update
	 * @param {Object} [options={}] - Update options
	 * @returns {Promise<Object>} Promise resolving to update result
	 */
	async bulkUpdate(filter, updateData, options = {}) {
		await connectDB();
		return UserActivity.updateMany(filter, updateData, options).exec();
	}

	/**
	 * Delete user activity by ID
	 * @async
	 * @param {string|Types.ObjectId} id - User activity ID
	 * @returns {Promise<Object|null>} Promise resolving to deleted document or null
	 */
	async delete(id) {
		await connectDB();
		return UserActivity.findByIdAndDelete(id).exec();
	}

	/**
	 * Delete multiple user activities matching filter
	 * @async
	 * @param {Object} filter - Filter criteria
	 * @returns {Promise<Object>} Promise resolving to delete result
	 */
	async bulkDelete(filter) {
		await connectDB();
		return UserActivity.deleteMany(filter).exec();
	}

	/**
	 * Check if user activity exists by ID
	 * @async
	 * @param {string|Types.ObjectId} id - User activity ID
	 * @returns {Promise<boolean>} Promise resolving to existence boolean
	 */
	async exists(id) {
		await connectDB();
		const result = await UserActivity.exists({ _id: id }).exec();
		return !!result;
	}

	/**
	 * Check if user is already enrolled in activity
	 * @async
	 * @param {string|Types.ObjectId} userId - User ID
	 * @param {string|Types.ObjectId} activityId - Activity ID
	 * @returns {Promise<boolean>} Promise resolving to enrollment status
	 */
	async isUserEnrolled(userId, activityId) {
		await connectDB();
		const result = await UserActivity.exists({ userId, activityId }).exec();
		return !!result;
	}

	/**
	 * Count user activities matching filter
	 * @async
	 * @param {Object} [filter={}] - Filter criteria
	 * @returns {Promise<number>} Promise resolving to count
	 */
	async count(filter = {}) {
		await connectDB();
		return UserActivity.countDocuments(filter).exec();
	}

	// ==================== QUERY OPERATIONS ====================

	/**
	 * Lấy danh sách user activity theo bộ lọc và tùy chọn nâng cao
	 *
	 * @async
	 * @param {Object} [filter={}] - Điều kiện lọc
	 * @param {Object} [options={}] - Các tùy chọn truy vấn
	 * @param {Object} [options.sort] - Điều kiện sắp xếp
	 * @param {number} [options.limit] - Số lượng bản ghi tối đa
	 * @param {number} [options.skip] - Số lượng bản ghi bỏ qua
	 * @param {string|Array} [options.select] - Các trường cần lấy
	 * @param {string|Array} [options.populate] - Các trường cần populate
	 * @param {boolean} [options.lean=false] - Trả về plain object
	 * @returns {Promise<Array>} Promise trả về danh sách user activity
	 */
	async getList(filter = {}, options = {}) {
		await connectDB();

		// Build query
		let query = UserActivity.find(filter);

		// Apply select
		if (options.select) {
			query = query.select(options.select);
		}

		// Apply populate
		if (options.populate) {
			if (Array.isArray(options.populate)) {
				options.populate.forEach((pop) => {
					query = query.populate(pop);
				});
			} else {
				query = query.populate(options.populate);
			}
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

	/**
	 * Lấy danh sách hoạt động của người dùng kèm thông tin chi tiết
	 */
	async getUserActivitiesWithDetails(userId, options = {}) {
		await connectDB();

		const objectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
		const {
			collections = {
				activities: 'activities',
				users: 'users',
				provinces: 'provinces',
				communes: 'communes',
			},
			sort = { joinedAt: -1 },
			limit,
			skip,
			includeLocation = true,
		} = options;

		const pipeline = [
			{ $match: { userId: objectId } },
			{
				$lookup: {
					from: collections.activities,
					localField: 'activityId',
					foreignField: '_id',
					as: 'activity',
				},
			},
			{
				$lookup: {
					from: collections.users,
					localField: 'userId',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $unwind: '$activity' },
			{ $unwind: '$user' },
		];

		if (includeLocation) {
			pipeline.push(
				{
					$lookup: {
						from: collections.provinces,
						localField: 'activity.provinceId',
						foreignField: '_id',
						as: 'province',
					},
				},
				{
					$lookup: {
						from: collections.communes,
						localField: 'activity.communeId',
						foreignField: '_id',
						as: 'commune',
					},
				},
				{ $unwind: { path: '$province', preserveNullAndEmptyArrays: true } },
				{ $unwind: { path: '$commune', preserveNullAndEmptyArrays: true } }
			);
		}

		pipeline.push({ $sort: sort });

		if (skip) pipeline.push({ $skip: skip });
		if (limit) pipeline.push({ $limit: limit });

		return UserActivity.aggregate(pipeline).exec();
	}

	/**
	 * Lấy danh sách người tham gia của một hoạt động
	 */
	async getActivityParticipants(activityId, options = {}) {
		await connectDB();

		const objectId = typeof activityId === 'string' ? new Types.ObjectId(activityId) : activityId;
		const {
			collections = {
				users: 'users',
				activities: 'activities',
			},
			sort = { joinedAt: 1 },
			limit,
			skip,
			includeActivity = true,
		} = options;

		const pipeline = [
			{ $match: { activityId: objectId } },
			{
				$lookup: {
					from: collections.users,
					localField: 'userId',
					foreignField: '_id',
					as: 'user',
				},
			},
		];

		if (includeActivity) {
			pipeline.push({
				$lookup: {
					from: collections.activities,
					localField: 'activityId',
					foreignField: '_id',
					as: 'activity',
				},
			});
		}

		pipeline.push({ $unwind: '$user' });

		if (includeActivity) {
			pipeline.push({ $unwind: '$activity' });
		}

		pipeline.push({ $sort: sort });

		if (skip) pipeline.push({ $skip: skip });
		if (limit) pipeline.push({ $limit: limit });

		return UserActivity.aggregate(pipeline).exec();
	}

	/**
	 * Lấy thống kê hoạt động của người dùng
	 */
	async getUserActivityStats(userId, options = {}) {
		await connectDB();

		const objectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
		const {
			collections = {
				activities: 'activities',
			},
			statusMap = {
				completed: 1,
				pending: 0,
				cancelled: 2,
			},
		} = options;

		const pipeline = [
			{ $match: { userId: objectId } },
			{
				$lookup: {
					from: collections.activities,
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
						$sum: { $cond: [{ $eq: ['$status', statusMap.completed] }, 1, 0] },
					},
					pendingActivities: {
						$sum: { $cond: [{ $eq: ['$status', statusMap.pending] }, 1, 0] },
					},
					cancelledActivities: {
						$sum: { $cond: [{ $eq: ['$status', statusMap.cancelled] }, 1, 0] },
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
	 */
	async getActivityStats(activityId, options = {}) {
		await connectDB();

		const objectId = typeof activityId === 'string' ? new Types.ObjectId(activityId) : activityId;
		const {
			collections = {
				users: 'users',
			},
			statusMap = {
				completed: 1,
				pending: 0,
				cancelled: 2,
			},
		} = options;

		const pipeline = [
			{ $match: { activityId: objectId } },
			{
				$lookup: {
					from: collections.users,
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
						$sum: { $cond: [{ $eq: ['$status', statusMap.completed] }, 1, 0] },
					},
					pendingParticipants: {
						$sum: { $cond: [{ $eq: ['$status', statusMap.pending] }, 1, 0] },
					},
					cancelledParticipants: {
						$sum: { $cond: [{ $eq: ['$status', statusMap.cancelled] }, 1, 0] },
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
