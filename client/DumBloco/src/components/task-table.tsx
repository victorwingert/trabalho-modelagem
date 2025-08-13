import * as React from "react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

export interface Task {
  id: string
  title: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt: Date
}

export interface TaskTableProps {
  tasks: Task[]
  className?: string
}

const TaskTable = React.forwardRef<HTMLDivElement, TaskTableProps>(({ tasks, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>
                <span
                  className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", {
                    "bg-yellow-100 text-yellow-800": task.status === "pending",
                    "bg-blue-100 text-blue-800": task.status === "in-progress",
                    "bg-green-100 text-green-800": task.status === "completed",
                  })}
                >
                  {task.status === "pending" && "Pendente"}
                  {task.status === "in-progress" && "Em Progresso"}
                  {task.status === "completed" && "Concluído"}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", {
                    "bg-gray-100 text-gray-800": task.priority === "low",
                    "bg-orange-100 text-orange-800": task.priority === "medium",
                    "bg-red-100 text-red-800": task.priority === "high",
                  })}
                >
                  {task.priority === "low" && "Baixa"}
                  {task.priority === "medium" && "Média"}
                  {task.priority === "high" && "Alta"}
                </span>
              </TableCell>
              <TableCell>{task.createdAt.toLocaleDateString("pt-BR")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
})
TaskTable.displayName = "TaskTable"

export { TaskTable }
