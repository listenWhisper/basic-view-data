export class ErrorResponse{
    Code?: string;
    Msg?: string;
    Stacks?:string;

    constructor(options: Partial<ErrorResponse> = {}) {
        this.Code = options?.Code;
        this.Msg = options?.Msg;
        this.Stacks = options?.Stacks;
    }
}
