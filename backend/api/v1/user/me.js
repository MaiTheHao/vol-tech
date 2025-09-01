import UserRepository from '../../../repository/user.repository.js';

export default async function handler(req, res) {
	try {
		const userId = req.headers['x-user-id'];
		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
		}

		const user = await UserRepository.getUserWithActivities(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: 'Internal server error', error: error.message });
	}
}
