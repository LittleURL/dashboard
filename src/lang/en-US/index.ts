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
  actions: 'Actions',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  deleteConfirm: 'Are you sure you want to delete this item?',
  details: 'Details',
  apiError: 'API Error ({code}): {message}'
}

export default {
  ...root,
  auth,
  settings,
  domains,
  links,
  validation,
}
