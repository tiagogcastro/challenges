import { ValidationError } from 'yup';

type Errors = {
  field: string | undefined;
  message: string;
}

export function yupGetValidationErrors(err: ValidationError): Errors[] {
  return err.inner.map(error => {
    return {
      field: error.path,
      message: error.message
    }
  });
}