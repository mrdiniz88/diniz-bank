import BadRequest from "../errors/BadRequest";

const validateRequiredFields = (
  object: Record<string, any>,
  fieldTypes: Record<string, string>,
  requiredFields: string[]
) => {
  const errors = [];

  for (const field of requiredFields) {
    for (const fieldName in fieldTypes) {
      if (object.hasOwnProperty(fieldName) && fieldName === field) {
        const fieldType = fieldTypes[fieldName];
        if (typeof object[fieldName] !== fieldType) {
          errors.push(`${fieldName} should be of type ${fieldType}`);
        }
      }
    }

    if (object[field] === undefined || object[field] === null) {
      errors.push(`${field} is required`);
    }
  }

  if (errors.length !== 0) {
    throw new BadRequest(errors);
  }
};

export default validateRequiredFields;
