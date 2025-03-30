import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus, Building2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Workspace, getUserWorkspaces } from "@/lib/actions/workspaces"
import { useWorkspace } from "@/lib/context/workspace-context"

function WorkspaceSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800 h-8 w-8")} />
      <div className={cn("animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800 h-5 w-32")} />
    </div>
  )
}

interface WorkspaceSelectorProps {
  userId: string | undefined;
}

export function WorkspaceSelector({ userId }: WorkspaceSelectorProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspace()

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!userId) {
        setIsLoading(false)
        return
      }

      try {
        const userWorkspaces = await getUserWorkspaces(userId)
        if (userWorkspaces.length > 0) {
          setWorkspaces(userWorkspaces)
          if (!selectedWorkspace) {
            setSelectedWorkspace(userWorkspaces[0])
          }
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching workspaces:', error)
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    fetchWorkspaces()
  }, [userId, selectedWorkspace, setSelectedWorkspace])

  const handleAddCommunity = () => {
    toast.error("La creación de nuevas comunidades estará disponible en una actualización futura.")
  }

  if (isLoading || !userId) {
    return <WorkspaceSkeleton />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <div className="flex items-center gap-2">
          {selectedWorkspace?.image ? (
            <div className="h-8 w-8 rounded-md overflow-hidden">
              <Image
                src={selectedWorkspace.image}
                alt={selectedWorkspace.name}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-neutral-500" />
            </div>
          )}
          <span className="font-medium dark:text-neutral-200">
            {selectedWorkspace?.name || "Comunidades"}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => setSelectedWorkspace(workspace)}
            className={cn(
              "flex items-center gap-2 cursor-pointer mt-1",
              selectedWorkspace?.id === workspace.id && "bg-neutral-100 dark:bg-neutral-800",
            )}
          >
            {workspace.image && (
              <div className="h-6 w-6 rounded-md overflow-hidden">
                <Image
                  src={workspace.image}
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
          className="flex items-center gap-2 mt-1 cursor-pointer text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          onClick={handleAddCommunity}
        >
          <div className="h-6 w-6 rounded-md flex items-center justify-center">
            <Plus className="h-4 w-4 text-gray-500" />
          </div>
          <span className="text-sm text-gray-500">Agregar comunidad</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 