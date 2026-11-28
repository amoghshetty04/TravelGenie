
const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");

// =====================================
// Initialize AI providers
// =====================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =====================================
// Generate itinerary using Gemini
// =====================================

const generateWithGemini = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      httpOptions: {
        timeout: 30000, // 30 seconds
      },
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response.");
  }

  return response.text;
};

// =====================================
// Generate itinerary using Groq
// =====================================

const generateWithGroq = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          "You are TravelGenie, an intelligent travel planning assistant. Generate practical and personalized travel itineraries.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const itinerary = response.choices?.[0]?.message?.content;

  if (!itinerary) {
    throw new Error("Groq returned an empty response.");
  }

  return itinerary;
};

// =====================================
// Main itinerary controller
// =====================================

const generateItinerary = async (req, res) => {
  try {
    const {
      destination,
      duration,
      travellers,
      budget,
      interests,
      travelDate,
    } = req.body;

    // Validate user input
    if (
      !destination ||
      !duration ||
      !travellers ||
      !budget ||
      !Array.isArray(interests) ||
      interests.length === 0 ||
      !travelDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all trip details.",
      });
    }

    // Create AI prompt
    const prompt = `
You are TravelGenie, an intelligent travel planning assistant.

Create a personalized ${duration}-day travel itinerary for ${destination}.

Trip details:
- Travel date: ${travelDate}
- Number of travellers: ${travellers}
- Total budget: ${budget}
- Interests: ${interests.join(", ")}

Requirements:
1. Create a day-wise itinerary.
2. Suggest places to visit each day.
3. Include local food recommendations.
4. Suggest suitable activities.
5. Consider the user's interests.
6. Provide an estimated daily budget.
7. Keep the plan practical and realistic.
8. Include a short travel tip.
9. Do not invent exact opening hours or claim availability without verified information.

Format the response clearly using Markdown headings and bullet points.
`;

    // =====================================
    // First attempt: Gemini
    // =====================================

    try {
      console.log("Trying Gemini...");

      const itinerary = await generateWithGemini(prompt);

      console.log("Itinerary generated using Gemini.");

      return res.status(200).json({
        success: true,
        provider: "Gemini",
        message: "Itinerary generated successfully!",
        itinerary,
      });

    } catch (geminiError) {
      console.error("Gemini failed:", geminiError.message);

      // Do not use fallback for invalid credentials
      const errorMessage = geminiError.message || "";
      const status = Number(
        geminiError.status || geminiError.code
      );

      if (
        status === 400 ||
        status === 401 ||
        status === 403 ||
        errorMessage.includes("API_KEY_INVALID")
      ) {
        throw geminiError;
      }

      // =====================================
      // Second attempt: Groq fallback
      // =====================================

      console.log("Gemini unavailable. Trying Groq fallback...");

      const itinerary = await generateWithGroq(prompt);

      console.log("Itinerary generated using Groq.");

      return res.status(200).json({
        success: true,
        provider: "Groq",
        message: "Itinerary generated successfully using fallback AI!",
        itinerary,
      });
    }

  } catch (error) {
    console.error("AI itinerary generation failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "AI itinerary generation failed.",
      error: error.message,
    });
  }
};

// =====================================
// Export controller
// =====================================

module.exports = {
  generateItinerary,
};
