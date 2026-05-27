<script setup lang="ts">
import { onMounted } from 'vue'
import type { IFormSchema, TFormData, TFieldSchema, ITextField, ISelectField, ICheckboxField } from './types'
import { useFormValidator } from '@/composables/useFormValidator'
import FieldText from './fields/FieldText.vue'
import FieldSelect from './fields/FieldSelect.vue'
import FieldCheckbox from './fields/FieldCheckbox.vue'

const props = defineProps<{ schema: IFormSchema }>()
const model = defineModel<TFormData>({ required: true })
const emit = defineEmits<{ submit: [data: TFormData] }>()

const { errors, validateAll, markTouched } = useFormValidator(props.schema, model)


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

onMounted(() => {
  const defaults: TFormData = {}
  props.schema.fields.forEach(field => {
    if (!(field.model in model.value)) {
      defaults[field.model] = field.type === 'checkbox' ? false : ''
    }
  })
  model.value = { ...model.value, ...defaults }
})

const updateField = (fieldModel: string, value: string | boolean) => {
  model.value = { ...model.value, [fieldModel]: value }
}

const handleSubmit = () => {
  if (validateAll()) {
    emit('submit', { ...model.value })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <template v-for="field in schema.fields" :key="field.model">
      <FieldText
        v-if="isTextField(field)"
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

    <button type="submit" class="form__submit">
      Отправить
    </button>
  </form>
</template>

<style scoped>
.form__submit {
  width: 100%;
  padding: 10px 16px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.2s;
}

.form__submit:hover {
  opacity: 0.85;
}

.form__submit:active {
  opacity: 0.7;
}
</style>
