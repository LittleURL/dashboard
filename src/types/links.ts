import { DomainID } from "./domain"

export type Link = {
  domain_id: DomainID,
  uri: string,
  target: string,
  description: string
}

export const LinkValidator: Validator<Link> = {
  uri: { required: true, max: 1024, regex: /^(\/?[\w-]+)+$/ },
  target: { required: true, max: 2048, regex: /^\w+:\/\/[\w\-?=/.]+$/ },
  description: { max: 255 }
}