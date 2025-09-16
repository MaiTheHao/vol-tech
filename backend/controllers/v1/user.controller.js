import userService from '../../services/user.service.js';

export const getMe = async (req, res) => {
	try {
		const [errUser, user] = await userService.getById(req.user.uid, { passwordHashed: 0, salt: 0 }, { lean: true });
		if (errUser) {
			return res.status(404).json({ error: errUser.message });
		}

		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
	}
};
