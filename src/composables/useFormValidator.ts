import { ref, watch, type Ref } from 'vue'
import type { IFormSchema, TFormData, TFormErrors } from '@/components/form-generator/types'

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

    // дальнейшие проверки только для текстовых значений
    if (field.type !== 'checkbox' && typeof value === 'string') {
      if ('minLength' in field && field.minLength !== undefined && value.length < field.minLength) {
        return `Минимум ${field.minLength} символов`
      }
      if (field.pattern && !new RegExp(field.pattern).test(value)) {
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

  const markTouched = (fieldModel: string) => {
    touched.value[fieldModel] = true
    const error = validateField(fieldModel)
    if (error) {
      errors.value[fieldModel] = error
    } else {
      delete errors.value[fieldModel]
    }
  }

  // реактивно обновляем ошибки, но только для полей которые уже трогали
  watch(model, () => {
    Object.keys(touched.value).forEach(fieldModel => {
      const error = validateField(fieldModel)
      if (error) {
        errors.value[fieldModel] = error
      } else {
        delete errors.value[fieldModel]
      }
    })
  }, { deep: true })

  return { errors, touched, validateField, validateAll, markTouched }
}
