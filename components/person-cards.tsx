import { PersonCard } from "./person-card";

export interface Person {
  name: string;
  content: string;
  contentSummary: string;
  keywords: string[];
  socialHandles?: {
    x?: string;
    telegram?: string;
    instagram?: string;
  };
}

interface PersonCardsProps {
  persons: Person[];
  isLoading?: boolean;
}

export function PersonCards({ persons, isLoading = false }: PersonCardsProps) {
  if (isLoading) {
    return <div className="mt-4"></div>;
  }

  if (!persons || persons.length === 0) {
    return (
      <div className="mt-8 w-full">
        <div className="border rounded-lg p-6 shadow-sm max-w-md mx-auto">
          <p className="text-sm text-muted-foreground text-center">No se encontró ninguna persona para tu busqueda</p>
        </div>
      </div>
    );
  }

  // Determine grid classes based on number of persons
  let gridClasses = "grid grid-cols-1 sm:grid-cols-2 gap-4";
  let maxWidthClass = "max-w-4xl";
  
  if (persons.length <= 1) {
    gridClasses = "grid grid-cols-1 gap-4";
    maxWidthClass = "max-w-sm";
  } else if (persons.length === 2) {
    gridClasses = "grid grid-cols-1 sm:grid-cols-2 gap-4";
    maxWidthClass = "max-w-2xl";
  } else if (persons.length === 3) {
    gridClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
    maxWidthClass = "max-w-4xl";
  } else {
    gridClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    maxWidthClass = "max-w-5xl";
  }
  
  return (
    <div className="flex justify-center w-full mt-4">
      <div className={`${gridClasses} ${maxWidthClass}`}>
        {persons.map((person, index) => (
          <PersonCard
            key={`${person.name}-${index}`}
            name={person.name}
            description={person.contentSummary}
            keywords={person.keywords}
            socialHandles={person.socialHandles}
          />
        ))}
      </div>
    </div>
  );
} 