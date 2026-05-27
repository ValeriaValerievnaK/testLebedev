export interface IBaseField {
  label: string
  model: string
  required?: boolean
  pattern?: string
  placeholder?: string
}

export interface ITextField extends IBaseField {
  type: 'text' | 'email' | 'password'
  minLength?: number
  maxLength?: number
}

export interface ISelectField extends IBaseField {
  type: 'select'
  options: string[]
}

export interface ICheckboxField extends IBaseField {
  type: 'checkbox'
}

export type TFieldSchema = ITextField | ISelectField | ICheckboxField

export interface IFormSchema {
  fields: TFieldSchema[]
}

export type TFormData = Record<string, string | boolean>
export type TFormErrors = Record<string, string>
