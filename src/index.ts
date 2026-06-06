import express, { type Request, type Response } from "express"

type Todo = {
  id: number
  title: string
  completed: boolean
}

type TodoRequestBody = {
  title?: unknown
  completed?: unknown
}

type ValidTodoRequestBody = {
  title: string
  completed: boolean
}

const app = express()
const port = 3000

const todos: Todo[] = [
  { id: 1, title: "Buy groceries", completed: false }
]

let nextId = todos.length + 1

app.use(express.json())

app.use((req: Request, _res: Response, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

const isValidTodoRequestBody = (
  body: TodoRequestBody
): body is ValidTodoRequestBody => {
  return typeof body.title === "string" && typeof body.completed === "boolean"
}

app.get("/todos", (_req: Request, res: Response) => {
  res.status(200).json(todos)
})

app.get("/todos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const todo = todos.find((todo) => todo.id === id)

  if (!todo) {
    res.status(404).json({ message: "Todo not found" })
    return
  }

  res.status(200).json(todo)
})

app.post("/todos", (req: Request, res: Response) => {
  const body = req.body as TodoRequestBody

  if (!isValidTodoRequestBody(body)) {
    res.status(400).json({ message: "title and completed are required" })
    return
  }

  const newTodo: Todo = {
    id: nextId,
    title: body.title,
    completed: body.completed,
  }

  todos.push(newTodo)
  nextId += 1

  res.status(201).json(newTodo)
})

app.put("/todos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const todo = todos.find((todo) => todo.id === id)

  if (!todo) {
    res.status(404).json({ message: "Todo not found" })
    return
  }

  const body = req.body as TodoRequestBody

  if (!isValidTodoRequestBody(body)) {
    res.status(400).json({ message: "title and completed are required" })
    return
  }

  todo.title = body.title
  todo.completed = body.completed

  res.status(200).json(todo)
})

app.delete("/todos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const todoIndex = todos.findIndex((todo) => todo.id === id)

  if (todoIndex === -1) {
    res.status(404).json({ message: "Todo not found" })
    return
  }

  const deletedTodos = todos.splice(todoIndex, 1)

  res.status(200).json(deletedTodos[0])
})

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
