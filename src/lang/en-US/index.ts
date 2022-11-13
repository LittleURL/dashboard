import auth from './auth'
import domains from './domains'
import links from './links'
import settings from './settings'
import validation from './validation'

const root = {
  new: 'New',
  reload: 'Reload',
  searchPrefix: 'Filter by prefix',
  example: 'Example',
  save: 'Save',
}

export default {
  ...root,
  auth,
  settings,
  domains,
  links,
  validation,
}
