"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { LoadingIcon } from "@/components/icons";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { PersonCards } from "@/components/person-cards";
import { Person } from "@/components/person-cards";
import { ArrowUp } from "lucide-react";
import { useWorkspace } from "@/lib/context/workspace-context";

export default function Chat() {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [persons, setPersons] = useState<Person[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<string>("");
  const [lastQuery, setLastQuery] = useState<string>("");
  const { selectedWorkspace } = useWorkspace();

  useEffect(() => {
    if (persons.length > 0) setIsExpanded(true);
  }, [persons]);

  useEffect(() => {
    // Limpiar resultados de búsqueda cuando cambia el workspace
    setPersons([]);
    setLastQuery("");
  }, [selectedWorkspace]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Save the current input as the last query
    setLastQuery(input);
    
    setIsLoading(true);
    setLoadingState("Pensando...");
    
    try {
      // "Pensando..." state for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoadingState("Buscando personas...");
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
          workspaceId: selectedWorkspace?.id
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      
      // Show "Resumiendo..." after getting the response
      setLoadingState("Resumiendo...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setPersons(data.persons || []);
      
      // Clear the input after search is complete
      setInput("");
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Error en la búsqueda. Por favor intente más tarde.");
    } finally {
      setIsLoading(false);
      setLoadingState("");
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full p-4 sm:p-6">
        <div className="w-full mb-24">
          <motion.div
            layout
            className="w-full flex flex-col items-center"
            initial={{ y: 0, opacity: 0 }}
            animate={{ 
              y: (persons.length > 0 || isLoading) ? -30 : 0,
              opacity: 1,
              transition: { 
                duration: 0.6, 
                ease: "easeInOut",
                opacity: { duration: 0.4 }
              }
            }}
          >
            <motion.h1 
              className="text-3xl font-bold mb-8 font-mono mt-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: "easeOut"
                }
              }}
            >
              {selectedWorkspace 
                ? `Encontrá tu network en ${selectedWorkspace.name}` 
                : "Encontrá tu network"}
            </motion.h1>
            <form onSubmit={handleSearch} className="w-full max-w-xl">
              <motion.div 
                className="relative"
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: {
                    duration: 0.4,
                    ease: "easeOut",
                    delay: 0.2
                  }
                }}
              >
                <Input
                  placeholder={selectedWorkspace 
                    ? `¿Qué tipo de personas buscas en ${selectedWorkspace.name}?` 
                    : "¿Qué tipo de personas estás buscando?"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full pr-12 rounded-full h-12 pl-5 text-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-opacity-50 focus:shadow-lg dark:border-neutral-700 dark:shadow-md dark:shadow-neutral-900/10"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="absolute right-1 top-1 rounded-full w-10 h-10 p-0 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {isLoading ? (
                    <LoadingIcon />
                  ) : (
                    <ArrowUp size={18} className="text-white dark:text-black" />
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
          
          {isLoading && loadingState && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-center text-sm text-muted-foreground mt-4"
            >
              {loadingState}
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            {(persons.length > 0 || isLoading || lastQuery) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                {lastQuery && persons.length > 0 && (
                  <motion.div 
                    className="mb-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { delay: 0.2, duration: 0.4 }
                    }}
                  >
                    <p className="text-lg font-medium">
                      Búsqueda{selectedWorkspace ? ` en ${selectedWorkspace.name}` : ''}: 
                      <span className="italic text-muted-foreground"> {lastQuery}</span>
                    </p>
                  </motion.div>
                )}
                <PersonCards persons={persons} isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
