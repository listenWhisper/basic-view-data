declare interface Promise<T>{
    finally<TResult = never>(next?: ((reason: any) => TResult)): Promise<T | TResult>;
}

