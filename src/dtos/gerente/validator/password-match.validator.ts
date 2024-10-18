import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'isPasswordMatch', async: false })
  export class IsPasswordMatch implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
      const object = args.object as any;
      return object.password === value;
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'La contraseña ingresada no coincide con su confirmación';
    }
  }