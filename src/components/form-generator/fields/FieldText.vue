<script setup lang="ts">
import { useId } from 'vue'
import type { ITextField } from '../types'

const props = defineProps<{
  field: ITextField
  value: string
  error?: string
}>()

const emit = defineEmits<{
  'update:value': [value: string]
  blur: [model: string]
}>()

const fieldId = useId()
const errorId = `${fieldId}-error`
</script>

<template>
  <div class="field">
    <div class="field__head">
      <label class="field__label" :for="fieldId">
        {{ props.field.label }}
        <span v-if="props.field.required" class="field__required">*</span>
      </label>
      <span v-if="props.field.maxLength && props.value" class="field__counter">
        {{ props.value.length }}/{{ props.field.maxLength }}
      </span>
    </div>
    <input
      :id="fieldId"
      :type="props.field.type"
      :value="props.value"
      :placeholder="props.field.placeholder"
      :maxlength="props.field.maxLength"
      :aria-invalid="props.error ? 'true' : undefined"
      :aria-describedby="props.error ? errorId : undefined"
      @input="emit('update:value', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur', props.field.model)"
      class="field__input"
      :class="{ 'field__input--error': props.error }"
    />
    <p v-if="props.error" :id="errorId" class="field__error">{{ props.error }}</p>
  </div>
</template>

<style scoped src="./FieldText.css"></style>
