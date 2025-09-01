import { getHttpMethodFlags } from '../utils/index.js';

export default async function handler(req, res) {
	const method = getHttpMethodFlags(req);

	if (method.get) {
		res.status(200).send({ message: 'GET request received' });
	} else if (method.post) {
		res.status(200).send({ message: 'POST request received' });
	} else if (method.put) {
		res.status(200).send({ message: 'PUT request received' });
	} else if (method.delete) {
		res.status(200).send({ message: 'DELETE request received' });
	} else {
		res.status(405).send({ error: 'Method Not Allowed' });
	}
}
