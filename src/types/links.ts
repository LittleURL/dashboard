import { DomainID } from "./domain"

export type Link = {
  domain_id: DomainID,
  uri: string,
  target: string,
  description: string
}