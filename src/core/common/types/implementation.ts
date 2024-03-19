// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Implementation<T> {
    new (...args: unknown[]): T;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface TransactionalImplementation<T, D extends unknown[]> extends Implementation<T> {
    new (...args: D): T;
}
