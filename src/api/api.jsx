// src/api/api.jsx

// Función para obtener datos (GET)
export const getData = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:3000/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  };
  
  // Función para enviar datos (POST)
  export const postData = async (endpoint, payload) => {
    try {
      const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error posting data: ", error);
      return null;
    }
  };
  