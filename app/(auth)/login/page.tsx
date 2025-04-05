import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Inicia sesión en tu cuenta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa tu correo para iniciar sesión con un enlace mágico
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
} 