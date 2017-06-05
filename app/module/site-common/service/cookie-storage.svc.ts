import { StorageService_Int } from "lm/site-common";

export class CookieStorage_Svc implements StorageService_Int {
	private encode = (<any>window).encodeURIComponent;
	private decode = (<any>window).decodeURIComponent;

	constructor() {
		console.log('[ CookieStorage service fallback enabled because LocalStorage is not available ]');
	}

	get(name: string): any {
		let reg = new RegExp(`(?:(?:^|.*;\\s*)${this.encode(name)}\\s*\\=\\s*([^;]*).*$)|^.*$`);
		let val = document.cookie.replace(reg, '$1');

		return JSON.parse(this.decode(val));
	}

	set(name: string, value: any): void {
		let str = [];
		let expires = new Date(Date.now() + 31536000000).toUTCString();

		value = JSON.stringify(value);
		str.push(`${this.encode(name)}=${this.encode(value)}`);
		str.push(`max-age=31536000`);
		str.push(`expires=${expires}`);
		document.cookie = str.join(';');
	}

	remove(name: string): void {
		let str = [];

		str.push(`${this.encode(name)}=''`);
		str.push(`expires=${new Date(Date.now()).toUTCString()}`);
		str.push(`max-age=0`);
		document.cookie = str.join(';');
	}
}