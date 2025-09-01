const statusLabels = {
	0: 'Đang mở',
	1: 'Đang diễn ra',
	2: 'Đã kết thúc',
	3: 'Đã đủ người',
	4: 'Bạn đang tham gia',
	5: 'Bạn đã tham gia',
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
