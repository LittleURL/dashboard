export enum AlertType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error'
}

export type Alert = {
  id: string,
  type: AlertType
  dismissible?: boolean
  text: string
  details?: string | Object
  timeout?: number
}