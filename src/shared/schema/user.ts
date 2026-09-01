export const createUserSchema = {
  $id: 'https://example.com/schemas/user.json',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
      maxLength: 254
    },
    password: {
      type: 'string',
      // pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
      minLength: 3,
      maxLength: 100,
      errorMessage: "password length must be 3 or more."
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100
    },
    age: {
      type: 'integer',
      minimum: 0,
      maximum: 150
    },
    // roles: {
    //   type: 'array',
    //   items: {
    //     type: 'string',
    //     enum: ['admin', 'editor', 'viewer']
    //   },
    //   minItems: 1,
    //   maxItems: 5
    // }
  },
  required: [
    'email',
    'password'
    // 'name',
    // 'age',
    // 'roles'
  ],
  additionalProperties: false
}
