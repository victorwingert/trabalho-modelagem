import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Search, Edit, ChevronLeft, ChevronRight } from "lucide-react"

const tasks = [
  {
    id: 1,
    task: "Limpar corredores do bloco 1",
    employee: "Shawn",
    role: "Web Designer",
    time: "07:00 PM",
    date: "22/06/2025",
    checked: false,
  },
  {
    id: 2,
    task: "Retirar lixos",
    employee: "Eduardo",
    role: "Marketing Coordinator",
    time: "07:00 PM",
    date: "22/06/2025",
    checked: false,
  },
  {
    id: 3,
    task: "Manutenção no apto 504 - bloco 8",
    employee: "Ann",
    role: "Dog Trainer",
    time: "07:00 PM",
    date: "22/06/2025",
    checked: false,
  },
  {
    id: 4,
    task: "Manutenção no apto 504 - bloco 8",
    employee: "Ann",
    role: "Dog Trainer",
    time: "07:00 PM",
    date: "22/06/2025",
    checked: false,
  },
  {
    id: 5,
    task: "Manutenção no apto 504 - bloco 8",
    employee: "Ann",
    role: "Dog Trainer",
    time: "07:00 PM",
    date: "22/06/2025",
    checked: false,
  },
]

export function TaskTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [checkedTasks, setCheckedTasks] = useState<number[]>([])

  const handleCheckTask = (taskId: number) => {
    setCheckedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  return (
    <div className="space-y-6">
      {/* Search and Create Button */}
      <div className="flex gap-4 justify-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Button className="bg-gray-600 hover:bg-gray-700 text-white px-6">CRIAR</Button>
      </div>

      {/* Table */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/50">
              <TableHead className="text-gray-300 font-medium">Tarefas</TableHead>
              <TableHead className="text-gray-300 font-medium">Funcionário</TableHead>
              <TableHead className="text-gray-300 font-medium">Horário</TableHead>
              <TableHead className="text-gray-300 font-medium">Data</TableHead>
              <TableHead className="text-gray-300 font-medium">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell className="text-white">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={checkedTasks.includes(task.id)}
                      onCheckedChange={() => handleCheckTask(task.id)}
                      className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <span>{task.task}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  <div>
                    <div className="font-medium">{task.employee}</div>
                    <div className="text-sm text-gray-400">{task.role}</div>
                  </div>
                </TableCell>
                <TableCell className="text-green-400 font-medium">{task.time}</TableCell>
                <TableCell className="text-white">{task.date}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-gray-700"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {[1, 2, 3].map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "ghost"}
            size="sm"
            className={
              currentPage === page
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-gray-700"
          onClick={() => setCurrentPage((prev) => Math.min(3, prev + 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
