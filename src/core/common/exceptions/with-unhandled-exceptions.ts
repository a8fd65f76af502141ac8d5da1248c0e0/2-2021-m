import {AdapterException} from "src/core/common/exceptions/adapter.exception";

export type WithUnhandledExceptions<T extends Error | never> = T | AdapterException | Error;
