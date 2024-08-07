import { validate, ValidationError } from 'class-validator';
// Function to handle validation errors for a given DTO.
export async function handleValidationErrors<T extends object>(dto: T):
  Promise<ValidationError[] | undefined> {
  const errors = await validate(dto);
  if (errors.length === 0) {
    return undefined;
  }
  return errors.map((error: ValidationError) => ({
    property: error.property,
    constraints: error.constraints,
  }));
}
