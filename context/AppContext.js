"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [demands, setDemands] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingDemand, setEditingDemand] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [demandsRes, projectsRes, statsRes] = await Promise.all([
        fetch("/api/demands"),
        fetch("/api/projects"),
        fetch("/api/stats"),
      ]);

      const [demandsData, projectsData, statsData] = await Promise.all([
        demandsRes.json(),
        projectsRes.json(),
        statsRes.json(),
      ]);

      setDemands(Array.isArray(demandsData) ? demandsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setStats(statsData || null);
    } catch (error) {
      setMessage("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const clearMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const value = useMemo(
    () => ({
      demands,
      projects,
      stats,
      loading,
      message,
      setMessage,
      fetchAllData,
      clearMessage,
      editingDemand,
      setEditingDemand,
    }),
    [demands, projects, stats, loading, message, editingDemand]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}