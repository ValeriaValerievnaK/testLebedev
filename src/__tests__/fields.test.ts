import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FieldText from '@/components/form-generator/fields/FieldText.vue'
import FieldSelect from '@/components/form-generator/fields/FieldSelect.vue'
import FieldCheckbox from '@/components/form-generator/fields/FieldCheckbox.vue'
import type { ITextField, ISelectField, ICheckboxField } from '@/components/form-generator/types'

describe('field accessibility', () => {
  it('FieldText links its label to the input', () => {
    const field: ITextField = { type: 'text', label: 'Имя', model: 'name' }
    const wrapper = mount(FieldText, { props: { field, value: '' } })

    const id = wrapper.get('input').attributes('id')
    expect(id).toBeTruthy()
    expect(wrapper.get('label').attributes('for')).toBe(id)
  })

  it('FieldText exposes its error to assistive tech when invalid', () => {
    const field: ITextField = { type: 'text', label: 'Имя', model: 'name' }
    const wrapper = mount(FieldText, { props: { field, value: '', error: 'Поле обязательно' } })

    const input = wrapper.get('input')
    const errorEl = wrapper.get('.field__error')

    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(errorEl.attributes('id'))
    expect(errorEl.attributes('id')).toBeTruthy()
  })

  it('FieldText has no error aria when valid', () => {
    const field: ITextField = { type: 'text', label: 'Имя', model: 'name' }
    const wrapper = mount(FieldText, { props: { field, value: 'ok' } })

    const input = wrapper.get('input')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBeUndefined()
  })

  it('FieldSelect links its label to the select', () => {
    const field: ISelectField = { type: 'select', label: 'Роль', model: 'role', options: ['A', 'B'] }
    const wrapper = mount(FieldSelect, { props: { field, value: '' } })

    const id = wrapper.get('select').attributes('id')
    expect(id).toBeTruthy()
    expect(wrapper.get('label').attributes('for')).toBe(id)
  })

  it('FieldCheckbox exposes its error to assistive tech when invalid', () => {
    const field: ICheckboxField = { type: 'checkbox', label: 'Согласен', model: 'terms' }
    const wrapper = mount(FieldCheckbox, { props: { field, value: false, error: 'Поле обязательно' } })

    const input = wrapper.get('input')
    const errorEl = wrapper.get('.field__error')

    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(errorEl.attributes('id'))
    expect(errorEl.attributes('id')).toBeTruthy()
  })
})
