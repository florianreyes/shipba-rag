"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn } from "react-hook-form"
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
  "Breve introducción sobre ti": z.string().min(5, {
    message: "Por favor proporciona una breve introducción.",
  }),
  "¿En qué actividades inviertes tu tiempo libre?": z.string().min(5, {
    message: "Por favor cuéntanos qué harías.",
  }),
  "Si tienes perfil técnico, ¿qué tecnologías utilizas?": z.string().optional(),
  "Selecciona los temas que te interesan:": z.array(z.string()),
  "¿Qué te gustaría aprender o explorar próximamente?": z.string().min(5, {
    message: "Por favor comparte qué te gustaría aprender.",
  }),
  "¿Qué influencers o cuentas sigues en redes sociales?": z.string().min(2, {
    message: "Por favor comparte qué influencers te interesan.",
  }),
  "Comparte algo interesante sobre ti:": z.string().min(5, {
    message: "Por favor comparte algo sobre ti.",
  }),
  "¿Has trabajado en proyectos personales?": z.string().optional(),
  "Situación profesional actual:": z.string().optional(),
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

// Extend UseFormReturn to include our custom resetInterests function
interface ExtendedUseFormReturn extends UseFormReturn<FormData> {
  resetInterests?: () => void;
}

export function ShortForm({ darkMode }: { darkMode: boolean }) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      x_handle: "",
      telegram_handle: "",
      instagram_handle: "",
      "Breve introducción sobre ti": "",
      "¿En qué actividades inviertes tu tiempo libre?": "",
      "Si tienes perfil técnico, ¿qué tecnologías utilizas?": "",
      "Selecciona los temas que te interesan:": [],
      "¿Qué te gustaría aprender o explorar próximamente?": "",
      "¿Qué influencers o cuentas sigues en redes sociales?": "",
      "Comparte algo interesante sobre ti:": "",
      "¿Has trabajado en proyectos personales?": "",
      "Situación profesional actual:": "",
    },
  }) as ExtendedUseFormReturn

  async function onSubmit(data: FormData) {
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
        auth_id: null,
        x_handle,
        telegram_handle,
        instagram_handle,
        content,
      });

      if (result) {
        setIsSuccess(true);
        form.reset();
        // Reset interests using the exposed function
        if (form.resetInterests) {
          form.resetInterests();
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
            name="Breve introducción sobre ti"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Breve introducción sobre ti
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Una breve descripción sobre ti..."
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
            name="¿En qué actividades inviertes tu tiempo libre?"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  ¿En qué actividades inviertes tu tiempo libre?
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
            name="Si tienes perfil técnico, ¿qué tecnologías utilizas?"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Si tienes perfil técnico, ¿qué tecnologías utilizas?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Lenguajes, frameworks, herramientas, etc."
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
            name="Selecciona los temas que te interesan:"
            render={() => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Selecciona los temas que te interesan:
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
            name="¿Qué te gustaría aprender o explorar próximamente?"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  ¿Qué te gustaría aprender o explorar próximamente?
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
            name="¿Qué influencers o cuentas sigues en redes sociales?"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  ¿Qué influencers o cuentas sigues en redes sociales?
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
            name="Comparte algo interesante sobre ti:"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Comparte algo interesante sobre ti:
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

          <FormField
            control={form.control}
            name="¿Has trabajado en proyectos personales?"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  ¿Has trabajado en proyectos personales?
                  <p className="text-xs text-gray-500 mt-1 font-normal">
                    Describe brevemente tus proyectos personales y qué aprendiste de ellos.
                  </p>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tu experiencia con proyectos personales..."
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
            name="Situación profesional actual:"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-sm md:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Situación profesional actual:
                  <p className="text-xs text-gray-500 mt-1 font-normal">
                    Describe tu situación profesional actual, si estás buscando nuevas oportunidades o si buscas colaborar con otros profesionales.
                  </p>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tu situación profesional actual..."
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
              className={`w-full mt-6 ${
                isSuccess
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 text-white"
              }`}
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <>
                  Enviando...
                </>
              ) : isSuccess ? (
                'Enviado'
              ) : (
                'Enviar'
              )}
            </Button>
        </div>
      </form>
    </Form>
  )
}

