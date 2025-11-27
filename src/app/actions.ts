"use server";

import { adjustTheme } from "@/ai/flows/dynamic-theme-adjustment";
import { z } from "zod";

const themeSchema = z.object({
  authorName: z.string(),
});

export async function getThemeForAuthor(authorName: string) {
  try {
    const validatedInput = themeSchema.parse({ authorName });
    const theme = await adjustTheme({ author: validatedInput.authorName });
    return theme;
  } catch (error) {
    console.error("Error getting theme:", error);
    // In a real app, you might want to return a default theme or throw an error
    // to be caught by the client. For now, we'll return null.
    if (error instanceof z.ZodError) {
      throw new Error("Invalid input for theme generation.");
    }
    throw new Error("Could not generate a theme for the author.");
  }
}
