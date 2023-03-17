import { prefixString } from "~/helpers"
import { Validator, DomainID } from "~/types"

export type Link = {
  domain_id: DomainID,
  uri: string,
  target: string,
  description: string
}

const reservedUris = [
  '_littleurl'
].flatMap(uri => [uri, prefixString('/', uri)])

export const LinkValidator: Validator<Link> = {
  uri: { required: true, max: 1024, regex: /^(\/?[\w-]+)+$/, notPrefix: reservedUris },
  target: { required: true, max: 2048, regex: /^\w+:\/\/[\w\-?=/.]+$/ },
  description: { max: 255 },
}