import { CognitoUser } from '@aws-amplify/auth'
import { Validator } from '.'

export enum UserRoles {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
  Nobody = 'nobody',
}

export const UserRoleColors = {
  [UserRoles.Admin]: 'red',
  [UserRoles.Editor]: 'orange',
  [UserRoles.Viewer]: 'blue',
  [UserRoles.Nobody]: 'grey',
}

export type User = {
  id: string
  email: string
  password: string
  nickname: string
  role?: UserRoles
  picture?: string
}

export type UserInvite = {
  email: string,
  role?: UserRoles
}

// from amplify
export type MFAMethods = 'TOTP' | 'SMS' | 'NOMFA' | 'SMS_MFA' | 'SOFTWARE_TOKEN_MFA'

export class CognitoUserWithAttributes extends CognitoUser {
  attributes: {
    email: string
    nickname: string
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

/**
 * Validators
 */
export const AuthValidator: Validator<User> = {
  nickname: { required: true, min: 3, max: 30 },
  email: { required: true, max: 255, email: true, confirmed: 'emailConfirm' },
  password: {
    required: true,
    confirmed: 'passwordConfirm',
    min: passwordPolicy.minLength,
    password: passwordPolicy,
  },
}

export const UserInviteValidator: Validator<User> = {
  email: { required: true, max: 255, email: true },
  role: { required: true, oneOf: Object.values(UserRoles) }
}
