import { ref, watch, type Ref } from 'vue'
import type { IFormSchema, TFormData, TFormErrors } from '@/components/form-generator/types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// кривой паттерн в схеме не должен ронять валидацию, считаем поле валидным
const matchesPattern = (pattern: string, value: string): boolean => {
  try {
    return new RegExp(pattern).test(value)
  } catch {
    return true
  }
}

export function useFormValidator(schema: IFormSchema, model: Ref<TFormData>) {
  const errors = ref<TFormErrors>({})
  const touched = ref<Record<string, boolean>>({})

  const validateField = (fieldModel: string): string => {
    const field = schema.fields.find(f => f.model === fieldModel)
    if (!field) return ''

    const value = model.value[fieldModel]

    if (field.required) {
      if (field.type === 'checkbox' && value === false) return 'Поле обязательно'
      if (field.type !== 'checkbox' && !value) return 'Поле обязательно'
    }

    // проверки, только для непустых текстовых значений
    if (field.type !== 'checkbox' && typeof value === 'string' && value !== '') {
      if ('minLength' in field && field.minLength !== undefined && value.length < field.minLength) {
        return `Минимум ${field.minLength} символов`
      }
      if ('maxLength' in field && field.maxLength !== undefined && value.length > field.maxLength) {
        return `Максимум ${field.maxLength} символов`
      }
      if (field.pattern) {
        if (!matchesPattern(field.pattern, value)) return 'Неверный формат'
      } else if (field.type === 'email' && !EMAIL_PATTERN.test(value)) {
        return 'Неверный формат'
      }
    }

    return ''
  }

  const validateAll = (): boolean => {
    const newErrors: TFormErrors = {}
    schema.fields.forEach(field => {
      touched.value[field.model] = true
      const error = validateField(field.model)
      if (error) newErrors[field.model] = error
    })
    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  // провалидировать поле и синхронизировать его ошибку
  const applyError = (fieldModel: string) => {
    const error = validateField(fieldModel)
    if (error) {
      errors.value[fieldModel] = error
    } else {
      delete errors.value[fieldModel]
    }
  }

  const markTouched = (fieldModel: string) => {
    touched.value[fieldModel] = true
    applyError(fieldModel)
  }

  const reset = () => {
    errors.value = {}
    touched.value = {}
  }

  // реактивно обновляем ошибки, но только для полей которые уже трогали
  watch(model, () => {
    Object.keys(touched.value).forEach(applyError)
  }, { deep: true })

  return { errors, touched, validateField, validateAll, markTouched, reset }
}
