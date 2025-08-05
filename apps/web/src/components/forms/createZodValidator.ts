export function createZodValidator<T>(schema: any, field: keyof T) {
  return ({value}: {value: any}) => {
    const result = schema.safeParse({[field]: value});
    if (!result.success) {
      const fieldError = result.error.issues.find((issue) => issue.path[0] === field);
      return fieldError?.message;
    }
    return undefined;
  };
}
