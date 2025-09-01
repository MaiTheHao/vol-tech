import withCors from '../../../lib/cors.js';
import authService from '../../../services/auth.service.js';
import { parseJson, getHttpMethodFlags, sendJsonResponse } from '../../../utils/index.js';

export default withCors(async function handler(req, res) {
	const { post } = getHttpMethodFlags(req);
	if (!post) {
		sendJsonResponse(res, 405, { error: 'Phương thức không được phép' });
		return;
	}

	try {
		const body = await parseJson(req);
		const { name, email, password, birthDate, unit, phone } = body;

		if (!name || !email || !password) {
			sendJsonResponse(res, 400, { error: 'Thiếu trường bắt buộc' });
			return;
		}

		const user = await authService.register({ name, email, password, birthDate, unit, phone });

		sendJsonResponse(res, 201, user);
	} catch (err) {
		sendJsonResponse(res, 400, { error: err.message });
	}
});
