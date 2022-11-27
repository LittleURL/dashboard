import { Auth, OpenIDConnectScheme } from '@nuxtjs/auth-next'
import base64url from 'base64url'
import { Link } from './types'

export const getToken = ($auth: Auth) => {
  const strategy = $auth.strategy as OpenIDConnectScheme
  return strategy.token.get()
}

export const linkId = (link: Link): string => base64url(link.uri)

export const prefixString = (prefix: string, value: string) => {
  return value.startsWith(prefix) ? value : prefix + value
}
