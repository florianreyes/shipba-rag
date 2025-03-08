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
  "Imaginá que te presentamos en un podcast, ¿qué diríamos sobre vos en una frase?": z.string().min(5, {
    message: "Por favor proporciona una breve introducción.",
  }),
  "Si tuvieras un día libre completo, ¿en qué actividad o proyecto lo invertirías?": z.string().min(5, {
    message: "Por favor cuéntanos qué harías.",
  }),
  "Elegí 3 temas que te apasionen y sobre los cuales te gustaría conectar con otros:": z.array(z.string()).min(1, {
    message: "Por favor selecciona al menos un tema de interés.",
  }),
  "¿Qué te gustaría aprender o explorar en los próximos meses?": z.string().min(5, {
    message: "Por favor comparte qué te gustaría aprender.",
  }),
  "¿Qué influencers o cuentas relevantes en redes sociales te interesan?": z.string().min(2, {
    message: "Por favor comparte qué influencers te interesan.",
  }),
  "Contanos algo de vos que todos deberían saber:": z.string().min(5, {
    message: "Por favor comparte algo sobre ti.",
  }),
})

export function ShortForm({ darkMode }: { darkMode: boolean }) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      "Imaginá que te presentamos en un podcast, ¿qué diríamos sobre vos en una frase?": "",
      "Si tuvieras un día libre completo, ¿en qué actividad o proyecto lo invertirías?": "",
      "Elegí 3 temas que te apasionen y sobre los cuales te gustaría conectar con otros:": [],
      "¿Qué te gustaría aprender o explorar en los próximos meses?": "",
      "¿Qué influencers o cuentas relevantes en redes sociales te interesan?": "",
      "Contanos algo de vos que todos deberían saber:": "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { username, email, ...contentFields } = values;
      
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
            name="Elegí 3 temas que te apasionen y sobre los cuales te gustaría conectar con otros:"
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

