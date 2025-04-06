"use client"

import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Search, Sun, Moon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { UserData, getCurrentUser, signOut } from "@/lib/actions/auth"
import { WorkspaceSelector } from "./workspace-selector"
import { InvitationsDropdown } from "./invitations-dropdown"
import { useTheme } from "next-themes"

// Routes where we want to show the discover button instead of workspace selector
const DISCOVER_ROUTES = ['/profile', '/workspace'];

export function Navbar() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  
  // Check if current path should show discover button
  const shouldShowDiscover = DISCOVER_ROUTES.some(route => pathname?.startsWith(route))
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user data
        const user = await getCurrentUser()
        setUserData(user)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const handleLogout = async () => {
    try {
      const { error } = await signOut()
      if (!error) {
        router.push('/login')
        router.refresh()
      } else {
        toast.error("Error al cerrar sesión")
      }
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error("Error al cerrar sesión")
    }
  }

  const handleDiscoverClick = () => {
    router.push('/search')
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className="w-full border-b dark:border-neutral-800 py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {shouldShowDiscover ? (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleDiscoverClick}
          >
            <Search className="h-4 w-4" />
            <span>Descubrir</span>
          </Button>
        ) : (
          <WorkspaceSelector userId={userData?.id} />
        )}

        <div className="flex items-center gap-2">
          {userData?.id && <InvitationsDropdown />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {isLoading ? (
                  <User className="h-5 w-5 text-black dark:text-white" />
                ) : (
                  userData?.avatar_url ? (
                    <Image
                      src={userData.avatar_url}
                      alt="User avatar"
                      width={20}
                      height={20}
                      className="h-5 w-5 rounded-sm object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-black dark:text-white" />
                  )
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium">{userData?.name || 'Loading...'}</div>
                <div className="text-xs text-muted-foreground">{userData?.email || 'Loading...'}</div>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Configuración</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme} className="flex items-center gap-2 cursor-pointer">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Cambiar tema</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

