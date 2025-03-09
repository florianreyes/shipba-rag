import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { VariantProps } from "class-variance-authority"

interface PersonCardProps {
  name: string
  description: string
  keywords?: string[]
  socialHandles?: {
    x?: string
    telegram?: string
    instagram?: string
  }
  className?: string
}

export function PersonCard({ name, description, keywords = [], socialHandles = {}, className }: PersonCardProps) {
  // Array of color variants for keywords
  const colorVariants: ("blue" | "green" | "yellow" | "red" | "purple" | "indigo")[] = [
    "blue", "green", "yellow", "red", "purple", "indigo"
  ];
  
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      <CardHeader className="pb-1 pt-3 px-4">
        <h3 className="font-medium leading-none text-sm">{name}</h3>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <p className="text-xs text-card-foreground leading-normal">{description}</p>

        {keywords && keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((keyword, index) => {
              const color = colorVariants[index % colorVariants.length];
              // Map of color variants to border colors
              const borderColorMap = {
                blue: "border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300",
                green: "border-green-500 text-green-700 dark:border-green-400 dark:text-green-300",
                yellow: "border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300",
                red: "border-red-500 text-red-700 dark:border-red-400 dark:text-red-300",
                purple: "border-purple-500 text-purple-700 dark:border-purple-400 dark:text-purple-300",
                indigo: "border-indigo-500 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
              };
              
              return (
                <Badge 
                  key={index}
                  className={cn(
                    "bg-transparent border [&:hover]:bg-transparent text-xs px-2 py-0.5", 
                    borderColorMap[color]
                  )}
                >
                  {keyword}
                </Badge>
              );
            })}
          </div> 
        )}
        
        {Object.keys(socialHandles).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {socialHandles.x && (
              <a href={`https://twitter.com/${socialHandles.x}`} target="_blank" rel="noopener noreferrer" 
                 className="inline-flex items-center">
                <Badge variant="twitter" className="inline-flex items-center justify-center w-6 h-6 p-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Badge>
              </a>
            )}
            {socialHandles.telegram && (
              <a href={`https://t.me/${socialHandles.telegram}`} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center">
                <Badge variant="telegram" className="inline-flex items-center justify-center w-6 h-6 p-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.952z" />
                  </svg>
                </Badge>
              </a>
            )}
            {socialHandles.instagram && (
              <a href={`https://instagram.com/${socialHandles.instagram}`} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center">
                <Badge variant="instagram" className="inline-flex items-center justify-center w-6 h-6 p-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Badge>
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}