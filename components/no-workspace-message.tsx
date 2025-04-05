"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function NoWorkspaceMessage() {
  return (
    <div className="w-full mb-24">
      <motion.div
        layout
        className="w-full flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { 
            duration: 0.6, 
            ease: "easeInOut",
          }
        }}
      >
        
        <motion.div
          className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm max-w-xl w-full"
          initial={{ scale: 0.95, opacity: 0 }}
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
          <h2 className="text-xl font-semibold mb-2">Todavía no eres parte de una comunidad</h2>
          <p className="text-muted-foreground mb-4">
           Busca una comunidad que te interese y únete a ella.
          </p>
          <div className="flex justify-center">
            <Link href="/workspaces">
              <Button className="rounded-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black">
                Explorar workspaces
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 