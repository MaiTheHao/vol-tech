export const LOCAL_STORAGE_KEYS = {
	ACCESS_TOKEN: 'access_token',
};

class LocalStorageService {
	static set(key, value) {
		try {
			const serializedValue = JSON.stringify(value);
			localStorage.setItem(key, serializedValue);
		} catch (e) {
			console.error('Lỗi khi lưu vào LocalStorage:', e);
		}
	}

	static get(key) {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		} catch (e) {
			console.error('Lỗi khi lấy dữ liệu từ LocalStorage:', e);
			return null;
		}
	}

	static remove(key) {
		try {
			localStorage.removeItem(key);
		} catch (e) {
			console.error('Lỗi khi xóa dữ liệu khỏi LocalStorage:', e);
		}
	}

	static clear() {
		try {
			localStorage.clear();
		} catch (e) {
			console.error('Lỗi khi xóa toàn bộ LocalStorage:', e);
		}
	}
}

export default LocalStorageService;
