// Initial import of openai npm package
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true  // Only set this if you are sure about the risks
});

// Function to create a story
export async function createStory(titleInput, storyTheme, storyCharacters, storyDescription) {
  
  let title = titleInput || storyTheme || storyCharacters || storyDescription || "Untitled";  // Default title if all are empty

  let promptParts = [];

  // Check each input and append if not empty
  if (storyTheme.length > 0) {
    promptParts.push(`Theme: ${storyTheme}`);
  }
  if (storyCharacters.length > 0) {
    promptParts.push(`Characters: ${storyCharacters}`);
  }
  if (storyDescription.length > 0) {
    promptParts.push(`Description: ${storyDescription}`);
  }

  // Join all parts to form the final prompt, adding a title if there are any parts
  const prompt = promptParts.length > 0 ? `Create a story with the following details:\n${promptParts.join('\n')}` : "Create a story.";

  try {
    // Send a request to the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify the model, adjust if needed
      messages: [{
        role: "system",
        content: "You are a story teller that specialises in cheesy and funny childrens bed time stories."
      }, {
        role: "user",
        content: prompt
      }]
    });

    return { title, content: response.choices[0].message.content};
  } catch (error) {
    // Log any errors to the console
    console.error("Error in creating story:", error);
    return null;
  }
}
