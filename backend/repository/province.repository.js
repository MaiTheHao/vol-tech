class ProvinceRepository {
	static _instance = null;

	static getInstance() {
		if (!ProvinceRepository._instance) {
			ProvinceRepository._instance = new ProvinceRepository();
		}
		return ProvinceRepository._instance;
	}
}

export default ProvinceRepository.getInstance();
