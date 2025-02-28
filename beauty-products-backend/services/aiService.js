const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async getRecommendations(preferences) {
    try {
      // Ensure preferences are valid
      if (!preferences || Object.keys(preferences).length === 0) {
        throw new Error("Invalid preferences: Preferences object is empty or undefined");
      }

      // Generate the prompt
      const prompt = `Como especialista em produtos de beleza, recomende produtos com base nas preferências:
      ${JSON.stringify(preferences, null, 2)}

      Responda APENAS com um objeto JSON seguindo exatamente este formato:
      {
        "recommendations": [
          {
            "id": number,
            "nome": "string",
            "marca": "string",
            "descricao": "string",
            "faixa_preco": "R$ XX,XX - R$ XX,XX",
            "beneficios_principais": ["string"]
          }
        ]
      }`;

      // Generate content from the AI model
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean and parse the JSON response
      try {
        const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
        const parsedResponse = JSON.parse(cleanedResponse);

        // Validate the response structure
        if (!parsedResponse.recommendations || !Array.isArray(parsedResponse.recommendations)) {
          throw new Error("Invalid response structure: 'recommendations' is missing or not an array");
        }

        // Validate and map each recommendation
        const validatedRecommendations = parsedResponse.recommendations.map((rec, index) => ({
          id: rec.id || index + 1,
          nome: rec.nome || '',
          marca: rec.marca || '',
          descricao: rec.descricao || '',
          faixa_preco: rec.faixa_preco || '',
          beneficios_principais: Array.isArray(rec.beneficios_principais) ? rec.beneficios_principais : []
        }));

        return { recommendations: validatedRecommendations };
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        return { recommendations: [] };
      }
    } catch (error) {
      console.error("AI Service error:", error.message || error);
      return { recommendations: [] };
    }
  }
}

module.exports = new AIService();
