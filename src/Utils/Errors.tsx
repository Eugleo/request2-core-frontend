export type Errors<T> = { [k in keyof T]?: T[k] };
