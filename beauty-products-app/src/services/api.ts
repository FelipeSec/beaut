import axios from 'axios';

interface Product {
  id: number;
  nome: string;
  marca: string;
  descricao: string;
  faixa_preco: string;
  beneficios_principais: string[];
}

interface RecommendationsResponse {
  recomendacoes: Product[];
}

const API_URL = 'http://localhost:5000/api';

export const getRecommendations = async (preferences: Record<string, string>): Promise<RecommendationsResponse> => {
  try {
    const response = await axios.post(`${API_URL}/recommendations`, { preferences });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const getPrices = async (productName: string) => {
  try {
    const response = await axios.get(`${API_URL}/prices/${encodeURIComponent(productName)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
};