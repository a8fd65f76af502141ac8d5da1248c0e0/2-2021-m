import {Exceptionable} from "src/core/common/types/exceptionable";
import {ValidationException} from "src/core/validation/validation.exception";
import {ValidatorInterface} from "src/core/validation/validator.interface";

export abstract class AbstractFirstFailValidatorImpl<T, E extends ValidationException> implements ValidatorInterface<T, E> {
    protected constructor(protected readonly validators: Readonly<ValidatorInterface<T, E>[]>) {}

    public validate(payload: T): Exceptionable<void, E> {
        for (const validator of this.validators) {
            const [, err] = validator.validate(payload);
            if (err) return [undefined, err];
        }
        return [undefined, undefined];
    }

    public getValidators() {
        return this.validators;
    }
}
