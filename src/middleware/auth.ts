import { Middleware } from '@nuxt/types'
import { Auth } from 'aws-amplify'

const whitelistedRoutes = ['/login']

const authMiddleware: Middleware = async ({ redirect, route }) => {
  if (!whitelistedRoutes.includes(route.path)) {
    try {
      const session = await Auth.currentSession()
      if (!session.isValid()) {
        throw new Error('Invalid session')
      }
    } catch (err) {
      return redirect(401, '/login', { r: encodeURIComponent(route.fullPath) })
    }
  }
}

export default authMiddleware
