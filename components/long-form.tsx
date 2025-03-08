"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { InterestCheckboxes } from "./interest-checkboxes"
import { createUser } from "@/lib/actions/users"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

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
  passion: z.string().min(5, {
    message: "Por favor comparte qué te apasiona.",
  }),
  dreamProject: z.string().min(5, {
    message: "Por favor comparte tu proyecto soñado.",
  }),
  superpower: z.string().min(5, {
    message: "Por favor comparte tu superpoder personal.",
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
  fictionalWorld: z.string().min(5, {
    message: "Por favor cuéntanos en qué mundo ficticio vivirías.",
  }),
  favoriteFood: z.string().min(2, {
    message: "Por favor comparte tu comida favorita.",
  }),
  favoritePlace: z.string().min(2, {
    message: "Por favor comparte tu lugar favorito.",
  }),
  groupActivity: z.string().min(5, {
    message: "Por favor comparte qué actividad harías con amigos.",
  }),
  flowActivities: z.string().min(5, {
    message: "Por favor comparte qué actividades te hacen olvidar todo.",
  }),
  lastMovie: z.string().min(2, {
    message: "Por favor comparte qué película verías.",
  }),
  unlimitedPass: z.string().min(2, {
    message: "Por favor comparte qué elegirías con un pase ilimitado.",
  }),
  passionClub: z.string().min(2, {
    message: "Por favor comparte qué tipo de club abrirías.",
  }),
})

export function LongForm({ darkMode }: { darkMode: boolean }) {
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      podcastIntro: "",
      freeDay: "",
      passion: "",
      dreamProject: "",
      superpower: "",
      interests: [],
      learningGoals: "",
      connectionType: "",
      funFact: "",
      fictionalWorld: "",
      favoriteFood: "",
      favoritePlace: "",
      groupActivity: "",
      flowActivities: "",
      lastMovie: "",
      unlimitedPass: "",
      passionClub: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setStatus({ type: null, message: "" });
      
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

      if (result === "User successfully created and embedded.") {
        setStatus({
          type: "success",
          message: "¡Gracias! Tu información se ha guardado correctamente.",
        });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: result || "Ha ocurrido un error. Por favor intenta nuevamente.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Ha ocurrido un error inesperado. Por favor intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={`text-lg mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
          ¡Hola! Queremos conocerte mejor, pero sin aburrirte...
        </div>

        {status.type && (
          <Alert
            className={`${
              status.type === "success"
                ? darkMode
                  ? "bg-green-900/20 text-green-300"
                  : "bg-green-50 text-green-800"
                : darkMode
                ? "bg-red-900/20 text-red-300"
                : "bg-red-50 text-red-800"
            } mb-4`}
          >
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

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
          name="passion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>
                ¿Qué es algo que te apasiona y que podrías hablar horas sin aburrirte?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tu pasión..."
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
                Elegí 3 temas que te encantan y en los que te gustaría conectar con otras personas:
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
          name="favoriteFood"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>
                ¿Qué comida comerías por el resto de tu vida?
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Tu comida favorita..."
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
          name="favoritePlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={darkMode ? "text-white" : "text-gray-900"}>
                ¿Cuál es tu lugar en el mundo?
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Tu lugar favorito..."
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

        <div className="flex items-center justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              darkMode ? "bg-white text-black hover:bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-800"
            } transition-all duration-200 rounded-md px-4 py-2 flex items-center justify-center ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </button>
        </div>
      </form>
    </Form>
  )
}

