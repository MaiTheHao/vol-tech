import mongoose from 'mongoose';

const UserActivitySchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		activity: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Activity',
			required: true,
		},
		joinedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

// Compound index to prevent duplicate user-activity pairs
UserActivitySchema.index({ user: 1, activity: 1 }, { unique: true });

// Index for querying by user
UserActivitySchema.index({ user: 1 });

// Index for querying by activity
UserActivitySchema.index({ activity: 1 });

export default mongoose.models.UserActivity || mongoose.model('UserActivity', UserActivitySchema);
