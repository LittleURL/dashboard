import { UserRoles } from "./auth"
import { Validator } from '.'

export type DomainID = string

export type Domain = {
  id: DomainID,
  domain: string
  description?: string
  default_target?: string
  user_role: UserRoles
}

export const DomainValidator: Validator<Domain> = {
  description: { max: 255 },
  default_target: { max: 2048, regex: /^\w+:\/\/[\w\-?=/.]+$/ }
}