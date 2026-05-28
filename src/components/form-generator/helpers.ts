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

//длина, заглавная, цифра, спецсимвол. по баллу за критерий
export const passwordScore = (password: string): number => {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-ZА-Я]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-zА-Яа-я0-9]/.test(password)) score += 1
  return score
}
