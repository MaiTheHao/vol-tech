import mongoose from 'mongoose';

const CommuneSchema = new mongoose.Schema(
	{
		provinceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Province',
			required: true,
		},
		code: {
			type: String,
			required: true,
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

// Compound index for provinceId and code
CommuneSchema.index({ provinceId: 1, code: 1 }, { unique: true });

export default mongoose.models.Commune || mongoose.model('Commune', CommuneSchema);
