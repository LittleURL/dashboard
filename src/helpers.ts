import { Auth, OpenIDConnectScheme } from '@nuxtjs/auth-next'
import base64url from 'base64url'
import { v4 as uuid } from 'uuid'
import { Link } from './types'
import { Alert, AlertType } from './types/alert'

export const getToken = ($auth: Auth) => {
  const strategy = $auth.strategy as OpenIDConnectScheme
  return strategy.token.get()
}

export const linkId = (link: Link): string => base64url(link.uri)

export const prefixString = (prefix: string, value: string) => {
  return value.startsWith(prefix) ? value : prefix + value
}

export const successAlert = (text: string, timeout: number = 5000): Alert => ({
  id: uuid(),
  type: AlertType.Success,
  text,
  timeout,
})
