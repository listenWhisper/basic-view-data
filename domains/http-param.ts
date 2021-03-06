export interface HttpParameterCodec {
    encodeKey(key: string): string;
    encodeValue(value: string): string;

    decodeKey(key: string): string;
    decodeValue(value: string): string;
}

export interface HttpParamsOptions {
    fromString?: string;

    fromObject?: {[param: string]: string|number|boolean|ReadonlyArray<string|number|boolean>};

    encoder?: HttpParameterCodec;
}


interface Update {
    param: string;
    value?: string|number|boolean;
    op: 'a'|'d'|'s';
}

function standardEncoding(v: string): string {
    return encodeURIComponent(v)
        .replace(/%40/gi, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/gi, '$')
        .replace(/%2C/gi, ',')
        .replace(/%3B/gi, ';')
        .replace(/%2B/gi, '+')
        .replace(/%3D/gi, '=')
        .replace(/%3F/gi, '?')
        .replace(/%2F/gi, '/');
}

// @ts-ignore
function paramParser(rawParams: string, codec: HttpParameterCodec): Map<string, string[]> {
    // @ts-ignore
    const map = new Map<string, string[]>();
    if (rawParams.length > 0) {
        const params: string[] = rawParams.replace(/^\?/, '').split('&');
        params.forEach((param: string) => {
            const eqIdx = param.indexOf('=');
            const [key, val]: string[] = eqIdx == -1 ?
                [codec.decodeKey(param), ''] :
                [codec.decodeKey(param.slice(0, eqIdx)), codec.decodeValue(param.slice(eqIdx + 1))];
            const list = map.get(key) || [];
            list.push(val);
            map.set(key, list);
        });
    }
    return map;
}

export class HttpUrlEncodingCodec implements HttpParameterCodec {
    encodeKey(key: string): string {
        return standardEncoding(key);
    }

    encodeValue(value: string): string {
        return standardEncoding(value);
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string) {
        return decodeURIComponent(value);
    }
}

function valueToString(value: string|number|boolean): string {
    return `${value}`;
}

export class HttpParams{
    // @ts-ignore
    private map: Map<string, string[]>|null;
    private encoder: HttpParameterCodec;
    private updates: Update[]|null = null;
    private cloneFrom: HttpParams|null = null;

    constructor(options: HttpParamsOptions = {} as HttpParamsOptions) {
        this.encoder = options.encoder || new HttpUrlEncodingCodec();
        if (!!options.fromString) {
            if (!!options.fromObject) {
                throw new Error(`Cannot specify both fromString and fromObject.`);
            }
            this.map = paramParser(options.fromString, this.encoder);
        } else if (!!options.fromObject) {
            // @ts-ignore
            this.map = new Map<string, string[]>();
            Object.keys(options.fromObject).forEach(key => {
                const value = (options.fromObject as any)[key];
                this.map!.set(key, Array.isArray(value) ? value : [value]);
            });
        } else {
            this.map = null;
        }
    }

    has(param: string): boolean {
        this.init();
        return this.map!.has(param);
    }

    get(param: string): string|null {
        this.init();
        const res = this.map!.get(param);
        return !!res ? res[0] : null;
    }

    getAll(param: string): string[]|null {
        this.init();
        return this.map!.get(param) || null;
    }

    keys(): string[] {
        this.init();
        // @ts-ignore
        return Array.from(this.map!.keys());
    }

    append(param: string, value: string|number|boolean): HttpParams {
        return this.clone({param, value, op: 'a'});
    }

    appendAll(params: {[param: string]: string|number|boolean|ReadonlyArray<string|number|boolean>}):
        HttpParams {
        const updates: Update[] = [];
        Object.keys(params).forEach(param => {
            const value = params[param];
            if (Array.isArray(value)) {
                value.forEach(_value => {
                    updates.push({param, value: _value, op: 'a'});
                });
            } else {
                updates.push({param, value: value as (string | number | boolean), op: 'a'});
            }
        });
        return this.clone(updates);
    }

    set(param: string, value: string|number|boolean): HttpParams {
        return this.clone({param, value, op: 's'});
    }

    delete(param: string, value?: string|number|boolean): HttpParams {
        return this.clone({param, value, op: 'd'});
    }

    toString(): string {
        this.init();
        return this.keys()
            .map(key => {
                const eKey = this.encoder.encodeKey(key);
                return this.map!.get(key)!.map(value => eKey + '=' + this.encoder.encodeValue(value))
                    .join('&');
            })
            .filter(param => param !== '')
            .join('&');
    }

    private clone(update: Update|Update[]): HttpParams {
        const clone = new HttpParams({encoder: this.encoder} as HttpParamsOptions);
        clone.cloneFrom = this.cloneFrom || this;
        clone.updates = (this.updates || []).concat(update);
        return clone;
    }

    private init() {
        if (this.map === null) {
            // @ts-ignore
            this.map = new Map<string, string[]>();
        }
        if (this.cloneFrom !== null) {
            this.cloneFrom.init();
            this.cloneFrom.keys().forEach(key => this.map!.set(key, this.cloneFrom!.map!.get(key)!));
            this.updates!.forEach(update => {
                switch (update.op) {
                    case 'a':
                    case 's':
                        const base = (update.op === 'a' ? this.map!.get(update.param) : undefined) || [];
                        base.push(valueToString(update.value!));
                        this.map!.set(update.param, base);
                        break;
                    case 'd':
                        if (update.value !== undefined) {
                            let base = this.map!.get(update.param) || [];
                            const idx = base.indexOf(valueToString(update.value));
                            if (idx !== -1) {
                                base.splice(idx, 1);
                            }
                            if (base.length > 0) {
                                this.map!.set(update.param, base);
                            } else {
                                this.map!.delete(update.param);
                            }
                        } else {
                            this.map!.delete(update.param);
                            break;
                        }
                }
            });
            this.cloneFrom = this.updates = null;
        }
    }
}
