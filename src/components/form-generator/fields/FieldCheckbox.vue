<script setup lang="ts">
import type { ICheckboxField } from '../types'

const props = defineProps<{
  field: ICheckboxField
  value: boolean
  error?: string
}>()

const emit = defineEmits<{
  'update:value': [value: boolean]
  blur: [model: string]
}>()
</script>

<template>
  <div class="field">
    <label class="field__label">
      <input
        type="checkbox"
        :checked="props.value"
        @change="emit('update:value', ($event.target as HTMLInputElement).checked)"
        @blur="emit('blur', props.field.model)"
        class="field__checkbox"
        :class="{ 'field__checkbox--error': props.error }"
      />
      <span class="field__text">
        {{ props.field.label }}
        <span v-if="props.field.required" class="field__required">*</span>
      </span>
    </label>
    <p v-if="props.error" class="field__error">{{ props.error }}</p>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 16px;
}

.field__label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.field__checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--accent);
  cursor: pointer;
  flex-shrink: 0;
}

.field__checkbox--error {
  outline: 1px solid var(--error);
  border-radius: 2px;
}

.field__text {
  font-size: 14px;
  color: var(--text-h);
}

.field__required {
  color: var(--error);
  margin-left: 2px;
}

.field__error {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--error);
}
</style>
