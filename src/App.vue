<script setup lang="ts">
import { ref } from 'vue'
import FormGenerator from './components/form-generator/FormGenerator.vue'
import type { IFormSchema, TFormData } from './components/form-generator/types'

const formSchema: IFormSchema = {
  fields: [
    { type: 'text', label: 'Имя', model: 'name', required: true, minLength: 2, maxLength: 40, placeholder: 'Алексей Иванов' },
    { type: 'email', label: 'Email', model: 'email', required: true, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$', placeholder: 'name@example.com' },
    { type: 'password', label: 'Пароль', model: 'password', required: true, minLength: 8, placeholder: '•••••••••' },
    { type: 'select', label: 'Роль', model: 'role', options: ['Админ', 'Пользователь'], required: true, placeholder: 'Выберите роль…' },
    { type: 'checkbox', label: 'Согласен с условиями использования', model: 'terms', required: true }
  ]
}

const formData = ref<TFormData>({})

const onSubmit = (data: TFormData) => {
  console.log('submitted:', data)
}
</script>

<template>
  <div class="page">
    <FormGenerator :schema="formSchema" v-model="formData" title="Регистрация" @submit="onSubmit" />
  </div>
</template>

<style scoped src="./App.css"></style>
