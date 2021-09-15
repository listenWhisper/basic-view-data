import {RequestTypeEnum} from '../enums';
import {EnumType, UtilTools} from '../share';

export class RequestService {
    constructor(
        private http?: any
    ) {
    }

    private _proxy = ''; // 代理地址

    public get proxy() {
        return this._proxy;
    }

    public set proxy(proxy: string) {
        this._proxy = proxy;
    }

    private _func: any = () => {}; // 代理地址

    public get func() {
        return this._func;
    }

    public set func(func : any) {
        this._func = func;
    }

    private _requestType: EnumType<RequestTypeEnum> = RequestTypeEnum.angular; // 请求方式 根据不同环境 不同设置

    public get requestType() {
        return this._requestType;
    }

    public set requestType(requestType: EnumType<RequestTypeEnum>) {
        this._requestType = requestType;
    }

    private _optionParam: Record<any, any> = {};

    public get optionParam() {
        return this._optionParam;
    }

    public set optionParam(optionParam: Record<string, any>) {
        this._optionParam = optionParam;
    }

    private _contentType: Record<string, any> = {'content-type': 'application/x-www-form-urlencoded'}; // 默认请求头

    public get contentType() {
        return this._contentType;
    }

    public set contentType(contentType: Record<string, any>) {
        this._contentType = contentType;
    }

    public get<T>(url: string, data: Record<string, any> = {}, header: Record<string, any> = {}, ) {
        url = UtilTools.timestamp(url);
        let options = {
            method: 'POST',
            url,
            header: Object.assign(this.contentType, header),
            data
        }
        Object.assign(options, this.optionParam);
        return this.requestOption<T>(options);
    }

    public post<T>(url: string, data: Record<string, any> = {}, header: Record<string, any> = {}) {
        url = UtilTools.timestamp(url);
        let options = {
            method: 'POST',
            url,
            header: Object.assign(this.contentType, header),
            data
        }
        Object.assign(options, this.optionParam);
        return this.requestOption<T>(options);
    }

    private requestOption<T>(options: Record<string, any> = {}): Promise<any> {
        return new Promise((
            resolve: (res: T) => void,
            reject: (err: { Code?: string; Msg?: string; Stacks?: string }) => void
        ) => {
            options.success = (response: any) => {
                if (response.statusCode !== 200) {
                    reject(response);
                }
                resolve(response);
            };
            options.fail = (err: any) => {
                resolve(err);
            }
            this.request(options);
        });
    }

    private request(options: Record<string, any>) {
        switch (this.requestType) {
            case RequestTypeEnum.angular:
                this.angularRequest(options);
                break;
            case RequestTypeEnum.uni:
                this.uniRequest(options);
                break;
            case RequestTypeEnum.wx:
                this.wxRequest(options);
                break;
            case RequestTypeEnum.vue:
                this.vueRequest(options);
                break;
            default:
                throw new Error('未找到定向请求,请更改请求类型');
        }
    }

    private angularRequest(options: Record<string, any>) {
        // @ts-ignore
        this.http.request(options.method, options.url, options).subscribe((res: any) => {
            options?.success(res);
        }, (err: any) => {
            options?.fail(err);
        });
    }


    private uniRequest(options: Record<string, any>) {
        // @ts-ignore
        uni.request(options);
    }

    private wxRequest(options: Record<string, any>) {
        // @ts-ignore
        wx.request(options);
    }

    private vueRequest(options: Record<string, any>) {

    }
}

