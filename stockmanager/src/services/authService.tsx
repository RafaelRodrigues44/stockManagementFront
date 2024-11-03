import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    return response.data; 
  } catch (error) {
    throw error;
  }
};
