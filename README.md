# Todo API

## A simple RESTful API built with Node.js + Express demonstrating:

- MVC architecture
- OOP principles
- Repository & Service patterns
- Clean, maintainable code

Data is stored in-memory by default (non-persistent), but can be extended to use file storage or a database later on.

## Features

- Create, Read, Update, Delete (CRUD) todos
- Pagination & filtering by status
- Centralized error handling with custom ApiError
- Extensible service & repository layers
- Easy to maintain and extend

## API Routes

### Create a Todo
**POST** `/todos`

**Request body**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending"
}
```
**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "pending",
    "createdAt": "2025-09-26T17:25:16.714Z"
  }
}
```

### Get all Todos with pagnation

**GET** `/todos?status=pending&page=1&limit=10`

**Response**
```json
{
  "success": true,
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 5 }
}
```

### Get Todo by ID

**GET** `/todos/:id`
```json
{
    "success": true,
    "data": {...}
}
```

### Update Todo

**PUT** `/todos/:id`

**Request body**
```json
{
  "status": "done"
}
```

### Delete Todo

**DELETE** `/todos/:id`

### Clear All Todos

**DELETE** `/todos`


## Future Improvements

- File/database persistence
- Input validation middleware (Joi/Zod)
- Authentication & users
- Testing with Jest/Supertest