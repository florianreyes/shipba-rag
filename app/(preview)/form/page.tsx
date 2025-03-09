"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShortForm } from "@/components/short-form"
import { Moon, Sun } from "lucide-react"

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <main
      className={`min-h-screen w-full py-12 ${darkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"} flex flex-col items-center justify-center transition-colors duration-200`}
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
            SHIP BA Community
          </h1>
          <p className={`text-lg md:text-xl ${darkMode ? "text-white/80" : "text-gray-600"} max-w-2xl mx-auto`}>
            Crea tu perfil para poder conectar con la gente que quieras de SHIP BA a partir de sus intereses y habilidades.          </p>
        </div>

        <Card
          className={`border ${darkMode ? "bg-gray-900 border-neutral-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
        >
          <CardHeader className={`border-b ${darkMode ? "border-neutral-700" : "border-gray-200"}`}>
            <CardTitle className="text-2xl">Contanos de Vos</CardTitle>
            <CardDescription className={darkMode ? "text-gray-400" : "text-gray-500"}>
              Completá el formulario a continuación
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ShortForm darkMode={darkMode} />
          </CardContent>
        </Card>
        <div className={`text-center mt-8 text-sm font-mono ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          made by Mesh
        </div>
      </div>
    </main>
  )
}
