import { connectDB } from '../lib/mongoose.js';
import User from '../models/user.model.js';

class UserRepository {
	static _instance = null;

	static getInstance() {
		if (!UserRepository._instance) {
			UserRepository._instance = new UserRepository();
		}
		return UserRepository._instance;
	}

	async create(userData) {
		await connectDB();
		const user = new User(userData);
		return user.save();
	}

	async getById(id, options = {}) {
		await connectDB();
		let query = User.findById(id);

		if (options.select) query = query.select(options.select);
		if (options.populate) query = query.populate(options.populate);
		if (options.lean) query = query.lean();

		return query.exec();
	}

	async getByEmail(email, options = {}) {
		await connectDB();
		let query = User.findOne({ email });

		if (options.select) query = query.select(options.select);
		if (options.lean) query = query.lean();

		return query.exec();
	}

	async update(id, updateData, options = {}) {
		await connectDB();
		const updateOptions = {
			new: options.new !== false,
			runValidators: options.runValidators !== false,
			...options,
		};
		return User.findByIdAndUpdate(id, updateData, updateOptions).exec();
	}

	async delete(id) {
		await connectDB();
		return User.findByIdAndDelete(id).exec();
	}

	async exists(id) {
		await connectDB();
		const result = await User.exists({ _id: id }).exec();
		return !!result;
	}

	async count(filter = {}) {
		await connectDB();
		return User.countDocuments(filter).exec();
	}
}

const userRepository = UserRepository.getInstance();
export default userRepository;
