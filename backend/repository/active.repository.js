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
		return this.find({ status }, projection, options);
	}

	async findByCommune(communeId, projection = {}, options = {}) {
		return this.find({ commune: communeId }, projection, options);
	}

	async findByTitle(title, projection = {}, options = {}) {
		return this.find({ title: new RegExp(title, 'i') }, projection, options);
	}

	async findByDateRange(startDate, endDate, projection = {}, options = {}) {
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
		return this._model.findByIdAndUpdate(activeId, { $addToSet: { registeredUsers: userId } }, { new: true }).exec();
	}

	async removeRegisteredUser(activeId, userId) {
		return this._model.findByIdAndUpdate(activeId, { $pull: { registeredUsers: userId } }, { new: true }).exec();
	}
}

const activeRepository = new ActiveRepository();
export default activeRepository;
