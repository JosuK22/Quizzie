// useFetch.jsx
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        const errObj = await res.json();
        throw new Error(errObj.message || 'Something went wrong');
      }

      const resObj = await res.json();
      setData(resObj); 
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return refetch along with other states
  return { data, error, isLoading, refetch: fetchData };
}
