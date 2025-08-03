import { Sidebar } from "@/components/sidebar"
import { TaskTable } from "@/components/task-table"

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-8">Tabela de tarefas</h1>
          <TaskTable />
        </div>
      </main>
    </div>
  )
}
