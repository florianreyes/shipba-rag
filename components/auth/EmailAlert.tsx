'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Link from "next/link"

interface EmailAlertProps {
  email: string;
  type: 'login' | 'signup';
}

export default function EmailAlert({ email, type }: EmailAlertProps) {
  const isLogin = type === 'login';
  
  return (
    <Alert className="p-6 space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <AlertTitle className="text-xl font-bold">
          {isLogin ? 'Revisa tu correo' : 'Verifica tu correo electrónico'}
        </AlertTitle>
      </div>
      
      <AlertDescription className="space-y-4">
        <p>
          Hemos enviado un enlace {isLogin ? 'mágico' : 'de verificación'} a <span className="font-medium">{email}</span>
        </p>
        
        <p className="text-sm text-muted-foreground">
          {isLogin 
            ? 'Haz clic en el enlace enviado a tu correo para iniciar sesión.' 
            : 'Por favor, revisa tu bandeja de entrada y sigue las instrucciones para completar el registro.'}
        </p>
        
        <p className="text-sm text-muted-foreground">
          Si no recibes el correo en unos minutos, revisa la carpeta de spam.
        </p>
        
        <div className="pt-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">
              Volver al inicio de sesión
            </Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
} 