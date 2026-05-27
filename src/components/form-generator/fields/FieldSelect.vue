<script setup lang="ts">
import type { ISelectField } from '../types'

const props = defineProps<{
  field: ISelectField
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
    <select
      :value="props.value"
      @change="emit('update:value', ($event.target as HTMLSelectElement).value)"
      @blur="emit('blur', props.field.model)"
      class="field__select"
      :class="{ 'field__select--error': props.error }"
    >
      <option value="" disabled>{{ props.field.placeholder || 'Выберите…' }}</option>
      <option v-for="option in props.field.options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <p v-if="props.error" class="field__error">{{ props.error }}</p>
  </div>
</template>

<style scoped src="./FieldSelect.css"></style>
