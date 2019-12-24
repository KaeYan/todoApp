import * as uuid from 'uuid'
// models
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// dataLayer that deals with db
import { TodoDbAccess } from '../dataLayer/todosDbAccess'

const todoDbAccess = new TodoDbAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todoDbAccess.getAllTodos(userId)
}

export async function createTodo(createTodoReq: CreateTodoRequest, userId: string): Promise<TodoItem> {
  return await todoDbAccess.createTodo({
    userId: userId,
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    name: createTodoReq.name,
    dueDate: createTodoReq.dueDate,
    done: false,
  })    
}

export async function updateTodo(updateTodoReq: UpdateTodoRequest, todoId: string, userId: string) {
  await todoDbAccess.updateTodo({
    name: updateTodoReq.name,
    dueDate: updateTodoReq.dueDate,
    done: updateTodoReq.done
  }, todoId, userId)    
}

export async function deleteTodo(todoId: string, userId: string) {
  await todoDbAccess.deleteTodo(todoId, userId)
}

export async function generateUploadUrl(todoId: string, userId: string): Promise<string> {
  const url = await todoDbAccess.generateUploadUrl(todoId, userId)
  return url
}