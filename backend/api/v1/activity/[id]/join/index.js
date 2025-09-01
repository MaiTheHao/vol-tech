import activityRepository from '../../../../repository/activity.repository.js';
import userActivityRepository from '../../../../repository/user_activity.repository.js';
import withCors from '../../../../lib/cors.js';
import { getHttpMethodFlags, sendJsonResponse, extractBearerToken } from '../../../../utils/index.js';
import tokenService from '../../../../services/token.service.js';

async function handler(req, res) {
	const { post } = getHttpMethodFlags(req);

	if (!post) {
		return sendJsonResponse(res, 405, { success: false, message: 'Phương thức không được hỗ trợ' });
	}

	const { id: activityId } = req.query;
	if (!activityId) {
		return sendJsonResponse(res, 400, { success: false, message: 'ID hoạt động không hợp lệ' });
	}

	const token = extractBearerToken(req);
	if (!token) {
		return sendJsonResponse(res, 401, { success: false, message: 'Chưa xác thực' });
	}
	let userId;
	try {
		const payload = tokenService.verifyAccessToken(token);
		userId = payload.userId;
	} catch {
		return sendJsonResponse(res, 401, { success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
	}

	const activity = await activityRepository.getById(activityId);
	if (!activity) {
		return sendJsonResponse(res, 404, { success: false, message: 'Không tìm thấy hoạt động' });
	}

	const alreadyJoined = await userActivityRepository.isUserEnrolled(userId, activityId);
	if (alreadyJoined) {
		return sendJsonResponse(res, 409, { success: false, message: 'Bạn đã tham gia hoạt động này' });
	}

	if (activity.curAmountOfPerson >= activity.totalPerson) {
		return sendJsonResponse(res, 409, { success: false, message: 'Hoạt động đã đủ người' });
	}

	await userActivityRepository.create({ userId, activityId });
	await activityRepository.update(activityId, { $inc: { curAmountOfPerson: 1 } });

	return sendJsonResponse(res, 200, { success: true, message: 'Tham gia hoạt động thành công' });
}

export default withCors(handler);
