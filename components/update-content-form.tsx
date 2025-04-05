"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { updateUserProfileWithExistingContent } from "@/lib/actions/users";


const formSchema = z.object({
  content: z.string(),
  x_handle: z.string(),
  telegram_handle: z.string(),
  instagram_handle: z.string(),
}).refine(
  (data) => {
    return data.x_handle.length > 0 || 
           data.telegram_handle.length > 0 || 
           data.instagram_handle.length > 0;
  },
  {
    message: "Por favor ingresa al menos una red social.",
    path: ["x_handle"], // This will show the error on the X handle field
  }
)

type FormData = z.infer<typeof formSchema>

interface UpdateContentFormProps {
  darkMode: boolean;
  userData: {
    id: string;
    email: string;
    name: string;
    auth_id: string;
    content: string;
    x_handle?: string;
    telegram_handle?: string;
    instagram_handle?: string;
  };
  onSuccess?: () => void;
}

export function UpdateContentForm({ darkMode, userData, onSuccess }: UpdateContentFormProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: userData.content || "",
      x_handle: userData.x_handle || "",
      telegram_handle: userData.telegram_handle || "",
      instagram_handle: userData.instagram_handle || "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const { content, x_handle, telegram_handle, instagram_handle } = data;
      
      // Import the new function that skips AI processing
      const result = await updateUserProfileWithExistingContent({
        mail: userData.email, // Use email from userData
        auth_id: userData.auth_id,
        x_handle,
        telegram_handle,
        instagram_handle,
        content: content, // Use the updated content without AI processing
      });

      if (result) {
        setIsSuccess(true);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Reset success message after 3 seconds
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-full">
              <h3 className={`text-lg font-small ${darkMode ? "text-white" : "text-gray-900"}`}>
                Redes Sociales (al menos una)
              </h3>
            </div>
            <FormField
              control={form.control}
              name="x_handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>X (Twitter)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sin el @ (ej: usuario)"
                      {...field}
                      className={`text-sm md:text-base ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs md:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagram_handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sin el @ (ej: usuario)"
                      {...field}
                      className={`text-sm md:text-base ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs md:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telegram_handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>Telegram</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sin el @ (ej: usuario)"
                      {...field}
                      className={`text-sm md:text-base ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs md:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Edit content field */}
          <div className="mt-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Información personal
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Escribe información sobre ti"
                      className={`min-h-[150px] text-sm md:text-base ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs md:text-sm" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className={`w-full mt-6 ${
              isSuccess
                ? "bg-gray-800 text-white cursor-not-allowed"
                : "bg-black hover:bg-gray-800 text-white"
            }`}
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <>
                Actualizando...
              </>
            ) : isSuccess ? (
              'Actualizado'
            ) : (
              'Actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 