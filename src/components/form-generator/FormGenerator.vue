<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { IFormSchema, TFormData, TFieldSchema, ITextField, ISelectField, ICheckboxField } from './types'
import { useFormValidator } from '@/composables/useFormValidator'
import FieldText from './fields/FieldText.vue'
import FieldPassword from './fields/FieldPassword.vue'
import FieldSelect from './fields/FieldSelect.vue'
import FieldCheckbox from './fields/FieldCheckbox.vue'

const props = defineProps<{
  schema: IFormSchema
  title?: string
}>()
const model = defineModel<TFormData>({ required: true })
const emit = defineEmits<{ submit: [data: TFormData] }>()

const { errors, validateAll, markTouched, reset } = useFormValidator(props.schema, model)

const submitting = ref(false)
const done = ref(false)

const isTextField = (f: TFieldSchema): f is ITextField =>
  f.type === 'text' || f.type === 'email' || f.type === 'password'

const isSelectField = (f: TFieldSchema): f is ISelectField =>
  f.type === 'select'

const isCheckboxField = (f: TFieldSchema): f is ICheckboxField =>
  f.type === 'checkbox'

const asString = (v: string | boolean): string =>
  typeof v === 'string' ? v : ''

const asBool = (v: string | boolean): boolean =>
  typeof v === 'boolean' ? v : false

const buildDefaults = (): TFormData => {
  const defaults: TFormData = {}
  props.schema.fields.forEach(field => {
    defaults[field.model] = field.type === 'checkbox' ? false : ''
  })
  return defaults
}

const displayValue = (field: TFieldSchema): string => {
  const v = model.value[field.model]
  if (typeof v === 'boolean') return v ? 'Да' : 'Нет'
  if (typeof v === 'string') return v
  return ''
}

onMounted(() => {
  model.value = { ...buildDefaults(), ...model.value }
})

const updateField = (fieldModel: string, value: string | boolean) => {
  model.value = { ...model.value, [fieldModel]: value }
}

const handleSubmit = () => {
  if (!validateAll()) return
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    done.value = true
    emit('submit', { ...model.value })
  }, 700)
}

const handleReset = () => {
  model.value = buildDefaults()
  reset()
  done.value = false
}
</script>

<template>
  <div v-if="done" class="card">
    <div class="card__badge">
      <span class="card__dot"></span>
      <span>Данные приняты</span>
    </div>
    <h3 class="card__done-title">Готово.</h3>
    <p class="card__done-text">Форма успешно отправлена.</p>
    <dl class="summary">
      <template v-for="field in schema.fields" :key="field.model">
        <dt class="summary__key">{{ field.label }}</dt>
        <dd class="summary__val">{{ displayValue(field) }}</dd>
      </template>
    </dl>
    <button type="button" class="btn btn--primary" @click="handleReset">
      <span>Заполнить заново</span>
      <span class="btn__arrow">→</span>
    </button>
  </div>

  <form v-else class="card" novalidate @submit.prevent="handleSubmit">
    <div v-if="title" class="card__head">
      <h2 class="card__title">{{ title }}</h2>
    </div>

    <template v-for="field in schema.fields" :key="field.model">
      <FieldPassword
        v-if="isTextField(field) && field.type === 'password'"
        :field="field"
        :value="asString(model[field.model])"
        :error="errors[field.model]"
        @update:value="updateField(field.model, $event)"
        @blur="markTouched(field.model)"
      />
      <FieldText
        v-else-if="isTextField(field)"
        :field="field"
        :value="asString(model[field.model])"
        :error="errors[field.model]"
        @update:value="updateField(field.model, $event)"
        @blur="markTouched(field.model)"
      />
      <FieldSelect
        v-else-if="isSelectField(field)"
        :field="field"
        :value="asString(model[field.model])"
        :error="errors[field.model]"
        @update:value="updateField(field.model, $event)"
        @blur="markTouched(field.model)"
      />
      <FieldCheckbox
        v-else-if="isCheckboxField(field)"
        :field="field"
        :value="asBool(model[field.model])"
        :error="errors[field.model]"
        @update:value="updateField(field.model, $event)"
        @blur="markTouched(field.model)"
      />
    </template>

    <div class="card__actions">
      <button type="submit" class="btn btn--primary" :disabled="submitting">
        <span>{{ submitting ? 'Отправка…' : 'Отправить' }}</span>
        <span class="btn__arrow">→</span>
      </button>
      <button type="button" class="btn btn--ghost" @click="handleReset">
        Сброс
      </button>
    </div>
  </form>
</template>

<style scoped src="./FormGenerator.css"></style>
