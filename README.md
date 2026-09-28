<div align="center">

# · — MORSE CHAT — ·

### Необычный real-time чат, построенный вокруг азбуки Морзе.

**[ Открыть демо → ](https://morse-chat-rosy.vercel.app/)**
**[ Исходный код → ](https://github.com/ximuns/morse-chat)**

<br>

<img src="docs/screenshots/hero.png" alt="Morse Chat" width="850">

<br><br>

<img src="https://img.shields.io/badge/React-19-111111?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
<img src="https://img.shields.io/badge/Vite-8-111111?style=for-the-badge&logo=vite&logoColor=646CFF" alt="Vite">
<img src="https://img.shields.io/badge/Supabase-Real--time-111111?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase">
<img src="https://img.shields.io/badge/Three.js-3D-111111?style=for-the-badge&logo=three.js&logoColor=FFFFFF" alt="Three.js">
<img src="https://img.shields.io/badge/Motion-Animations-111111?style=for-the-badge" alt="Motion">

</div>

<br>

---

## ◌ О проекте

**Morse Chat** — экспериментальный чат, в котором азбука Морзе становится не просто способом передачи сообщений, а основой взаимодействия с интерфейсом.

Вместо стандартного текстового поля пользователь формирует сообщение с помощью физических действий:

<table>
<tr>
<td align="center" width="50%">

### `·`

**Короткое нажатие**

Точка

</td>
<td align="center" width="50%">

### `—`

**Удержание**

Тире

</td>
</tr>
</table>

Полученная последовательность отправляется участнику комнаты в реальном времени.

Проект создан как самостоятельный pet-project на стыке **frontend-разработки, realtime-коммуникации, interaction design, анимации и 3D-визуализации**.

---

## ◇ Возможности

<table>
<tr>
<td width="50%" valign="top">

### Комнаты

Создание приватной комнаты и приглашение другого пользователя по ссылке.

### Real-time

Сообщения синхронизируются между участниками комнаты через Supabase Realtime.

### Morse Input

Ввод сообщений через короткое нажатие и удержание.

</td>
<td width="50%" valign="top">

### Анимации

Интерактивные переходы и визуальная обратная связь при взаимодействии.

### 3D-эффекты

Интерактивная графика и визуальные эффекты с использованием Three.js.

### Нестандартный UI

Интерфейс построен вокруг собственной визуальной системы, а не стандартного messenger-паттерна.

</td>
</tr>
</table>

---

## ⌁ Интерфейс

<div align="center">

<img src="docs/screenshots/home.png" width="220" alt="Главный экран">
&nbsp;&nbsp;
<img src="docs/screenshots/create-room.png" width="220" alt="Создание комнаты">
&nbsp;&nbsp;
<img src="docs/screenshots/chat.png" width="220" alt="Чат">
&nbsp;&nbsp;
<img src="docs/screenshots/morse-input.png" width="220" alt="Morse Input">

</div>

<br>

<div align="center">

`HOME`   `ROOM`   `CHAT`   `MORSE INPUT`

</div>

---

## ⚙ Техническая часть

<table>
<tr>
<td align="center" width="25%">

### React

Компонентная архитектура интерфейса и основная клиентская логика.

</td>
<td align="center" width="25%">

### Supabase

Хранение данных и realtime-синхронизация сообщений.

</td>
<td align="center" width="25%">

### Three.js

3D-графика и интерактивные визуальные эффекты.

</td>
<td align="center" width="25%">

### Motion

Анимации, переходы и интерактивные состояния интерфейса.

</td>
</tr>
</table>

<br>

| Инструмент   | Использование                             |
| :----------- | :---------------------------------------- |
| **React 19** | Frontend и компонентная архитектура       |
| **Vite 8**   | Development server и production build     |
| **Supabase** | Backend, Database и Realtime              |
| **Three.js** | 3D и visual effects                       |
| **Motion**   | Анимации интерфейса                       |
| **ESLint**   | Проверка качества JavaScript / React-кода |
| **Prettier** | Форматирование кода                       |

---

## ⌬ Архитектура

```text
                         MORSE CHAT
                             │
                             ▼
                    ┌─────────────────┐
                    │      React      │
                    │       UI        │
                    └────────┬────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             ▼               ▼               ▼
        Morse Input       Chat UI        Animations
             │               │               │
             └───────────────┼───────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Supabase     │
                    │                 │
                    │    Database     │
                    │    Realtime     │
                    └────────┬────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
               ROOM A                ROOM B
```

---

## ⌘ Структура проекта

```text
morse-chat/
│
├── api/                    # API-часть
├── public/                 # Статические ресурсы
├── src/                    # Основное React-приложение
├── supabase/               # Supabase / backend
│
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## ▶ Локальный запуск

### 01 — Клонирование

```bash
git clone https://github.com/ximuns/morse-chat.git
cd morse-chat
```

### 02 — Установка

```bash
npm install
```

### 03 — Переменные окружения

Создайте `.env`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Добавьте значения вашего Supabase-проекта.

### 04 — Запуск

```bash
npm run dev
```

---

## ⌘ Команды

<table>
<tr>
<td>

`npm run dev`

</td>
<td>

Запуск development server

</td>
</tr>

<tr>
<td>

`npm run build`

</td>
<td>

Production-сборка

</td>
</tr>

<tr>
<td>

`npm run preview`

</td>
<td>

Просмотр production-сборки

</td>
</tr>

<tr>
<td>

`npm run lint`

</td>
<td>

Проверка ESLint

</td>
</tr>

<tr>
<td>

`npm run lint:fix`

</td>
<td>

Автоматическое исправление ESLint

</td>
</tr>

<tr>
<td>

`npm run format`

</td>
<td>

Форматирование через Prettier

</td>
</tr>

<tr>
<td>

`npm run format:check`

</td>
<td>

Проверка форматирования

</td>
</tr>

</table>

---

## ✦ Что показывает этот проект

Morse Chat создавался не как очередной учебный CRUD-проект.

Основная задача — самостоятельно пройти весь путь от идеи до работающего продукта:

```text
IDEA
  ↓
PRODUCT
  ↓
UI / UX
  ↓
INTERACTION
  ↓
REACT
  ↓
REAL-TIME
  ↓
ANIMATION
  ↓
3D
  ↓
DEPLOYMENT
```

В проекте сочетаются:

**Frontend development**
React, component architecture, application logic.

**Realtime**
Supabase Database + Realtime.

**Interaction design**
Tap / hold interaction для формирования Morse-сигналов.

**Motion**
Анимации и состояния интерфейса.

**3D / WebGL**
Визуальные эффекты на базе Three.js.

**Product thinking**
Самостоятельная идея и собственная модель взаимодействия.

---

## ◍ Live Demo

<div align="center">

### **[ MORSE CHAT → ](https://morse-chat-rosy.vercel.app/)**

<br>

*Проект развёрнут и доступен в браузере.*

</div>

---

## Roadmap

```text
[x] Концепция проекта
[x] Интерфейс
[x] Morse Input
[x] Комнаты
[x] Real-time сообщения
[x] Анимации
[x] 3D / Visual Effects
[x] Deployment

[ ] Дополнительные Morse-инструменты
[ ] Улучшение UX
[ ] Расширение realtime-функциональности
[ ] Дополнительные интерактивные эффекты
```

---

<div align="center">

## · — · — ·

**Morse Chat**

Pet-project by **ximuns**

[GitHub](https://github.com/ximuns) · [Live Demo](https://morse-chat-rosy.vercel.app/)

<br>

`·` `—` `·` `—` `·`

</div>
