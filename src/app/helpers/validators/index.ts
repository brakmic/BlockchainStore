import { EmailValidator } from './email.validator';
import { EqualPasswordsValidator } from './equalPasswords.validator';

export const BCS_VALIDATORS = [
    EmailValidator,
    EqualPasswordsValidator
];
