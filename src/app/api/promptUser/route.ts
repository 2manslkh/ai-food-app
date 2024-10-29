import { mockUserPrompt } from "@/lib/mocks";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you have your OpenAI API key set in your environment variables
});

const mock = process.env.MOCK_OPEN_AI === "true" || false;
const mockResponse = mockUserPrompt;

export async function POST(req: Request) {
  const questions = [
    `Could you let me know your favorite cuisine?`,
    `What kind of cuisine do you enjoy?`,
    `Is there a specific cuisine you prefer?`,
    `What types of food do you like to eat?`,
    `Do you have any favorite cultural or regional dishes?`,
    `What cuisine makes you most excited to eat?`,
    `If you could eat one type of food for the rest of your life, what would it be?`,
    `Which restaurants do you find yourself going back to most often?`,
  ];
  const followUps = [
    "Do you have a favorite type of spicy food?",
    "Is there a particular spice level you prefer?",
    "Are there any specific ingredients you especially enjoy?",
    "Do you prefer your food mild, medium, or hot?",
    "What's your ideal balance between flavors - spicy, sweet, sour, etc?",
    "Are there any cooking methods you particularly enjoy, like grilled or stir-fried?",
    "Do you have any favorite herbs or seasonings?",
    "How do you feel about fusion cuisine that combines different styles?",
  ];
  if (mock) {
    console.log("Mocking user prompt");
    return NextResponse.json(mockResponse);
  }

  const { message, existingPreferences, contextMessages } = await req.json();

  // Initialize structured data
  const defaults = {
    cuisine: existingPreferences?.cuisine || null,
    nutritionalGoals: existingPreferences?.nutritionalGoals || null,
    dietaryRestrictions: existingPreferences?.dietaryRestrictions || null,
    foodPreferences: existingPreferences?.foodPreferences || null,
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              text: `You are a friendly assistant that engages with users in a conversational style to learn about their meal preferences.\n\n
                # Steps\n1. **Extract Preferences**: Start with questions, like "${questions[Math.floor(Math.random() * questions.length)]}".\n
                2. **Clarify if Needed**: If user responses are broad, ask follow-up questions like "${followUps[Math.floor(Math.random() * followUps.length)]}".\n
                3. **Guide if Stalled/Complete**: If the user doesn’t respond or repeatedly says "none" with no clear preference updates, gently prompt them to "generate meal" to proceed. Same if all preferences are filled with no new updates.\n
                4. **Output**: Final preferences in JSON format.\n\n
                # Notes\nEncourage a warm, personable tone.`,
              type: "text",
            },
          ],
        },
        ...contextMessages,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
                Existing preferences: 
                Cuisine: ${defaults.cuisine ? defaults.cuisine : "unknown"},
                Nutritional Goals: ${defaults.nutritionalGoals ? defaults.nutritionalGoals : "unknown"},
                Dietary Restrictions: ${defaults.dietaryRestrictions ? defaults.dietaryRestrictions : "unknown"},
                Food Preferences: ${defaults.foodPreferences ? defaults.foodPreferences : "unknown"}.\n\n
                User Message: ${message}`,
            },
          ],
        },
      ],
      temperature: 1.2,
      top_p: 0.9,
      max_tokens: 2048,
      frequency_penalty: 0.5,
      presence_penalty: 0.3,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "meal_preferences",
          strict: true,
          schema: {
            type: "object",
            required: [
              "cuisine",
              "nutritionalGoals",
              "dietaryRestrictions",
              "foodPreferences",
              "userPrompt",
            ],
            properties: {
              cuisine: {
                type: "string",
                description: "The type of cuisine the user prefers.",
              },
              foodPreferences: {
                type: "string",
                description: "Specific food preferences that the user has.",
              },
              nutritionalGoals: {
                enum: [
                  "unknown",
                  "weight loss",
                  "muscle gain",
                  "maintenance",
                  "endurance",
                  "health improvement",
                  "other",
                ],
                type: "string",
                description: "The nutritional goals set by the user.",
              },
              dietaryRestrictions: {
                enum: [
                  "unknown",
                  "vegan",
                  "vegetarian",
                  "gluten-free",
                  "dairy-free",
                  "nut-free",
                  "halal",
                  "kosher",
                  "none",
                  "other",
                ],
                type: "string",
                description: "Any dietary restrictions the user has.",
              },
              userPrompt: {
                type: "string",
                description: "Prompt for the user to gather more information.",
              },
            },
            additionalProperties: false,
          },
        },
      },
    });

    if (!response.choices[0].message.content) {
      return NextResponse.json({ error: "No response from the AI" }, { status: 500 });
    }

    const structuredData = JSON.parse(response.choices[0].message.content.trim());
    return NextResponse.json(structuredData);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json({ error: "Failed to communicate with the AI" }, { status: 500 });
  }
}
