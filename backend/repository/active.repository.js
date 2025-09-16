import { connectDB } from '../lib/mongoose.js';
import ActiveModel from '../models/active.model.js';
import BaseRepository from './base.repository.js';

class ActiveRepository extends BaseRepository {
	static _instance = null;

	static getInstance() {
		if (!ActiveRepository._instance) {
			ActiveRepository._instance = new ActiveRepository();
		}
		return ActiveRepository._instance;
	}

	constructor() {
		super(ActiveModel);
	}

	async findWithReference(query, projection, options, hasCommune, hasCreator) {
		await connectDB();
		let queryBuilder = this._model.find(query, projection, options);
		if (hasCommune) {
			queryBuilder = queryBuilder.populate('commune');
		}
		if (hasCreator) {
			queryBuilder = queryBuilder.populate('createdBy', 'name email avatar');
		}
		return queryBuilder.exec();
	}

	async findByStatus(status, projection = {}, options = {}) {
		await connectDB();
		return this.find({ status }, projection, options);
	}

	async findByCommune(communeId, projection = {}, options = {}) {
		await connectDB();
		return this.find({ commune: communeId }, projection, options);
	}

	async findByTitle(title, projection = {}, options = {}) {
		await connectDB();
		return this.find({ title: new RegExp(title, 'i') }, projection, options);
	}

	async findByDateRange(startDate, endDate, projection = {}, options = {}) {
		await connectDB();
		return this.find(
			{
				startDate: { $gte: startDate },
				endDate: { $lte: endDate },
			},
			projection,
			options
		);
	}

	async addRegisteredUser(activeId, userId) {
		await connectDB();
		return this._model.findByIdAndUpdate(activeId, { $addToSet: { registeredUsers: userId } }, { new: true }).exec();
	}

	async removeRegisteredUser(activeId, userId) {
		await connectDB();
		return this._model.findByIdAndUpdate(activeId, { $pull: { registeredUsers: userId } }, { new: true }).exec();
	}
}

const activeRepository = new ActiveRepository();
export default activeRepository;
