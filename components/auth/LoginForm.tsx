'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signInWithMagicLink } from '@/lib/actions/auth'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`
      const { error } = await signInWithMagicLink(email, redirectUrl)

      if (error) {
        toast.error(`Failed to send login link: ${error}`)
        return
      }

      setIsSent(true)
      toast.success('Check your email for the login link')
    } catch (error) {
      console.error('Error logging in:', error)
      toast.error('Failed to send login link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  if (isSent) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-medium">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          We sent a magic link to <span className="font-medium">{email}</span>
        </p>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsSent(false)}
        >
          Use a different email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Magic Link'}
      </Button>
      
    </form>
  )
} 