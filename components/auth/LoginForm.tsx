'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { signInWithMagicLink } from '@/lib/actions/auth'
import Link from 'next/link'
import EmailAlert from './EmailAlert'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setErrorMessage('Por favor ingresa un correo electrónico válido')
      return
    }

    setErrorMessage(null)
    setIsLoading(true)
    
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`
      const { error } = await signInWithMagicLink(email, redirectUrl)

      if (error) {
        setErrorMessage(error)
        return
      }

      setIsSent(true)
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      setErrorMessage('Error al enviar enlace de inicio de sesión. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }


  if (isSent) {
    return <EmailAlert email={email} type="login" />
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu.correo@ejemplo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errorMessage) setErrorMessage(null)
          }}
          required
          disabled={isLoading}
          className={errorMessage ? "border-black" : ""}
        />
      </div>

      {errorMessage && (
        <Alert className="py-2 border-black">
          <AlertCircle className="h-4 w-4 mr-2 text-black" />
          <AlertDescription className="text-sm text-black">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? 'Enviando...' : 'Enviar Enlace Mágico'}
      </Button>
      
      
    </form>
  )
} 