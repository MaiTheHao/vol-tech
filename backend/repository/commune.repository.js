import CommuneModel from '../models/commune.model';
import ProvinceModel from '../models/province.model';

class CommuneRepository {
	static _instance = null;
	static getInstance() {
		if (!CommuneRepository._instance) {
			CommuneRepository._instance = new CommuneRepository();
		}
		return CommuneRepository._instance;
	}
}

const communeRepository = CommuneRepository.getInstance();
export default communeRepository;
