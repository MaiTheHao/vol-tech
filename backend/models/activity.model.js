import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		summary: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		provinceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Province',
			required: true,
		},
		communeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Commune',
			required: true,
		},
		// status: 0 - đang mở, 1 - đang diễn ra, 2 - đã kết thúc, 3 - đã đủ người, 4 - bạn đang tham gia, 5 - bạn đã tham gia
		status: {
			type: Number,
			enum: [0, 1, 2, 3, 4, 5],
			default: 0,
		},
		totalScore: {
			type: Number,
			required: true,
			min: 0,
		},
		totalPerson: {
			type: Number,
			required: true,
			min: 1,
		},
		curAmountOfPerson: {
			type: Number,
			default: 0,
			min: 0,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

// Validation to ensure endDate is after startDate
ActivitySchema.pre('save', function (next) {
	if (this.endDate <= this.startDate) {
		next(new Error('End date must be after start date'));
	}
	next();
});

// Validation to ensure curAmountOfPerson doesn't exceed totalPerson
ActivitySchema.pre('save', function (next) {
	if (this.curAmountOfPerson > this.totalPerson) {
		next(new Error('Current amount of person cannot exceed total person limit'));
	}
	next();
});

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
