"use client";

import { motion } from "framer-motion";
import { MeshIcon } from "@/components/MeshIcon";

type LoadingStateProps = {
  iconSize?: number;
  text?: string;
}

export function LoadingMeshIcon({ iconSize = 80, text }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <MeshIcon width={iconSize} height={iconSize} variant="white" className="dark:hidden" />
        <MeshIcon width={iconSize} height={iconSize} variant="black" className="hidden dark:block" />
      </motion.div>
      
      {text && (
        <p className="mt-4 text-muted-foreground">{text}</p>
      )}
    </motion.div>
  );
} 