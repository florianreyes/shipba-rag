"use client"

import { useState, useEffect } from "react"

const interests = [
  {
    id: "tecnologia",
    label: "Tecnología",
    color: "purple-500",
    subcategories: [
      { id: "tecnologia-ia", label: "Inteligencia Artificial" },
      { id: "tecnologia-blockchain", label: "Blockchain" },
      { id: "tecnologia-desarrollo", label: "Desarrollo Web/Móvil" },
    ],
  },
  {
    id: "emprendimientos",
    label: "Emprendimientos",
    color: "orange-700",
    subcategories: [
      { id: "emprendimientos-startups", label: "Startups" },
      { id: "emprendimientos-negocios", label: "Negocios" },
      { id: "emprendimientos-financiamiento", label: "Financiamiento" },
    ],
  },
  {
    id: "musica",
    label: "Música",
    color: "pink-600",
    subcategories: [
      { id: "musica-produccion", label: "Producción Musical" },
      { id: "musica-instrumentos", label: "Instrumentos" },
      { id: "musica-generos", label: "Géneros Musicales" },
    ],
  },
  {
    id: "arte",
    label: "Arte",
    color: "blue-600",
    subcategories: [
      { id: "arte-visual", label: "Arte Visual" },
      { id: "arte-digital", label: "Arte Digital" },
      { id: "arte-tradicional", label: "Arte Tradicional" },
    ],
  },
  {
    id: "cine",
    label: "Cine y series",
    color: "indigo-600",
    subcategories: [
      { id: "cine-directores", label: "Directores" },
      { id: "cine-generos", label: "Géneros" },
      { id: "cine-produccion", label: "Producción" },
    ],
  },
  {
    id: "deportes",
    label: "Deportes",
    color: "green-600",
    subcategories: [
      { id: "deportes-equipo", label: "Deportes de Equipo" },
      { id: "deportes-individuales", label: "Deportes Individuales" },
      { id: "deportes-extremos", label: "Deportes Extremos" },
    ],
  },
  {
    id: "ciencia",
    label: "Ciencia",
    color: "amber-600",
    subcategories: [
      { id: "ciencia-fisica", label: "Física" },
      { id: "ciencia-biologia", label: "Biología" },
      { id: "ciencia-astronomia", label: "Astronomía" },
    ],
  },
  {
    id: "viajes",
    label: "Viajes",
    color: "rose-600",
    subcategories: [
      { id: "viajes-aventura", label: "Aventura" },
      { id: "viajes-mochilero", label: "Mochilero" },
      { id: "viajes-gastronomicos", label: "Viajes Gastronómicos" },
    ],
  },
  {
    id: "comida",
    label: "Comida y gastronomía",
    color: "emerald-600",
    subcategories: [
      { id: "comida-cocina", label: "Cocina" },
      { id: "comida-reposteria", label: "Repostería" },
      { id: "comida-internacional", label: "Cocina Internacional" },
    ],
  },
  {
    id: "libros",
    label: "Libros y escritura",
    color: "violet-600",
    subcategories: [
      { id: "libros-ficcion", label: "Ficción" },
      { id: "libros-no-ficcion", label: "No Ficción" },
      { id: "libros-escritura", label: "Escritura Creativa" },
    ],
  },
  {
    id: "videojuegos",
    label: "Videojuegos y eSports",
    color: "cyan-600",
    subcategories: [
      { id: "videojuegos-pc", label: "PC Gaming" },
      { id: "videojuegos-consolas", label: "Consolas" },
      { id: "videojuegos-competitivo", label: "Gaming Competitivo" },
    ],
  },
  {
    id: "educacion",
    label: "Educación y Aprendizaje",
    color: "lime-600",
    subcategories: [
      { id: "educacion-idiomas", label: "Idiomas" },
      { id: "educacion-cursos", label: "Cursos Online" },
      { id: "educacion-autodidacta", label: "Aprendizaje Autodidacta" },
    ],
  },
  {
    id: "deportesalternativos",
    label: "Deportes Alternativos",
    color: "teal-600",
    subcategories: [
      { id: "deportesalternativos-escalada", label: "Escalada" },
      { id: "deportesalternativos-senderismo", label: "Senderismo" },
      { id: "deportesalternativos-yoga", label: "Yoga" },
    ],
  },
]

type Interest = typeof interests[0]
type SubcategoryType = Interest['subcategories'][0]

const InterestButton = ({ 
  interest, 
  isSelected, 
  onClick, 
  darkMode 
}: { 
  interest: Interest; 
  isSelected: boolean; 
  onClick: () => void; 
  darkMode: boolean 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 
        rounded-full 
        transition-all 
        duration-200 
        text-sm 
        font-medium 
        border 
        shrink-0
        ${isSelected
          ? `bg-${interest.color} text-white border-transparent`
          : `bg-transparent ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:text-white hover:border-gray-500' 
                : 'border-gray-300 text-gray-800 hover:border-gray-400'
            }`
        }
      `}
    >
      {interest.label}
    </button>
  )
}

const SubcategoryButton = ({ 
  subcategory, 
  isSelected, 
  onClick, 
  borderColorClass, 
  bgColorClass,
  darkMode 
}: { 
  subcategory: SubcategoryType; 
  isSelected: boolean; 
  onClick: () => void; 
  borderColorClass: string; 
  bgColorClass: string;
  darkMode: boolean 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 
        rounded-full 
        transition-all 
        duration-200 
        text-sm 
        font-medium 
        border-2
        ${borderColorClass}
        ${isSelected
          ? `${bgColorClass} text-white`
          : `bg-transparent ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-900'}`
        }
      `}
    >
      {subcategory.label}
    </button>
  )
}

export function InterestCheckboxes({ form, darkMode, onReset }: { form: any; darkMode: boolean; onReset?: () => void }) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  // Update form value when selections change
  useEffect(() => {
    form.setValue("Selecciona los temas que te interesan:", selectedInterests)
  }, [selectedInterests, form])

  // Expose reset function to parent
  useEffect(() => {
    // Define resetInterests inside the useEffect
    const resetInterests = () => {
      setSelectedInterests([])
      if (onReset) {
        onReset()
      }
    }
    
    if (form) {
      form.resetInterests = resetInterests
    }
  }, [form, onReset])

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) {
        // Remove this interest and its subcategories
        return prev.filter((item) => item !== id && !item.startsWith(`${id}-`))
      } else {
        // Add this interest
        return [...prev, id]
      }
    })
  }

  const toggleSubcategory = (id: string) => {
    setSelectedInterests((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Get color classes for subcategories
  const getColorClasses = (color: string) => {
    const bgColorClass = `bg-${color}`
    const borderColorClass = darkMode ? `border-${color.replace('-600', '-400').replace('-700', '-400')}` : `border-${color}`
    
    return { bgColorClass, borderColorClass }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 max-w-full">
        {interests.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id)
          const { bgColorClass, borderColorClass } = getColorClasses(interest.color)
          
          return (
            <div key={interest.id} className="flex flex-col w-auto">
              <InterestButton 
                interest={interest}
                isSelected={isSelected}
                onClick={() => toggleInterest(interest.id)}
                darkMode={darkMode}
              />
              
              {isSelected && (
                <div className="flex flex-wrap items-center gap-2 w-full mt-2">
                  {interest.subcategories.map((subcategory) => (
                    <SubcategoryButton
                      key={subcategory.id}
                      subcategory={subcategory}
                      isSelected={selectedInterests.includes(subcategory.id)}
                      onClick={() => toggleSubcategory(subcategory.id)}
                      borderColorClass={borderColorClass}
                      bgColorClass={bgColorClass}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

