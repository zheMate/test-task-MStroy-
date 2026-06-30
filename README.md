# MStroy Frontend — Тестовое задание

Реализация класса `TreeStore` для работы с деревом объектов и Vue-компонента для его визуализации через AgGrid Enterprise.

## Стек

- Vue 3 + TypeScript
- AgGrid Community + Enterprise
- Vite
- Vitest

## Установка и запуск

```bash
npm install
npm run dev
```

## Тесты

```bash
npm run test
```

28 unit-тестов для класса `TreeStore`.

## Структура проекта

```
src/
├── tree-store/
│   ├── TreeStore.ts        # Класс TreeStore (TypeScript)
│   └── TreeStore.test.ts   # Unit-тесты (Vitest)
└── components/
    └── TreeTable.vue       # Компонент таблицы (AgGrid Enterprise)
```

## TreeStore — методы

| Метод | Описание |
|---|---|
| `getAll()` | Возвращает исходный массив элементов |
| `getItem(id)` | Возвращает элемент по id |
| `getChildren(id)` | Прямые дочерние элементы |
| `getAllChildren(id)` | Все потомки рекурсивно |
| `getAllParents(id)` | Цепочка родителей от элемента до корня |
| `addItem({...})` | Добавляет новый элемент |
| `removeItem(id)` | Удаляет элемент и всех потомков |
| `updateItem({...})` | Обновляет элемент в хранилище |

Все операции поиска работают за O(1) за счёт хранения данных в `Map`.
