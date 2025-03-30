"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { Workspace } from '@/lib/actions/workspaces';

type WorkspaceContextType = {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspace, setSelectedWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
} 