"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, User } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/ui/theme-toggle"

type Workspace = {
  id: string
  name: string
  image?: string
}

export function Navbar() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: "1", name: "SHIP BA", image: "/shipba-logo.png?height=30&width=30" },
  ])

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>(workspaces[0])

  return (
    <div className="w-full border-b dark:border-neutral-800 py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <div className="flex items-center gap-2">
              {selectedWorkspace.image && (
                <div className="h-8 w-8 rounded-md overflow-hidden">
                  <Image
                    src={selectedWorkspace.image || "/placeholder.svg"}
                    alt={selectedWorkspace.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              )}
              <span className="font-medium dark:text-neutral-200">{selectedWorkspace.name}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => setSelectedWorkspace(workspace)}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  selectedWorkspace.id === workspace.id && "bg-neutral-100 dark:bg-neutral-800",
                )}
              >
                {workspace.image && (
                  <div className="h-6 w-6 rounded-md overflow-hidden">
                    <Image
                      src={workspace.image || "/placeholder.svg"}
                      alt={workspace.name}
                      width={30}
                      height={30}
                      className="object-cover"
                    />
                  </div>
                )}
                <span>{workspace.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              onClick={() => {
                // Add functionality to create a new workspace
                toast?.("This feature is coming soon", {
                  description: "Creating new workspaces will be available in a future update.",
                })
              }}
            >
              <div className="h-6 w-6 rounded-md flex items-center justify-center">
                <span className="text-lg text-gray-500">+</span>
              </div>
              <span className="text-sm text-gray-500">Agregar comunidad</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <User className="h-5 w-5 text-black dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

