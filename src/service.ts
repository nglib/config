import { Injectable, Inject, Provider, OpaqueToken } from "@angular/core";

export interface IConfigInterface {
    [K: string]: any;
}

export const CONFIG = new OpaqueToken("IConfigInterface");

@Injectable()
export class ConfigService {
    private _items: IConfigInterface;

    constructor(@Inject(CONFIG) items: IConfigInterface) {
        this._items = items || {};
    }

    get(path: string, defaultValue?: any) {
        if(arguments.length == 1) defaultValue = null;

        let value = this._items;

        if (path == null || path === '') {
            return value;
        }

        if(typeof path !== 'string') {
            throw new TypeError('The path must be a string');
        }

        if(path in value) {
            return value[path];
        }
        const keys = path.split('.');
        let notExist = false;

        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];

            if (!Object.prototype.hasOwnProperty.call(value, key)) {
                notExist = true;
                break;
            }
            value = value[key];
        }

        return notExist === false ? value : defaultValue;
    }

    set(path: string, value: any) {
        const keys: string[] = path.split('.');
        let nested = this._items;

        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];

            if(i !== len - 1) {
                if (!Object.prototype.hasOwnProperty.call(nested, key) || typeof nested[key] !== 'object' || nested[key] == null) nested[key] = {};
                nested = nested[key];
            }
            else {
                nested[key] = value;
            }
        }
    }

    has(path: string) {
        if (path == null || path === '') {
            return false;
        }        
        
        const keys:string[] = path.split('.');
        let value = this._items;

        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];

            if (!value || !Object.prototype.hasOwnProperty.call(value, key)) {
                return false;
            }
            value = value[key];
        }

        return true;
    }

    all(): IConfigInterface {
        return this._items;
    }
}

export function provideConfig(config: IConfigInterface = {}): Provider[] {
    return [
        {
            provide: ConfigService,
            deps: [],
            useFactory: () => {
                return new ConfigService(config);
            }
        }
    ];
}
