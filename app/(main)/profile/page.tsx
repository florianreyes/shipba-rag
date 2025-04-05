'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { CreateProfileForm } from '@/components/create-profile-form'
import { UpdateContentForm } from '@/components/update-content-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/actions/auth'
import { getUserWithContent } from '@/lib/actions/users'
import { LoadingMeshIcon } from '@/components/ui/loading-mesh-icon'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userContent, setUserContent] = useState<string>("")
  const [userSocials, setUserSocials] = useState<{
    x_handle?: string;
    telegram_handle?: string;
    instagram_handle?: string;
  }>({})
  const [loading, setLoading] = useState(true)
  const [formSuccess, setFormSuccess] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'
  
  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser()
        if (!userData) {
          router.push('/login')
          return
        }
        
        // Get user with content
        if (userData.id) {
          const userWithContent = await getUserWithContent(userData.id)
          if (userWithContent) {
            setUserContent(userWithContent.content || "")
            setUserSocials({
              x_handle: userWithContent.x_handle || undefined,
              telegram_handle: userWithContent.telegram_handle || undefined,
              instagram_handle: userWithContent.instagram_handle || undefined
            })
          }
        }
        
        setUser(userData)
      } catch (error) {
        console.error('Error al cargar usuario:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [router])
  
  // Callback for form success
  const handleFormSuccess = () => {
    setFormSuccess(true)
    // No redireccionamos al usuario después de actualizar
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingMeshIcon />
      </div>
    )
  }
  
  // Determine if we're showing the full form or the update form
  const hasContent = userContent && userContent.trim().length > 0
  const cardTitle = hasContent ? "Actualiza tu perfil" : "Completa tu perfil"
  const cardDescription = hasContent 
    ? "Actualiza tus redes sociales o modifica tu información"
    : "Necesitamos información adicional para completar tu perfil"
  
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <Card className="w-full max-w-4xl shadow-md border dark:border-neutral-800">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">{cardTitle}</CardTitle>
          <CardDescription>
            {cardDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">¡Éxito!</strong>
              <span className="block sm:inline"> Tu perfil ha sido actualizado.</span>
            </div>
          )}
          
          {hasContent ? (
            <UpdateContentForm 
              darkMode={isDarkMode} 
              userData={{
                id: user.id,
                email: user.email || '',
                name: user.name || '',
                auth_id: user.auth_id,
                content: userContent,
                ...userSocials
              }}
              onSuccess={handleFormSuccess}
            />
          ) : (
            <CreateProfileForm 
              darkMode={isDarkMode} 
              userData={{
                id: user.id,
                email: user.email || '',
                auth_id: user.auth_id
              }}
              onSuccess={handleFormSuccess}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 