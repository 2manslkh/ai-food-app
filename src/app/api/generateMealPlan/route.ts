import { NextResponse } from "next/server";
import { Meal } from "@/types";
import OpenAI from "openai";
import { mockGenerateMealPlanResponse } from "@/lib/mocks";

const mockResponse = mockGenerateMealPlanResponse;
const mock = true;
// Function to generate meals
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you have your OpenAI API key set in your environment variables
});

export async function POST(req: Request) {
  if (mock) {
    console.log("Mocking generate meal plan");
    return NextResponse.json(mockResponse);
  }

  try {
    const { existingPreferences } = await req.json();

    // Validate input
    if (!existingPreferences) {
      return NextResponse.json({ error: "Missing user preferences" }, { status: 400 });
    }

    // Initialize structured data
    const defaults = {
      cuisine: existingPreferences?.cuisine || "any",
      nutritionalGoals: existingPreferences?.nutritionalGoals || "any",
      dietaryRestrictions: existingPreferences?.dietaryRestrictions || "any",
      foodPreferences: existingPreferences?.foodPreferences || "any",
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            Generate meals in JSON format based on user-provided food preferences, dietary restrictions, nutritional goals, and cuisine type.
            
            Users will input the following:
            - Cuisine: ${defaults.cuisine}
            - Nutritional Goals: ${defaults.nutritionalGoals}
            - Dietary Restrictions: ${defaults.dietaryRestrictions}
            - Food Preferences: ${defaults.foodPreferences}

            Create a JSON array of meal objects with the specified structure.
          `,
        },
        {
          role: "user",
          content: "Generate meals.",
        },
      ],
      temperature: 1,
      max_tokens: 2048,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "meals",
          strict: true,
          schema: {
            type: "object",
            required: [
              "cuisine",
              "nutritionalGoals",
              "dietaryRestrictions",
              "foodPreferences",
              "meals",
            ],
            properties: {
              meals: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "recipe", "meal_type", "serving_size", "nutrition", "name"],
                  properties: {
                    id: {
                      type: "string",
                      description: "Unique identifier for the meal.",
                    },
                    name: {
                      type: "string",
                      description: "Name of the meal.",
                    },
                    recipe: {
                      type: "object",
                      required: ["author", "ingredients", "instructions"],
                      properties: {
                        author: {
                          type: "string",
                          description: "The author of the recipe. Always prefixed with 'AI'",
                        },
                        ingredients: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description: "List of ingredients for the recipe.",
                        },
                        instructions: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description: "Step-by-step instructions for preparing the recipe.",
                        },
                      },
                      additionalProperties: false,
                    },
                    nutrition: {
                      type: "object",
                      required: ["calories", "protein", "carbs", "fats"],
                      properties: {
                        calories: {
                          type: "number",
                          description: "Total calories in the meal.",
                        },
                        protein: {
                          type: "number",
                          description: "Amount of protein in grams.",
                        },
                        carbs: {
                          type: "number",
                          description: "Amount of carbohydrates in grams.",
                        },
                        fats: {
                          type: "number",
                          description: "Amount of fats in grams.",
                        },
                      },
                      additionalProperties: false,
                    },
                    meal_type: {
                      type: "string",
                      description: "Type of meal, e.g., breakfast, lunch, dinner.",
                    },
                    serving_size: {
                      type: "number",
                      description: "The size of a single serving.",
                    },
                  },
                  additionalProperties: false,
                },
                description: "List of meals generated based on the input preferences.",
              },
              cuisine: {
                type: "string",
                description: "The type of cuisine for the meal.",
              },
              foodPreferences: {
                type: "string",
                description: "User's food preferences, such as vegetarian, vegan, etc.",
              },
              nutritionalGoals: {
                type: "string",
                description: "User's nutritional goals such as calorie intake or macros.",
              },
              dietaryRestrictions: {
                type: "string",
                description: "Any dietary restrictions the user may have.",
              },
            },
            additionalProperties: false,
          },
        },
      },
    });
    console.log("🚀 | POST | response:", response);

    if (!response.choices[0].message.content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    // Parse and validate the response
    try {
      const meals: Meal[] = JSON.parse(response.choices[0].message.content.trim());

      return NextResponse.json(meals);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json({ error: "Failed to parse meal" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error generating meals:", error);

    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({ error: "AI service temporarily unavailable" }, { status: 503 });
    }

    return NextResponse.json({ error: "Failed to generate meals" }, { status: 500 });
  }
}
