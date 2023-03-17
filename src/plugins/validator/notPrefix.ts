import { ValidationRule } from 'vee-validate/dist/types/types'

const rule: ValidationRule = {
  validate(value: string, args: string[]) {
    for (const exclusion of args) {
      if (value.startsWith(exclusion)) return false
    }

    return true
  },
}

export default rule
