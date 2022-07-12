import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

export const allowedFieldNames = [
  '@context',
  'credentialSubject',
  'id',
  'issuanceDate',
  'issuer',
  'proof',
  'type'
];

@ValidatorConstraint({ async: false })
export class IsAllowedFieldJsonPathKeyConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    if (value.split('.').length !== 2) {
      return false;
    }

    if (!allowedFieldNames.includes(value.split('.')[1])) {
      return false;
    }

    return true;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${
      validationArguments.property
    } property key name value must be one of the allowed string values: ${allowedFieldNames.join()}`;
  }
}

export function IsAllowedFieldJsonPathKey(options?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsAllowedFieldJsonPathKeyConstraint
    });
  };
}
