import { ValidationRule } from 'vee-validate/dist/types/types'

const passwordParams = ['lowercase', 'uppercase', 'numbers', 'symbols']

type PasswordArgs = {
  [K in typeof passwordParams[number]]?: boolean
}

// https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html
const symbolPattern = /[$*.{}()?"!@#%&,><':;|_~`=+\-[\]^/\\]/g

const rule: ValidationRule = {
  params: passwordParams,
  validate(value: String, args: PasswordArgs) {
    // leading/trailing whitespace
    if (!value.match(/^\S+$/)) {
      return false
    }

    // lowercase
    if (args.lowercase && !value.match(/[a-z]/g)) {
      return false
    }

    // uppercase
    if (args.uppercase && !value.match(/[A-Z]/g)) {
      return false
    }

    // numbers
    if (args.numbers && !value.match(/\d/g)) {
      return false
    }

    // symbols
    if (args.symbols && !value.match(symbolPattern)) {
      return false
    }

    return true
  },
}

export default rule
