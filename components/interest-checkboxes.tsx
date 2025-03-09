"use client"

import { useState, useEffect } from "react"

const interests = [
  {
    id: "tecnologia",
    label: "Tecnología",
    color: "bg-purple-500",
    subcategories: [
      { id: "tecnologia-ia", label: "Inteligencia Artificial" },
      { id: "tecnologia-blockchain", label: "Blockchain" },
      { id: "tecnologia-desarrollo", label: "Desarrollo Web/Móvil" },
    ],
  },
  {
    id: "emprendimientos",
    label: "Emprendimientos",
    color: "bg-orange-700",
    subcategories: [
      { id: "emprendimientos-startups", label: "Startups" },
      { id: "emprendimientos-negocios", label: "Negocios" },
      { id: "emprendimientos-financiamiento", label: "Financiamiento" },
    ],
  },
  {
    id: "musica",
    label: "Música",
    color: "bg-pink-600",
    subcategories: [
      { id: "musica-produccion", label: "Producción Musical" },
      { id: "musica-instrumentos", label: "Instrumentos" },
      { id: "musica-generos", label: "Géneros Musicales" },
    ],
  },
  {
    id: "arte",
    label: "Arte",
    color: "bg-blue-600",
    subcategories: [
      { id: "arte-visual", label: "Arte Visual" },
      { id: "arte-digital", label: "Arte Digital" },
      { id: "arte-tradicional", label: "Arte Tradicional" },
    ],
  },
  {
    id: "cine",
    label: "Cine y series",
    color: "bg-indigo-600",
    subcategories: [
      { id: "cine-directores", label: "Directores" },
      { id: "cine-generos", label: "Géneros" },
      { id: "cine-produccion", label: "Producción" },
    ],
  },
  {
    id: "deportes",
    label: "Deportes",
    color: "bg-green-600",
    subcategories: [
      { id: "deportes-equipo", label: "Deportes de Equipo" },
      { id: "deportes-individuales", label: "Deportes Individuales" },
      { id: "deportes-extremos", label: "Deportes Extremos" },
    ],
  },
  {
    id: "ciencia",
    label: "Ciencia",
    color: "bg-amber-600",
    subcategories: [
      { id: "ciencia-fisica", label: "Física" },
      { id: "ciencia-biologia", label: "Biología" },
      { id: "ciencia-astronomia", label: "Astronomía" },
    ],
  },
  {
    id: "viajes",
    label: "Viajes",
    color: "bg-rose-600",
    subcategories: [
      { id: "viajes-aventura", label: "Aventura" },
      { id: "viajes-mochilero", label: "Mochilero" },
      { id: "viajes-gastronomicos", label: "Viajes Gastronómicos" },
    ],
  },
  {
    id: "comida",
    label: "Comida y gastronomía",
    color: "bg-emerald-600",
    subcategories: [
      { id: "comida-cocina", label: "Cocina" },
      { id: "comida-reposteria", label: "Repostería" },
      { id: "comida-internacional", label: "Cocina Internacional" },
    ],
  },
  {
    id: "libros",
    label: "Libros y escritura",
    color: "bg-violet-600",
    subcategories: [
      { id: "libros-ficcion", label: "Ficción" },
      { id: "libros-no-ficcion", label: "No Ficción" },
      { id: "libros-escritura", label: "Escritura Creativa" },
    ],
  },
  {
    id: "videojuegos",
    label: "Videojuegos y eSports",
    color: "bg-cyan-600",
    subcategories: [
      { id: "videojuegos-pc", label: "PC Gaming" },
      { id: "videojuegos-consolas", label: "Consolas" },
      { id: "videojuegos-competitivo", label: "Gaming Competitivo" },
    ],
  },
  {
    id: "educacion",
    label: "Educación y Aprendizaje",
    color: "bg-lime-600",
    subcategories: [
      { id: "educacion-idiomas", label: "Idiomas" },
      { id: "educacion-cursos", label: "Cursos Online" },
      { id: "educacion-autodidacta", label: "Aprendizaje Autodidacta" },
    ],
  },
  {
    id: "deportesalternativos",
    label: "Deportes Alternativos",
    color: "bg-teal-600",
    subcategories: [
      { id: "deportesalternativos-escalada", label: "Escalada" },
      { id: "deportesalternativos-senderismo", label: "Senderismo" },
      { id: "deportesalternativos-yoga", label: "Yoga" },
    ],
  },
]

export function InterestCheckboxes({ form, darkMode }: { form: any; darkMode: boolean }) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [activeInterest, setActiveInterest] = useState<string | null>(null)

  // Update form value when selections change
  useEffect(() => {
    form.setValue("Elegí 3 temas que te apasionen y sobre los cuales te gustaría conectar con otros:", selectedInterests)
  }, [selectedInterests, form])

  const toggleInterest = (id: string) => {
    // If already selected, deselect it and hide subcategories
    if (selectedInterests.includes(id)) {
      setSelectedInterests((prev) => prev.filter((item) => item !== id && !item.startsWith(`${id}-`)))
      if (activeInterest === id) {
        setActiveInterest(null)
      }
    } else {
      // Select it and show subcategories
      setSelectedInterests((prev) => [...prev, id])
      setActiveInterest(id)
    }
  }

  const toggleSubcategory = (id: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Define types for our organized interests
  type InterestType = typeof interests[0];
  type SubcategoryGroupType = {
    id: string;
    isSubcategories: true;
    parentInterest: InterestType;
  };
  type OrganizedItemType = InterestType | SubcategoryGroupType;

  // Organize interests for rendering: place subcategories after their parent category
  const organizedInterests: OrganizedItemType[] = interests.flatMap((interest) => {
    const items: OrganizedItemType[] = [interest];
    
    // Show subcategories for all selected interests (not just active one)
    if (selectedInterests.includes(interest.id)) {
      items.push({
        id: `${interest.id}-subcategories`,
        isSubcategories: true,
        parentInterest: interest,
      });
    }
    
    return items;
  });

  return (
    <div className="space-y-6">
      {/* Main interests with inline subcategories */}
      <div className="flex flex-wrap gap-2 max-w-full">
        {organizedInterests.map((item) => {
          // Handle subcategory group
          if ('isSubcategories' in item && item.isSubcategories) {
            const parentInterest = (item as SubcategoryGroupType).parentInterest;
            
            // Manually determine border and bg color classes based on parent ID
            let borderColorClass = darkMode ? 'border-gray-600' : 'border-gray-300';
            let bgColorClass = 'bg-gray-500';
            
            switch(parentInterest.id) {
              case 'tecnologia':
                borderColorClass = darkMode ? 'border-purple-400' : 'border-purple-500';
                bgColorClass = 'bg-purple-500';
                break;
              case 'emprendimientos':
                borderColorClass = darkMode ? 'border-orange-400' : 'border-orange-700';
                bgColorClass = 'bg-orange-700';
                break;
              case 'musica':
                borderColorClass = darkMode ? 'border-pink-400' : 'border-pink-600';
                bgColorClass = 'bg-pink-600';
                break;
              case 'arte':
                borderColorClass = darkMode ? 'border-blue-400' : 'border-blue-600';
                bgColorClass = 'bg-blue-600';
                break;
              case 'cine':
                borderColorClass = darkMode ? 'border-indigo-400' : 'border-indigo-600';
                bgColorClass = 'bg-indigo-600';
                break;
              case 'deportes':
                borderColorClass = darkMode ? 'border-green-400' : 'border-green-600';
                bgColorClass = 'bg-green-600';
                break;
              case 'ciencia':
                borderColorClass = darkMode ? 'border-amber-400' : 'border-amber-600';
                bgColorClass = 'bg-amber-600';
                break;
              case 'viajes':
                borderColorClass = darkMode ? 'border-rose-400' : 'border-rose-600';
                bgColorClass = 'bg-rose-600';
                break;
              case 'comida':
                borderColorClass = darkMode ? 'border-emerald-400' : 'border-emerald-600';
                bgColorClass = 'bg-emerald-600';
                break;
              case 'libros':
                borderColorClass = darkMode ? 'border-violet-400' : 'border-violet-600';
                bgColorClass = 'bg-violet-600';
                break;
              case 'videojuegos':
                borderColorClass = darkMode ? 'border-cyan-400' : 'border-cyan-600';
                bgColorClass = 'bg-cyan-600';
                break;
              case 'educacion':
                borderColorClass = darkMode ? 'border-lime-400' : 'border-lime-600';
                bgColorClass = 'bg-lime-600';
                break;
              case 'deportesalternativos':
                borderColorClass = darkMode ? 'border-teal-400' : 'border-teal-600';
                bgColorClass = 'bg-teal-600';
                break;
        
            }
            
            return (
              <div key={item.id} className="flex flex-wrap items-center gap-2 w-full">
                {parentInterest.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleSubcategory(sub.id)}
                    className={`
                      px-3 py-1.5 
                      rounded-full 
                      transition-all 
                      duration-200 
                      text-sm 
                      font-medium 
                      border-2
                      ${borderColorClass}
                      ${selectedInterests.includes(sub.id)
                        ? `${bgColorClass} text-white`
                        : `bg-transparent ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-900'}`
                      }
                    `}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            );
          }
          
          // Handle regular interest
          const interest = item as InterestType;
          let bgColorClass = 'bg-gray-500';
            
          switch(interest.id) {
            case 'tecnologia':
              bgColorClass = 'bg-purple-500';
              break;
            case 'emprendimientos':
              bgColorClass = 'bg-orange-700';
              break;
            case 'musica':
              bgColorClass = 'bg-pink-600';
              break;
            case 'arte':
              bgColorClass = 'bg-blue-600';
              break;
            case 'cine':
              bgColorClass = 'bg-indigo-600';
              break;
            case 'deportes':
              bgColorClass = 'bg-green-600';
              break;
            case 'ciencia':
              bgColorClass = 'bg-amber-600';
              break;
            case 'viajes':
              bgColorClass = 'bg-rose-600';
              break;
            case 'comida':
              bgColorClass = 'bg-emerald-600';
              break;
            case 'libros':
              bgColorClass = 'bg-violet-600';
              break;
            case 'videojuegos':
              bgColorClass = 'bg-cyan-600';
              break;
            case 'educacion':
              bgColorClass = 'bg-lime-600';
              break;
            case 'deportesalternativos':
              bgColorClass = 'bg-teal-600';
              break;
            case 'innovacionculinaria':
              bgColorClass = 'bg-fuchsia-600';
              break;
          }
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleInterest(item.id)}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 text-sm font-medium border shrink-0 ${
                selectedInterests.includes(item.id)
                  ? `${bgColorClass} text-white border-transparent`
                  : `bg-transparent ${darkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:border-gray-500' : 'border-gray-300 text-gray-800 hover:border-gray-400'}`
              }`}
            >
              {interest.label}
            </button>
          );
        })}
      </div>
    </div>
  )
}

