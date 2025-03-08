"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShortForm } from "@/components/short-form"
import { LongForm } from "@/components/long-form"
import { Moon, Sun } from "lucide-react"

export default function Home() {
  const [formType, setFormType] = useState<"short" | "long">("short")
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <main
      className={`min-h-screen w-full ${darkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"} flex flex-col items-center justify-center p-4 transition-colors duration-200`}
    >
      <div className="container max-w-4xl">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className={darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <div className="text-center mb-8 space-y-3">
          <h1
            className={`text-4xl md:text-6xl font-bold tracking-tighter ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Ship BA Name
          </h1>
          <p className={`text-lg md:text-xl ${darkMode ? "text-white/80" : "text-gray-600"} max-w-2xl mx-auto`}>
            Únete al futuro con nuestra plataforma de vanguardia diseñada para visionarios y amantes de la tecnología
          </p>
        </div>

        <Card
          className={`border ${darkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"}`}
        >
          <CardHeader className={`border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
            <CardTitle className="text-2xl">Comenzar</CardTitle>
            <CardDescription className={darkMode ? "text-gray-400" : "text-gray-500"}>
              Elige tu experiencia de registro a continuación
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs
              defaultValue="short"
              className="w-full"
              onValueChange={(value) => setFormType(value as "short" | "long")}
            >
              <TabsList className={`grid grid-cols-2 mb-8 ${darkMode ? "bg-gray-800" : "bg-gray-100"} w-full`}>
                <TabsTrigger
                  value="short"
                  className={darkMode ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white transition-all duration-200" : "data-[state=active]:bg-white data-[state=active]:text-gray-900 transition-all duration-200"}
                >
                  Formulario Rápido (3 min)
                </TabsTrigger>
                <TabsTrigger
                  value="long"
                  className={darkMode ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white transition-all duration-200" : "data-[state=active]:bg-white data-[state=active]:text-gray-900 transition-all duration-200"}
                >
                  Formulario Extendido (8 min)
                </TabsTrigger>
              </TabsList>
              <TabsContent value="short" className="mt-0">
                <ShortForm darkMode={darkMode} />
              </TabsContent>
              <TabsContent value="long" className="mt-0">
                <LongForm darkMode={darkMode} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className={`border-t ${darkMode ? "border-gray-800" : "border-gray-200"} pt-6`}>
            <Button
              className={`w-full ${darkMode ? "bg-white text-black hover:bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-800"} transition-all duration-200`}
            >
              {formType === "short" ? "Enviar Formulario Rápido" : "Enviar Perfil Completo"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

