import crypto from 'crypto';
import userRepository from '../repository/user.repository.js';
import tokenService from './token.service.js';

class AuthService {
	static _instance = null;

	static getInstance() {
		if (!AuthService._instance) {
			AuthService._instance = new AuthService();
		}
		return AuthService._instance;
	}

	/**
	 * Băm mật khẩu với muối bằng sha256
	 * @param {string} password - Mật khẩu người dùng
	 * @param {Buffer} salt - Muối (salt) dùng để băm
	 * @returns {string} mật khẩu đã băm (dạng hex)
	 */
	hashPassword(password, salt) {
		return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
	}

	/**
	 * Đăng ký người dùng mới
	 * @param {Object} userData - { name, email, password, birthDate, unit, phone }
	 * @returns {Promise<Object>} người dùng đã tạo (không bao gồm mật khẩu/muối), kèm accessToken
	 */
	async register(userData) {
		const { password, ...rest } = userData;
		const existing = await userRepository.getByEmail(rest.email, { lean: true });
		if (existing) {
			throw new Error('Email đã được đăng ký');
		}
		const salt = crypto.randomBytes(16);
		const passwordHashed = this.hashPassword(password, salt);
		const user = await userRepository.create({
			...rest,
			passwordHashed,
			salt,
		});
		const userObj = user.toObject ? user.toObject() : user;
		delete userObj.passwordHashed;
		delete userObj.salt;

		const accessToken = tokenService.generateAccessToken({ id: userObj._id, email: userObj.email });

		return { ...userObj, accessToken };
	}

	/**
	 * Đăng nhập người dùng
	 * @param {string} email - Email người dùng
	 * @param {string} password - Mật khẩu người dùng
	 * @returns {Promise<Object>} đối tượng người dùng nếu thành công (không bao gồm mật khẩu/muối), kèm accessToken
	 */
	async login(email, password) {
		const user = await userRepository.getByEmail(email, { lean: false });
		if (!user) {
			throw new Error('Email hoặc mật khẩu không đúng');
		}
		const hashed = this.hashPassword(password, user.salt);
		if (hashed !== user.passwordHashed) {
			throw new Error('Email hoặc mật khẩu không đúng');
		}
		const userObj = user.toObject ? user.toObject() : user;
		delete userObj.passwordHashed;
		delete userObj.salt;

		const accessToken = tokenService.generateAccessToken({ id: userObj._id, email: userObj.email });

		return { ...userObj, accessToken };
	}
}

const authService = AuthService.getInstance();
export default authService;
