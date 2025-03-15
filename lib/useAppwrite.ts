import { Alert } from "react-native";
import { useEffect, useState } from "react";

const useAppwrite = (fn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn();
      // Ensure we're always setting an array, even if the result is undefined
      setData(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error in useAppwrite hook:", error);
      // Don't show alert for every error - it can be annoying
      // Just set empty data and let the UI handle it
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useAppwrite;
