import { LocalStorage_Svc, CookieStorage_Svc } from '../service';

export function StorageService_Fac() {
	try {
		let now = `app-local-storage-test${Date.now().toString()}`;
		localStorage.setItem(now, now);
		localStorage.removeItem(now);
		return new LocalStorage_Svc();
	} catch (e) {
		return new CookieStorage_Svc();
	}
}