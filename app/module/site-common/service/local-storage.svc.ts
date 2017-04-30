import { StorageService_Int } from "../interface";

export class LocalStorage_Svc implements StorageService_Int {
	private storage: any = localStorage;

	constructor() {
		console.log('[ LocalStorage found ]');
		this.set('test a', ';sdflkjc/ \\ .sdlfkj&^*(_#@4');
		this.set('test b', {
			test: [
				1,
				"two",
				true,
				false
			],
			a: 'Lookin good!,...;/',
			c: {
				test: {
					testnest: 1234,
					ok: "yay"
				}
			}
		});
		console.log(this.get('test a'));
		console.log(this.get('test b'));
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