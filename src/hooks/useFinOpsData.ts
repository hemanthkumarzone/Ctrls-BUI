import { useState, useEffect } from "react";
import type { FinOpsData } from "@/types/finops.types";

interface UseFinOpsDataReturn {
  data: FinOpsData | null;
  loading: boolean;
  error: string | null;
}

export function useFinOpsData(): UseFinOpsDataReturn {
  const [data, setData] = useState<FinOpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/fakedata.json");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json: FinOpsData = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}
