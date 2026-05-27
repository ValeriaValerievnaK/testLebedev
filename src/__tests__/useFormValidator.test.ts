import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { useFormValidator } from '@/composables/useFormValidator'
import type { IFormSchema, TFormData } from '@/components/form-generator/types'

const schema: IFormSchema = {
  fields: [
    { type: 'text', label: 'Имя', model: 'name', required: true },
    { type: 'email', label: 'Email', model: 'email', required: true },
    { type: 'password', label: 'Пароль', model: 'password', required: true, minLength: 6 },
    { type: 'select', label: 'Роль', model: 'role', options: ['Админ', 'Пользователь'], required: true },
    { type: 'checkbox', label: 'Согласен', model: 'terms', required: true }
  ]
}

describe('useFormValidator', () => {
  it('validateAll returns false and sets errors when required fields are empty', () => {
    const model = ref<TFormData>({ name: '', email: '', password: '', role: '', terms: false })
    const { validateAll, errors } = useFormValidator(schema, model)

    expect(validateAll()).toBe(false)
    expect(errors.value.name).toBe('Поле обязательно')
    expect(errors.value.terms).toBe('Поле обязательно')
  })

  it('validateAll returns true when all fields are valid', () => {
    const model = ref<TFormData>({
      name: 'Иван', email: 'ivan@mail.ru',
      password: 'secret123', role: 'Админ', terms: true
    })
    const { validateAll } = useFormValidator(schema, model)

    expect(validateAll()).toBe(true)
  })

  it('validateField catches minLength violation', () => {
    const model = ref<TFormData>({ name: '', email: '', password: '123', role: '', terms: false })
    const { validateField } = useFormValidator(schema, model)

    expect(validateField('password')).toBe('Минимум 6 символов')
  })

  it('validateField catches pattern violation', () => {
    const schemaWithPattern: IFormSchema = {
      fields: [{ type: 'text', label: 'Код', model: 'code', pattern: '^[0-9]+$' }]
    }
    const model = ref<TFormData>({ code: 'abc' })
    const { validateField } = useFormValidator(schemaWithPattern, model)

    expect(validateField('code')).toBe('Неверный формат')
  })

  it('markTouched shows error for invalid field', () => {
    const model = ref<TFormData>({ name: '', email: '', password: '', role: '', terms: false })
    const { markTouched, errors } = useFormValidator(schema, model)

    markTouched('name')
    expect(errors.value.name).toBe('Поле обязательно')
  })

  it('error clears reactively when touched field becomes valid', async () => {
    const model = ref<TFormData>({ name: '', email: '', password: '', role: '', terms: false })
    const { markTouched, errors } = useFormValidator(schema, model)

    markTouched('name')
    expect(errors.value.name).toBe('Поле обязательно')

    model.value = { ...model.value, name: 'Иван' }
    await nextTick()

    expect(errors.value.name).toBeUndefined()
  })

  it('untouched field stays silent even if invalid', () => {
    const model = ref<TFormData>({ name: '', email: '', password: '', role: '', terms: false })
    const { errors } = useFormValidator(schema, model)

    expect(errors.value.name).toBeUndefined()
  })
})
