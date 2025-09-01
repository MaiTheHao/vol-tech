import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		passwordHashed: {
			type: String,
			required: true,
		},
		salt: {
			type: Buffer,
			required: true,
		},
		birthDate: {
			type: Date,
			required: true,
		},
		unit: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		score: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
