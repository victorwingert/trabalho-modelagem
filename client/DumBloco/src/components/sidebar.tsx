"use client"

import {
  Home,
  Edit3,
  Users,
  FileText,
  UserCheck,
  Grid3X3,
  ShoppingBag,
  Settings,
  MoreHorizontal,
  Moon,
  Coffee,
} from "lucide-react"

const sidebarItems = [
  { icon: Grid3X3, active: true },
  { icon: Home, active: false },
  { icon: Edit3, active: false },
  { icon: Users, active: false },
  { icon: FileText, active: false },
  { icon: UserCheck, active: false },
  { icon: Grid3X3, active: false },
  { icon: ShoppingBag, active: false },
  { icon: Users, active: false },
  { icon: Settings, active: false },
  { icon: MoreHorizontal, active: false },
  { icon: Moon, active: false },
  { icon: Coffee, active: false },
]

export function Sidebar() {
  return (
    <div className="w-16 bg-gray-900/50 border-r border-gray-700 flex flex-col items-center py-4 space-y-4">
      {sidebarItems.map((item, index) => {
        const Icon = item.icon
        return (
          <button
            key={index}
            className={`p-3 rounded-lg transition-colors ${
              item.active ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Icon className="h-5 w-5" />
          </button>
        )
      })}
    </div>
  )
}
