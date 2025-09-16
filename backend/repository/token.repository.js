import BaseRepository from './base.repository.js';
import TokenModel from '../models/token.model.js';
import { connectDB } from '../lib/mongoose.js';

class TokenRepository extends BaseRepository {
	static _instance = null;

	static getInstance() {
		if (!TokenRepository._instance) TokenRepository._instance = new TokenRepository();
		return TokenRepository._instance;
	}

	constructor() {
		super(TokenModel);
	}

	async blacklistToken(id) {
		await connectDB();
		return this._model.findOneAndUpdate({ _id: id }, { blacklisted: true }, { new: true }).exec();
	}

	async isBlacklisted(id) {
		await connectDB();
		const result = await this._model.exists({ _id: id, blacklisted: true }).exec();
		return !!result;
	}
}

const tokenRepository = TokenRepository.getInstance();
export default tokenRepository;
