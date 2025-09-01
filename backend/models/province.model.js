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

const ProvinceModel = mongoose.models.Province || mongoose.model('Province', ProvinceSchema);
export default ProvinceModel;
