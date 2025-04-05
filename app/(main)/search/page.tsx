"use client";

import { SearchComponent } from "@/components/search-component";
import { NoWorkspaceMessage } from "@/components/no-workspace-message";
import { useWorkspace } from "@/lib/context/workspace-context";
import { useEffect, useState } from "react";
import { LoadingMeshIcon } from "@/components/ui/loading-mesh-icon";

export default function Dashboard() {
  const { selectedWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full p-4 sm:p-6">
      {isLoading ? (
        <LoadingMeshIcon />
      ) : (
        selectedWorkspace ? <SearchComponent /> : <NoWorkspaceMessage />
      )}
    </main>
  );
}
