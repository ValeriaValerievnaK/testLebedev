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
        class="field__native"
      />
      <span class="field__box" :class="{ 'field__box--error': props.error }">
        <svg v-show="props.value" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 6.5L5 9.5L10 3" stroke="#fff" stroke-width="1.8" stroke-linecap="square" />
        </svg>
      </span>
      <span class="field__text">
        {{ props.field.label }}
        <span v-if="props.field.required" class="field__required">*</span>
      </span>
    </label>
    <p v-if="props.error" class="field__error">{{ props.error }}</p>
  </div>
</template>

<style scoped src="./FieldCheckbox.css"></style>
