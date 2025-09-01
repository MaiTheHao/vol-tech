import ACTIVITY_STATUS from '../../../backend/enums/activity_status.enum.js';
import USER_ACTIVITY_STATUS from '../../../backend/enums/user-activity_status.enum.js';

const statusLabels = {
	[ACTIVITY_STATUS.OPEN]: 'Đang mở',
	[ACTIVITY_STATUS.ONGOING]: 'Đang diễn ra',
	[ACTIVITY_STATUS.ENDED]: 'Đã kết thúc',
	[ACTIVITY_STATUS.FULL]: 'Đã đủ người',
	[USER_ACTIVITY_STATUS.REGISTERED]: 'Bạn đã đăng ký',
	[USER_ACTIVITY_STATUS.JOINING]: 'Bạn đang tham gia',
	[USER_ACTIVITY_STATUS.JOINED]: 'Bạn đã tham gia',
};

const labelToStatus = Object.fromEntries(
	Object.entries(statusLabels).map(([status, label]) => [label, Number(status)])
);

/**
 * Trả về nhãn (chuỗi) hiển thị tương ứng với trạng thái (số) hoạt động.
 * @param {number} status - Trạng thái (số) hoạt động cần lấy nhãn.
 * @returns {string} Nhãn (chuỗi) hiển thị cho trạng thái, hoặc 'Không xác định' nếu không tìm thấy.
 */
export function getLabelByStatus(status) {
	return statusLabels[status] ?? 'Không xác định';
}

/**
 * Trả về trạng thái (số) tương ứng với nhãn (chuỗi) được cung cấp.
 * @param {string} label - Nhãn (chuỗi) trạng thái cần tra cứu.
 * @returns {number} Trạng thái (số) tương ứng với nhãn, hoặc -1 nếu không tìm thấy.
 */
export function getStatusByLabel(label) {
	return labelToStatus[label] ?? -1;
}
