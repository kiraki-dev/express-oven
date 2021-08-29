export type Nullable<T> = T | null;
export type Optional<T> = Nullable<T> | undefined;
export type WithOptional<T, K extends keyof T = keyof T> = Omit<T, K> & {
  [U in K]?: Optional<T[U]>;
}
