import {ErrorResponse} from '../domains/error-response.domain';
import {RequestTypeEnum} from '../enums';
import {EnumType, UtilTools} from '../share';
// @ts-ignore
import {HttpClient} from '@angular/common/http';

export class RequestService {
    constructor(
        private http: HttpClient
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

    public set func(func: () => {}) {
        this._func = func;
    }

    private _requestType: EnumType<RequestTypeEnum> = RequestTypeEnum.angular; // 请求方式 根据不同环境 不同设置

    public get requestType() {
        return this._requestType;
    }

    public set requestType(requestType: EnumType<RequestTypeEnum>) {
        this._requestType = requestType;
    }

    private _contentType: Record<string, any> = {'content-type': 'application/x-www-form-urlencoded'}; // 默认请求头

    public get contentType() {
        return this._contentType;
    }

    public set contentType(contentType: Record<string, any>) {
        this._contentType = contentType;
    }

    public get<T>(url: string, data: Record<string, any> = {}, header: Record<string, any> = {}) {
        url = UtilTools.timestamp(url);
        return this.requestOption<T>({
            method: 'GET',
            url,
            header: Object.assign(this.contentType, header),
            data
        });
    }

    public post<T>(url: string, data: Record<string, any> = {}, header: Record<string, any> = {}) {
        url = UtilTools.timestamp(url);
        return this.requestOption<T>({
            method: 'POST',
            url,
            header: Object.assign(this.contentType, header),
            data
        },);
    }

    private requestOption<T>(options: Record<string, any> = {}): Promise<any> {
        return new Promise((
            resolve: (res: T) => void,
            reject: (err: { Code?: string; Msg?: string; Stacks?: string }) => void
        ) => {
            options.success = (response: any) => {
                if (response.statusCode !== 200) {
                    resolve(response);
                }
                if (typeof response.data === 'object') {
                    if (response.data.hasOwnProperty('error_response')) {
                        response.data = new ErrorResponse(response.data.error_response);
                        reject(response);
                    }
                    resolve(response);
                }
            };
            this.request(options);
        });
    }

    private request(options: Record<string, any>) {
        this._func(options);
    }

    private angularRequest(options: Record<string, any>) {
        this.http.post(options?.url, options?.data, options?.header).subscribe((res: any) => {
            options?.success(res);
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

