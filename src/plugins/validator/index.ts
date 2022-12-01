import { Plugin } from '@nuxt/types'
import { configure, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import passwordValidator from './password'

const veeValidatePlugin: Plugin = ({ i18n }) => {
  // get messages from i18n
  configure({
    defaultMessage: (_field, values) => {
      // values._field_ = i18n.t(`fields.${field}`).toString()
      return i18n.t(`validation.${values._rule_}`, values).toString()
    },
  })

  // apply all available rules
  for (const [key, value] of Object.entries(rules)) {
    extend(key, value);
  }

  // custom rules
  extend('password', passwordValidator)
}

export default veeValidatePlugin
