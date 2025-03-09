"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { InterestCheckboxes } from "./interest-checkboxes"
import { createUser } from "@/lib/actions/users"
import { useState } from "react"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "El nombre de usuario debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  x_handle: z.string(),
  telegram_handle: z.string(),
  instagram_handle: z.string(),
  "Imaginá que te presentamos en un podcast, ¿qué diríamos sobre vos en una frase?": z.string().min(5, {
    message: "Por favor proporciona una breve introducción.",
  }),
  "Si tuvieras un día libre completo, ¿en qué actividad o proyecto lo invertirías?": z.string().min(5, {
    message: "Por favor cuéntanos qué harías.",
  }),
  "Elegí los temas que te apasionen y sobre los cuales te gustaría conectar con otros:": z.array(z.string()),
  "¿Qué te gustaría aprender o explorar en los próximos meses?": z.string().min(5, {
    message: "Por favor comparte qué te gustaría aprender.",
  }),
  "¿Qué influencers o cuentas relevantes en redes sociales te interesan?": z.string().min(2, {
    message: "Por favor comparte qué influencers te interesan.",
  }),
  "Contanos algo de vos que todos deberían saber:": z.string().min(5, {
    message: "Por favor comparte algo sobre ti.",
  }),
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

export function ShortForm({ darkMode }: { darkMode: boolean }) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      x_handle: "",
      telegram_handle: "",
      instagram_handle: "",
      "Imaginá que te presentamos en un podcast, ¿qué diríamos sobre vos en una frase?": "",
      "Si tuvieras un día libre completo, ¿en qué actividad o proyecto lo invertirías?": "",
      "Elegí los temas que te apasionen y sobre los cuales te gustaría conectar con otros:": [],
      "¿Qué te gustaría aprender o explorar en los próximos meses?": "",
      "¿Qué influencers o cuentas relevantes en redes sociales te interesan?": "",
      "Contanos algo de vos que todos deberían saber:": "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { username, email, x_handle, telegram_handle, instagram_handle, ...contentFields } = data;
      
      // Concatenate all content fields with the question as the key
      const content = Object.entries(contentFields)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: ${value.join(", ")}`;
          }
          return `${key}: ${value}`;
        })
        .join("\n");

      const result = await createUser({
        name: username,
        mail: email,
        x_handle,
        telegram_handle,
        instagram_handle,
        content,
      });

      if (result) {
        setIsSuccess(true);
        form.reset();
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
        {isSuccess && (
          <div className={`p-4 mb-4 rounded-lg ${
            darkMode 
              ? "bg-green-900/20 text-green-400 border border-green-800" 
              : "bg-green-50 text-green-600 border border-green-200"
          }`}>
            ¡Enviado correctamente!
          </div>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>Nombre Completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingresa tu nombre completo"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Ingresa tu email"
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

          <FormField
            control={form.control}
            name="Imaginá que te presentamos en un podcast, ¿qué diríamos sobre vos en una frase?"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Imaginá que te presentamos en un podcast, ¿qué diríamos sobre vos en una frase?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tu introducción para el podcast..."
                    {...field}
                    className={`text-sm md:text-base ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                    }`}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Si tuvieras un día libre completo, ¿en qué actividad o proyecto lo invertirías?"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Si tuvieras un día libre completo, ¿en qué actividad o proyecto lo invertirías?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Música, deporte, escribir, cocinar, programar, viajar, etc."
                    {...field}
                    className={`text-sm md:text-base ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                    }`}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Elegí los temas que te apasionen y sobre los cuales te gustaría conectar con otros:"
            render={() => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Elegí los temas que te apasionen y sobre los cuales te gustaría conectar con otros:
                </FormLabel>
                <FormControl>
                  <InterestCheckboxes form={form} darkMode={darkMode} />
                </FormControl>
                <FormMessage className="text-red-500 text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="¿Qué te gustaría aprender o explorar en los próximos meses?"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  ¿Qué te gustaría aprender o explorar en los próximos meses?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tus metas de aprendizaje..."
                    {...field}
                    className={`text-sm md:text-base ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                    }`}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="¿Qué influencers o cuentas relevantes en redes sociales te interesan?"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  ¿Qué influencers o cuentas relevantes en redes sociales te interesan?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tus influencers o cuentas favoritas..."
                    {...field}
                    className={`text-sm md:text-base ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                    }`}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Contanos algo de vos que todos deberían saber:"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Contanos algo de vos que todos deberían saber:
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Algo sobre ti que quieras compartir..."
                    {...field}
                    className={`text-sm md:text-base ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                    }`}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white w-full mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Enviando...
              </>
            ) : (
              'Enviar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

