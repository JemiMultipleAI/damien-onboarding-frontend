'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface AgentConfigContextType {
  agentIds: Record<string, string>;
  michaelAgentId: string | null;
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
  const [michaelAgentId, setMichaelAgentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgentIds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all agent IDs from backend
      // The backend returns a mapping of video IDs to agent IDs
      let agentsResponse: Response;
      let michaelResponse: Response | null = null;
      
      try {
        [agentsResponse, michaelResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/agents`),
          fetch(`${API_BASE_URL}/api/agents/michael`).catch(() => null) // Gracefully handle if endpoint doesn't exist
        ]);
      } catch (fetchError: any) {
        // Network error (CORS, connection refused, etc.)
        if (fetchError.name === 'TypeError' || fetchError.message?.includes('fetch')) {
          throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Please ensure the backend server is running and CORS is configured correctly.`);
        }
        throw fetchError;
      }
      
      if (!agentsResponse.ok) {
        const errorText = await agentsResponse.text().catch(() => 'Unknown error');
        throw new Error(`Backend returned error ${agentsResponse.status}: ${errorText}`);
      }

      const data = await agentsResponse.json();
      
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
        throw new Error("Invalid agent configuration format from backend");
      }

      // Check if Michael's agent ID is in the main response
      if (data.michael && typeof data.michael === "string" && data.michael.trim() !== "") {
        setMichaelAgentId(data.michael);
      }

      // Also try fetching from dedicated endpoint
      if (michaelResponse && michaelResponse.ok) {
        const michaelData = await michaelResponse.json();
        if (michaelData.agentId && typeof michaelData.agentId === "string") {
          setMichaelAgentId(michaelData.agentId);
        }
      }
    } catch (err) {
      console.error("Error fetching agent configuration:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to load agent configuration. Please check backend connection and configuration.";
      setError(errorMessage);
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
        michaelAgentId,
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

