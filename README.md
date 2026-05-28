# Form Generator

Генератор форм на Vue 3 + TypeScript: компонент `FormGenerator` строит форму из
схемы (объекта-описания полей), валидирует ввод и отдаёт собранные данные.

## Возможности

- Описание формы декларативной схемой — без ручной вёрстки полей.
- Типы полей: `text`, `email`, `password`, `select`, `checkbox`.
- Валидация: обязательность, `minLength`, `maxLength`, регулярное выражение
  (`pattern`), встроенная проверка email.
- Индикатор надёжности пароля.
- Двусторонняя привязка через `v-model` и событие `submit` с данными формы.
- Доступность: связь `label` поле, `aria-invalid` и `aria-describedby` для ошибок.

## Стек

Vue 3 (`<script setup>`) · TypeScript · Vite · Vitest.

## Требования

- Node.js 20+
- npm (в репозитории `package-lock.json`)

## Запуск

```bash
npm install      # установка зависимостей
npm run dev      # дев-сервер с HMR на http://localhost:5173
```

Сборка и предпросмотр продакшен-бандла:

```bash
npm run build    # type-check + сборка в dist/
npm run preview  # локальный предпросмотр собранного бандла
```

## Скрипты

| Команда              | Назначение                                   |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Дев-сервер с горячей перезагрузкой           |
| `npm run build`      | Проверка типов и продакшен-сборка            |
| `npm run preview`    | Предпросмотр собранного бандла               |
| `npm run type-check` | Проверка типов (`vue-tsc`)                   |
| `npm test`           | Запуск тестов (Vitest)                       |

## Использование

```vue
<script setup lang="ts">
import { ref } from 'vue'
import FormGenerator from '@/components/form-generator/FormGenerator.vue'
import type { IFormSchema, TFormData } from '@/components/form-generator/types'

const schema: IFormSchema = {
  fields: [
    { type: 'text', label: 'Имя', model: 'name', required: true, minLength: 2, maxLength: 40 },
    { type: 'email', label: 'Email', model: 'email', required: true },
    { type: 'password', label: 'Пароль', model: 'password', required: true, minLength: 8 },
    { type: 'select', label: 'Роль', model: 'role', options: ['Админ', 'Пользователь'], required: true },
    { type: 'checkbox', label: 'Согласен с условиями', model: 'terms', required: true }
  ]
}

const formData = ref<TFormData>({})
const onSubmit = (data: TFormData) => console.log('submitted:', data)
</script>

<template>
  <FormGenerator :schema="schema" v-model="formData" title="Регистрация" @submit="onSubmit" />
</template>
```

### Поля схемы

Общие свойства (`IBaseField`): `label`, `model`, `required?`, `pattern?`, `placeholder?`.

| Тип        | Доп. свойства             |
| ---------- | ------------------------- |
| `text`     | `minLength?`, `maxLength?` |
| `email`    | `minLength?`, `maxLength?` |
| `password` | `minLength?`, `maxLength?` |
| `select`   | `options: string[]`        |
| `checkbox` | —                          |

`model` — ключ поля в объекте данных (`v-model`). При кривом `pattern` валидация
не падает, а считает поле валидным.

## Структура

```
src/
├─ components/form-generator/
│  ├─ FormGenerator.vue   # сборка формы по схеме, сабмит, сброс
│  ├─ types.ts            # типы схемы и данных
│  ├─ guards.ts           # тайпгарды по типу поля
│  ├─ helpers.ts          # значения, дефолты, сила пароля
│  └─ fields/             # компоненты полей (text, password, select, checkbox)
├─ composables/
│  └─ useFormValidator.ts # логика валидации
└─ __tests__/             # тесты валидатора, полей и хелперов
```

## Тесты

```bash
npm test
```

Покрыты: правила валидатора (обязательность, длины, паттерн, email), доступность
полей (связь label поле, `aria`-атрибуты) и расчёт силы пароля.
