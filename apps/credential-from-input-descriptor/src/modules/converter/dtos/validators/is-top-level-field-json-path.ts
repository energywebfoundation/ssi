import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

@ValidatorConstraint({ async: false })
export class IsTopLevelFieldJsonPathConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    if (!value.match(/^\$\..+$/)) {
      return false;
    }

    if (value.split('.').length !== 2) {
      return false;
    }

    return true;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} value must be a JSON path string defining top-level property`;
  }
}

export function IsTopLevelFieldJsonPath(options?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsTopLevelFieldJsonPathConstraint
    });
  };
}
