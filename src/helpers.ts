import { Auth, OpenIDConnectScheme } from "@nuxtjs/auth-next";

export const getToken = ($auth: Auth) => {
  const strategy = $auth.strategy as OpenIDConnectScheme
  return strategy.token.get()
}