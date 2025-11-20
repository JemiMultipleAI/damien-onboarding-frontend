'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface AgentConfigContextType {
  agentIds: Record<string, string>;
  loading: boolean;
  error: string | null;
  getAgentId: (videoId: string) => string | null;
  refresh: () => Promise<void>;
}

const AgentConfigContext = createContext<AgentConfigContextType | undefined>(undefined);

export const useAgentConfig = () => {
  const context = useContext(AgentConfigContext);
  if (!context) {
    throw new Error("useAgentConfig must be used within AgentConfigProvider");
  }
  return context;
};

interface AgentConfigProviderProps {
  children: ReactNode;
}

export const AgentConfigProvider = ({ children }: AgentConfigProviderProps) => {
  const [agentIds, setAgentIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgentIds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all agent IDs from backend
      // The backend returns a mapping of video IDs to agent IDs
      const response = await fetch(`${API_BASE_URL}/api/agents`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch agent configuration");
      }

      const data = await response.json();
      
      // Backend returns mappings object with video IDs as keys and agent IDs as values
      if (data.mappings && typeof data.mappings === "object") {
        // Filter out empty agent IDs (in case some videos don't have agents configured)
        const agentMap: Record<string, string> = {};
        Object.entries(data.mappings).forEach(([videoId, agentId]) => {
          if (agentId && typeof agentId === "string" && agentId.trim() !== "") {
            agentMap[videoId] = agentId;
          }
        });
        setAgentIds(agentMap);
      } else {
        throw new Error("Invalid agent configuration format");
      }
    } catch (err) {
      console.error("Error fetching agent configuration:", err);
      setError(err instanceof Error ? err.message : "Failed to load agent configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentIds();
  }, []);

  const getAgentId = (videoId: string): string | null => {
    return agentIds[videoId] || null;
  };

  const refresh = async () => {
    await fetchAgentIds();
  };

  return (
    <AgentConfigContext.Provider
      value={{
        agentIds,
        loading,
        error,
        getAgentId,
        refresh,
      }}
    >
      {children}
    </AgentConfigContext.Provider>
  );
};

