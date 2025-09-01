import mongoose from 'mongoose';

const UserActivitySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		activityId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Activity',
			required: true,
		},
		joinedAt: {
			type: Date,
			default: Date.now,
		},
		status: {
			type: Number,
			enum: [0, 1, 2], // 0: pending, 1: completed, 2: cancelled
			default: 0,
		},
		score: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{ timestamps: true }
);

// Compound index to prevent duplicate user-activity pairs
UserActivitySchema.index({ userId: 1, activityId: 1 }, { unique: true });

// Index for querying by user
UserActivitySchema.index({ userId: 1 });

// Index for querying by activity
UserActivitySchema.index({ activityId: 1 });

export default mongoose.models.UserActivity || mongoose.model('UserActivity', UserActivitySchema);
