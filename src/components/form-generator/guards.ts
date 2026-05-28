import type { TFieldSchema, ITextField, ISelectField, ICheckboxField } from './types'

export const isTextField = (field: TFieldSchema): field is ITextField =>
  field.type === 'text' || field.type === 'email' || field.type === 'password'

export const isSelectField = (field: TFieldSchema): field is ISelectField =>
  field.type === 'select'

export const isCheckboxField = (field: TFieldSchema): field is ICheckboxField =>
  field.type === 'checkbox'
