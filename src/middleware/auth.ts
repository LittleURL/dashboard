import { Auth } from 'aws-amplify'

const whitelistedRoutes = ['/login']

export default async ({ redirect, route }) => {
  if (!whitelistedRoutes.includes(route.fullPath)) {
    try {
      await Auth.currentSession()
    } catch (err) {
      return redirect('/login')
    }

    if (!(await Auth.currentSession()).isValid()) {
      return redirect('/login')
    }
  }
}
