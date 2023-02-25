import { CognitoUser } from '@aws-amplify/auth'
import { Validator } from '.'

export enum UserRoles {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
  Nobody = 'nobody',
}

export type User = {
  id: string
  email: string
  password: string
  nickname: string
  role?: UserRoles
  picture?: string
}

// from amplify
export type MFAMethods = 'TOTP' | 'SMS' | 'NOMFA' | 'SMS_MFA' | 'SOFTWARE_TOKEN_MFA'

export class CognitoUserWithAttributes extends CognitoUser {
  attributes: {
    email: string
  }
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
