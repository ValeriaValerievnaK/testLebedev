import type { IFormSchema, TFieldSchema, TFormData } from './types'

export const asString = (value: string | boolean | undefined): string =>
  typeof value === 'string' ? value : ''

export const asBool = (value: string | boolean | undefined): boolean =>
  typeof value === 'boolean' ? value : false

export const buildDefaults = (schema: IFormSchema): TFormData => {
  const defaults: TFormData = {}
  schema.fields.forEach(field => {
    defaults[field.model] = field.type === 'checkbox' ? false : ''
  })
  return defaults
}

export const displayValue = (field: TFieldSchema, data: TFormData): string => {
  const value = data[field.model]
  if (typeof value === 'boolean') return value ? 'Да' : 'Нет'
  if (typeof value === 'string') return value
  return ''
}
