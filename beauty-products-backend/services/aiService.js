const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async getRecommendations(preferences) {
    try {
      const prompt = `Você é um especialista em produtos de beleza. Com base nas preferências fornecidas, recomende 3 produtos específicos.
      
      Preferências do cliente:
      ${JSON.stringify(preferences, null, 2)}
      
      Responda APENAS com um objeto JSON válido seguindo exatamente este formato, sem texto adicional:
      {
        "recomendacoes": [
          {
            "id": 1,
            "nome": "Nome do Produto",
            "marca": "Nome da Marca",
            "descricao": "Descrição detalhada",
            "faixa_preco": "R$ XX,XX - R$ XX,XX",
            "beneficios_principais": ["benefício 1", "benefício 2"]
          }
        ]
      }`;

      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      try {
        const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
        const parsedResponse = JSON.parse(cleanedResponse);
        
        if (!parsedResponse.recomendacoes || !Array.isArray(parsedResponse.recomendacoes)) {
          throw new Error('Invalid response format');
        }

        return parsedResponse;
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        return { recomendacoes: [] };
      }
    } catch (error) {
      console.error('AI Service error:', error);
      return { recomendacoes: [] };
    }
  }
}

module.exports = new AIService();
