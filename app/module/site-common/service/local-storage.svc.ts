import { StorageService_Int } from "../interface";

export class LocalStorage_Svc implements StorageService_Int {
	private storage: any = localStorage;

	constructor() {
		console.log('[ LocalStorage found ]');
	}

	get(name: string) {
		return JSON.parse(this.storage.getItem(name));
	}

	set(name: string, value: any) {
		this.storage.setItem(name, JSON.stringify(value));
	}

	remove(name: string) {
		this.storage.removeItem(name);
	}
}