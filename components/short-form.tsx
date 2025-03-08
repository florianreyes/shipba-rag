"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { InterestCheckboxes } from "./interest-checkboxes"
import { createUser } from "@/lib/actions/users"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "El nombre de usuario debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  podcastIntro: z.string().min(5, {
    message: "Por favor proporciona una breve introducción.",
  }),
  freeDay: z.string().min(5, {
    message: "Por favor cuéntanos qué harías.",
  }),
  dreamProject: z.string().min(5, {
    message: "Por favor comparte tu proyecto soñado.",
  }),
  interests: z.array(z.string()).min(1, {
    message: "Por favor selecciona al menos un interés.",
  }),
  learningGoals: z.string().min(5, {
    message: "Por favor comparte qué te gustaría aprender.",
  }),
  connectionType: z.string().min(5, {
    message: "Por favor cuéntanos qué conexiones estás buscando.",
  }),
  funFact: z.string().min(5, {
    message: "Por favor comparte algo interesante sobre ti.",
  }),
})

export function ShortForm({ darkMode }: { darkMode: boolean }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      podcastIntro: "",
      freeDay: "",
      dreamProject: "",
      interests: [],
      learningGoals: "",
      connectionType: "",
      funFact: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, email, ...contentFields } = values;
    
    // Concatenate all content fields
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

    console.log(result);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={`text-lg mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
          ¡Hola! 👋 Queremos conocerte rápido (¡pero bien!):
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>Nombre de usuario</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresa tu nombre de usuario"
                  {...field}
                  className={
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                  }
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Ingresa tu email"
                  {...field}
                  className={
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                  }
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="podcastIntro"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>
                Imaginá que te presentamos en un podcast, ¿qué diríamos sobre vos en una frase?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tu introducción para el podcast..."
                  {...field}
                  className={
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                  }
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="freeDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>
                Si tuvieras un día libre completo, ¿en qué actividad o proyecto lo invertirías?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Música, deporte, escribir, cocinar, programar, viajar, etc."
                  {...field}
                  className={
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                  }
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dreamProject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>
                Contanos brevemente sobre algún proyecto o idea que soñás hacer realidad.
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Una banda, un emprendimiento, una app, un libro, un viaje, etc."
                  {...field}
                  className={
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                  }
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interests"
          render={() => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>
                Elegí 3 temas que te apasionen y sobre los cuales te gustaría conectar con otros:
              </FormLabel>
              <FormControl>
                <InterestCheckboxes form={form} darkMode={darkMode} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="learningGoals"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>
                ¿Qué te gustaría aprender o explorar en los próximos meses?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tus metas de aprendizaje..."
                  {...field}
                  className={
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                  }
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="connectionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>
                ¿Qué tipo de conexiones buscás hoy?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Amigos, socios, mentores, compañeros para proyectos, etc."
                  {...field}
                  className={
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                  }
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="funFact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>
                Contanos algo curioso, divertido o sorprendente sobre vos que no muchos sepan:
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Un dato curioso sobre vos..."
                  {...field}
                  className={
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[80px]"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 min-h-[80px]"
                  }
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

