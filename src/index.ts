import express, { type Request, type Response } from "express"

type Todo = {
  id: number
  title: string
  completed: boolean
}

const app = express()
const port = 3000

const todos: Todo[] = [
  { id: 1, title: "Buy groceries", completed: false }
]

app.use(express.json())

app.use((req: Request, _res: Response, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
