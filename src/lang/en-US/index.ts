import auth from './auth'
import domains from './domains'
import settings from './settings'

const root = {
  new: 'New'
}

export default {
  ...root, auth, settings, domains
}
