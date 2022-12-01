import { Validator } from '.'

export enum UserRole {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
  Nobody = 'nobody',
}

export type User = {
  email: string
  password: string
  nickname: string
}

const envPasswordPolicy = JSON.parse(process.env.cognitoPasswordPolicy)
export const passwordPolicy = {
  minLength: envPasswordPolicy.minimum_length || 8,
  lowercase: envPasswordPolicy.require_lowercase || true,
  uppercase: envPasswordPolicy.require_uppercase || true,
  numbers: envPasswordPolicy.require_numbers || true,
  symbols: envPasswordPolicy.require_symbols || true,
}

export const AuthValidator: Validator<User> = {
  nickname: { required: true, min: 3, max: 32 },
  email: { required: true, max: 255, email: true, confirmed: 'emailConfirm' },
  password: {
    required: true,
    confirmed: 'passwordConfirm',
    min: passwordPolicy.minLength,
    password: passwordPolicy,
  },
}
