export class LocalizableContent_Mdl {
    content: any = {};

    private currentLocale: string;

    constructor(private baseContentObj: any,
                private locale: string,
                private unregisterCallback: Function,
                private defaultLocale?: string) {
        this.setLocale(locale);
    }

    setLocale(locale: string) {
        let target = this.content;
        let src;

        if (Object.keys(this.content).length && locale === this.currentLocale) {
            return;
        }

        if(this.baseContentObj) {
            src = this.baseContentObj[locale];
            if (!src && this.defaultLocale) {
                src = this.baseContentObj[this.defaultLocale];
            }
            if (!src) {
                src = this.baseContentObj;
            }
        }

        this.currentLocale = locale;

        for (let key in target) {
            if (target.hasOwnProperty(key)) {
                delete target[key];
            }
        }

        for (let key in src) {
            if (src.hasOwnProperty(key)) {
                target[key] = src[key];
            }
        }
    }

    setDefaultLocale(locale: string) {
        this.defaultLocale = locale;
        if (!this.locale) {
            this.setLocale(locale);
        }
    }

    unregister() {
        this.unregisterCallback(this);
    }
}
