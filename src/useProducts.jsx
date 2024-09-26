import { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/ProductoServicio';

export const useProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseUrl);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  return data;
};
