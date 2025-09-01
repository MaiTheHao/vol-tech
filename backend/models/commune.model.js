import mongoose from 'mongoose';

const CommuneSchema = new mongoose.Schema(
	{
		province: {
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

// Compound index for province and code
CommuneSchema.index({ province: 1, code: 1 }, { unique: true });

const CommuneModel = mongoose.models.Commune || mongoose.model('Commune', CommuneSchema);
export default CommuneModel;
