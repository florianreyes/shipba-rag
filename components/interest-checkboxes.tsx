"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

const interests = [
  { id: "tecnologia", label: "Tecnología", color: "bg-purple-500" },
  { id: "emprendimientos", label: "Emprendimientos", color: "bg-orange-700" }, // Changed to a darker color
  { id: "musica", label: "Música", color: "bg-pink-600" },
  { id: "arte", label: "Arte", color: "bg-blue-600" },
  { id: "cine", label: "Cine y series", color: "bg-indigo-600" },
  { id: "deportes", label: "Deportes", color: "bg-green-600" },
  { id: "ciencia", label: "Ciencia", color: "bg-amber-600" },
  { id: "viajes", label: "Viajes", color: "bg-rose-600" },
  { id: "comida", label: "Comida y gastronomía", color: "bg-emerald-600" },
  { id: "libros", label: "Libros y escritura", color: "bg-violet-600" },
]

export function InterestCheckboxes({ form, darkMode }: { form: any; darkMode: boolean }) {
  const [otherInterest, setOtherInterest] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  // Update form value when selections change
  useEffect(() => {
    const formValues = [...selectedInterests]
    if (otherInterest) {
      formValues.push(`Otro: ${otherInterest}`)
    }
    form.setValue("interests", formValues)
  }, [selectedInterests, otherInterest, form])

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <button
            key={interest.id}
            type="button"
            onClick={() => toggleInterest(interest.id)}
            className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
              selectedInterests.includes(interest.id)
                ? `${interest.color} text-white`
                : darkMode
                  ? "bg-transparent border border-gray-600 text-white hover:border-gray-400"
                  : "bg-transparent border border-gray-300 text-gray-800 hover:border-gray-500"
            }`}
          >
            {interest.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col space-y-2 mt-4">
        <div
          className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium inline-flex items-center cursor-pointer w-fit ${
            otherInterest
              ? "bg-gray-600 text-white"
              : darkMode
                ? "bg-transparent border border-gray-600 text-white hover:border-gray-400"
                : "bg-transparent border border-gray-300 text-gray-800 hover:border-gray-500"
          }`}
          onClick={() => {
            if (otherInterest) {
              setOtherInterest("")
            } else {
              document.getElementById("other-interest")?.focus()
            }
          }}
        >
          Otro
        </div>

        {(otherInterest || form.getValues().interests.some((i: string) => i.startsWith("Otro:"))) && (
          <Input
            id="other-interest"
            value={otherInterest}
            onChange={(e) => setOtherInterest(e.target.value)}
            placeholder="Especificar otro interés..."
            className={
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500"
                : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
            }
          />
        )}
      </div>
    </div>
  )
}

