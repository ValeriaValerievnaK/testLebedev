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
    <label class="field__label">
      {{ props.field.label }}
      <span v-if="props.field.required" class="field__required">*</span>
    </label>
    <input
      :type="props.field.type"
      :value="props.value"
      @input="emit('update:value', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur', props.field.model)"
      class="field__input"
      :class="{ 'field__input--error': props.error }"
    />
    <p v-if="props.error" class="field__error">{{ props.error }}</p>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 16px;
}

.field__label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-h);
  margin-bottom: 4px;
}

.field__required {
  color: var(--error);
  margin-left: 2px;
}

.field__input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-h);
  background: var(--bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field__input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.field__input--error {
  border-color: var(--error);
}

.field__input--error:focus {
  box-shadow: 0 0 0 3px var(--error-bg);
}

.field__error {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--error);
}
</style>
