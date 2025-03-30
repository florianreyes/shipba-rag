'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signOut } from '@/lib/actions/auth'

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      const { error } = await signOut()
      
      if (error) {
        toast.error(`Failed to log out: ${error}`)
        return
      }
      
      toast.success('Logged out successfully')
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to log out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout} 
      disabled={isLoading}
    >
      {isLoading ? 'Logging out...' : 'Sign out'}
    </Button>
  )
} 