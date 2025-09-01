import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

class TokenService {
	static _instance = null;

	static getInstance() {
		if (!TokenService._instance) {
			TokenService._instance = new TokenService();
		}
		return TokenService._instance;
	}

	generateAccessToken(payload) {
		return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
	}

	verifyAccessToken(token) {
		try {
			return jwt.verify(token, JWT_SECRET);
		} catch (err) {
			throw new Error('Invalid or expired token');
		}
	}

	getPayload(token) {
		return jwt.decode(token);
	}
}

const tokenService = TokenService.getInstance();
export default tokenService;
