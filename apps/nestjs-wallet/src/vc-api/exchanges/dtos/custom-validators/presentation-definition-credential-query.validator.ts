import { IPresentationDefinition, PEX, Status } from '@sphereon/pex';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * https://github.com/typestack/class-validator#custom-validation-decorators
 */
export function IsPresentationDefinitionCredentialQuery(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPresentationDefinitionCredentialQuery',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: IPresentationDefinition, args: ValidationArguments) {
          const pex = new PEX();
          const validated = pex.validateDefinition(value);
          if (Array.isArray(validated)) {
            validated.forEach((checked) => {
              if (checked.status === Status.ERROR || checked.status === Status.WARN) {
                return false;
              }
            });
          } else {
            if (validated.status === Status.ERROR || validated.status === Status.WARN) {
              return false;
            }
          }
          return true;
        }
      }
    });
  };
}
