'use client'

import LoginForm from '@/components/auth/LoginForm'
import { MeshIcon } from '@/components/MeshIcon'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Only render theme-dependent content after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-2">
        <div className="flex justify-center">
          {mounted ? (
            <MeshIcon variant={resolvedTheme === 'dark' ? 'black' : 'white'} width={100} height={100} />
          ) : (
            <div style={{ width: 100, height: 100 }} /> /* Placeholder with same dimensions */
          )}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Inicia sesión en tu cuenta</h1>
  
        </div>
        <LoginForm />
      </div>
    </div>
  )
} 