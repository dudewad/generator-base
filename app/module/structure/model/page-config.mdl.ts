export class PageConfig_Mdl {
	type: string = '';
	config: any = {};
	component: Array<any> = [];

	constructor(config:any){
		this.setData(config);
	}

	setData(config:any) {
		this.type = config.type || '';
		this.config = config.config || {};
		this.component = config.component || [];
	}
}