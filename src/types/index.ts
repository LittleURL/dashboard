import { messages as ruleI18n } from 'vee-validate/dist/locale/en.json'

export * from './domain'
export * from './links'
export * from './auth'

export type Validator<T> = {
  [K in keyof Partial<T>]: {
    [K in keyof typeof ruleI18n]?: any
  }
}