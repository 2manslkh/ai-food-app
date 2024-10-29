import { mockUserPrompt } from "@/lib/mocks";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you have your OpenAI API key set in your environment variables
});

const mock = process.env.MOCK_OPEN_AI === "true" || false;
const mockResponse = mockUserPrompt;

export async function POST(req: Request) {
  if (mock) {
    console.log("Mocking user prompt");
    return NextResponse.json(mockResponse);
  }

  const { message, existingPreferences } = await req.json();

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
              text: 'You are a helpful assistant that engages with users to extract their meal preferences by asking targeted questions.\n\nConsider the existing preferences provided and update them if necessary:\n- Cuisine: {cuisine} (or "unknown" if not provided)\n- Nutritional Goals: {nutritionalGoals} (or "unknown" if not provided)\n- Dietary Restrictions: {dietaryRestrictions} (or "unknown" if not provided)\n- Food Preferences: {foodPreferences} (or "unknown" if not provided)\n\nAsk targeted questions to fill in these categories.\n\n# Steps\n\n1. **Extract Preferences**: Ask the user the following questions to fill in any missing information:\n   - What type of cuisine do you prefer?\n   - What are your nutritional goals (e.g., weight loss, muscle gain, etc.)?\n   - Do you have any dietary restrictions (e.g., vegan, gluten-free)?\n   - What specific food preferences do you have (e.g., spicy food, favorite ingredients)?\n   \n2. **Update the Preferences**: Integrate the user\'s responses into the existing preferences.\n\n3. **Generate Output**: Provide the user\'s preferences in a structured format.\n\n# Output Format\n\nProvide the final preferences in JSON format with the following keys:\n- `"cuisine"`\n- `"nutritionalGoals"`\n- `"dietaryRestrictions"`\n- `"foodPreferences"`\n\n# Notes\n\n- Ensure each category has a value by updating "unknown" fields with the user\'s responses.\n- Maintain a friendly and engaging tone to encourage user participation.\n- Handle cases where the user might not have clear preferences; keep "unknown" in such cases.',
              type: "text",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
              Consider the existing preferences: 
              Cuisine: ${defaults.cuisine ? defaults.cuisine : "unknown"},
              Nutritional Goals: ${defaults.nutritionalGoals ? defaults.nutritionalGoals : "unknown"},
              Dietary Restrictions: ${defaults.dietaryRestrictions ? defaults.dietaryRestrictions : "unknown"},
              Food Preferences: ${defaults.foodPreferences ? defaults.foodPreferences : "unknown"}.
              
              Ask targeted questions to fill in these categories and provide a structured JSON output with the keys: 
              cuisine, nutritionalGoals, dietaryRestrictions, foodPreferences.
              
              User Message: ${message}`,
            },
          ],
        },
      ],
      temperature: 1,
      max_tokens: 2048,
      frequency_penalty: 0,
      presence_penalty: 0,
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
                enum: [
                  "unknown",
                  "Italian",
                  "Mexican",
                  "Chinese",
                  "Indian",
                  "Mediterranean",
                  "American",
                  "Japanese",
                  "Thai",
                  "French",
                  "Spanish",
                  "Middle Eastern",
                  "other",
                ],
                type: "string",
                description: "The type of cuisine the user prefers.",
              },
              foodPreferences: {
                enum: [
                  "unknown",
                  "spicy",
                  "sweet",
                  "sour",
                  "salty",
                  "favorite ingredients",
                  "other",
                ],
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
