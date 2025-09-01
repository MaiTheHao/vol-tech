import mongoose from 'mongoose';

const ProvinceSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Province || mongoose.model('Province', ProvinceSchema);
