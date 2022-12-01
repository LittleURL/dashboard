import ruleI18n from '~/lang/en-US/validation'

export * from './domain'
export * from './links'
export * from './auth'

export type Validator<T> = {
  [K in keyof Partial<T>]: {
    [K in keyof typeof ruleI18n]?: any
  }
}