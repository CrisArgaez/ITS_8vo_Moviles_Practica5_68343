// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'https://edmonton-aaron-thus-try.trycloudflare.com/api/';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
}

// 🔐 Helper para obtener headers con token
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

export const api = {
  getTareas: async (): Promise<Tarea[]> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}tareas`, { headers });
      if (!response.ok) throw new Error('Error fetching tareas');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tareas:', error);
      throw error;
    }
  },

  getTarea: async (id: number): Promise<Tarea> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}tareas/${id}`, { headers });
      if (!response.ok) throw new Error(`Error fetching tarea ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching tarea ${id}:`, error);
      throw error;
    }
  },

  createTarea: async (tarea: Omit<Tarea, 'id'>): Promise<Tarea> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}tareas`, {
        method: 'POST',
        headers,
        body: JSON.stringify(tarea)
      });
      if (!response.ok) throw new Error('Error creating tarea');
      return await response.json();
    } catch (error) {
      console.error('Error creating tarea:', error);
      throw error;
    }
  },

  updateTarea: async (id: number, tarea: Partial<Tarea>): Promise<Tarea> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}tareas/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(tarea)
      });
      if (!response.ok) throw new Error(`Error updating tarea ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating tarea ${id}:`, error);
      throw error;
    }
  },

  deleteTarea: async (id: number): Promise<void> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}tareas/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error(`Error deleting tarea ${id}`);
    } catch (error) {
      console.error(`Error deleting tarea ${id}:`, error);
      throw error;
    }
  }
};
