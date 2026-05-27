<script setup lang="ts">
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
</script>

<template>
  <div class="field">
    <div class="field__head">
      <label class="field__label">
        {{ props.field.label }}
        <span v-if="props.field.required" class="field__required">*</span>
      </label>
      <span v-if="props.field.maxLength && props.value" class="field__counter">
        {{ props.value.length }}/{{ props.field.maxLength }}
      </span>
    </div>
    <input
      :type="props.field.type"
      :value="props.value"
      :placeholder="props.field.placeholder"
      :maxlength="props.field.maxLength"
      @input="emit('update:value', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur', props.field.model)"
      class="field__input"
      :class="{ 'field__input--error': props.error }"
    />
    <p v-if="props.error" class="field__error">{{ props.error }}</p>
  </div>
</template>

<style scoped src="./FieldText.css"></style>
