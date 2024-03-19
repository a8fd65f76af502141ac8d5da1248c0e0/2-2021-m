import {Nothing} from "./nothing";
import {WithUnhandledExceptions} from "../exceptions/with-unhandled-exceptions";

export type Exceptionable<T, E extends Error> = [T, Nothing] | [Nothing, WithUnhandledExceptions<E>];
export type ExceptionablePromise<T, E extends Error> = Promise<Exceptionable<T, E>>;
