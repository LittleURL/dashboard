import veeValidate from 'vee-validate/dist/locale/en.json'

export default {
  ...veeValidate.messages,
  password: 'The {_field_} field format is invalid',
  notPrefix: 'The {_field_} must not begin with {_value_}'
}