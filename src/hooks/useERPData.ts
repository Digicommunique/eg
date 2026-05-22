import { useState, useEffect } from 'react';

export function useERPData() {
  const [data, setData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('arcenol_db');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(!data);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Global poll every 3s
    return () => clearInterval(interval);
  }, []);

  return { data, loading, refetch: fetchData };
}
