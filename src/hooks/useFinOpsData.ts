import { useState, useEffect } from "react";
import type { FinOpsData } from "@/types/finops.types";
import { finOpsApi } from "@/services/finOpsApi";

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
        const json = await finOpsApi.getAllData();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}
