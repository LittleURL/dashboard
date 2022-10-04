import { Auth } from "@nuxtjs/auth-next"

export default function({ $auth }: { $auth: Auth }) {
  $auth.onError((error, name) => {
    // eslint-disable-next-line no-console
    console.error(name, error)
  })
}
