import { Plugin } from '@nuxt/types'
import { configure, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'

const veeValidatePlugin: Plugin = ({ i18n }) => {
  // get messages from i18n
  configure({
    defaultMessage: (field, values) => {
      // values._field_ = i18n.t(`fields.${field}`).toString()
      return i18n.t(`validation.${values._rule_}`, values).toString()
    },
  })

  // apply all available rules
  Object.keys(rules).forEach(rule => {
    // eslint-disable-next-line import/namespace
    extend(rule, rules[rule]);
  });
}

export default veeValidatePlugin
