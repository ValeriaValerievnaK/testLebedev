<script setup lang="ts">
import { ref, computed, useId } from 'vue'
import type { ITextField } from '../types'
import { passwordScore } from '../helpers'

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
const show = ref(false)

const score = computed(() => passwordScore(props.value))

const labels = ['—', 'СЛАБЫЙ', 'СРЕДНИЙ', 'ХОРОШИЙ', 'СИЛЬНЫЙ']
const strengthLabel = computed(() => labels[score.value] ?? '—')
</script>

<template>
  <div class="field">
    <label class="field__label" :for="fieldId">
      {{ props.field.label }}
      <span v-if="props.field.required" class="field__required">*</span>
    </label>
    <div class="field__wrap">
      <input
        :id="fieldId"
        :type="show ? 'text' : 'password'"
        :value="props.value"
        :placeholder="props.field.placeholder"
        :aria-invalid="props.error ? 'true' : undefined"
        :aria-describedby="props.error ? errorId : undefined"
        @input="emit('update:value', ($event.target as HTMLInputElement).value)"
        @blur="emit('blur', props.field.model)"
        class="field__input"
        :class="{ 'field__input--error': props.error }"
      />
      <button type="button" tabindex="-1" class="field__toggle" @click="show = !show">
        {{ show ? 'СКРЫТЬ' : 'ПОКАЗАТЬ' }}
      </button>
    </div>
    <div class="field__meter" aria-hidden="true">
      <span class="field__bar" :class="{ 'field__bar--on': score >= 1 }"></span>
      <span class="field__bar" :class="{ 'field__bar--on': score >= 2 }"></span>
      <span class="field__bar" :class="{ 'field__bar--on': score >= 3 }"></span>
      <span class="field__bar" :class="{ 'field__bar--on': score >= 4 }"></span>
    </div>
    <div class="field__meta">
      <span>Надёжность</span>
      <span>{{ strengthLabel }}</span>
    </div>
    <p v-if="props.error" :id="errorId" class="field__error">{{ props.error }}</p>
  </div>
</template>

<style scoped src="./FieldPassword.css"></style>
