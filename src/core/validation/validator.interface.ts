import {Exceptionable} from "src/core/common/types/exceptionable";
import {ValidationException} from "src/core/validation/validation.exception";

export interface ValidatorInterface<T, E extends ValidationException> {
    validate(payload: T): Exceptionable<void, E>;
}
