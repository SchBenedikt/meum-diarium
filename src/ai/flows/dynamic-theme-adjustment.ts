'use server';

/**
 * @fileOverview This file defines a Genkit flow for dynamically adjusting the website theme based on the selected author.
 *
 * The flow takes an author's name as input and returns a JSON object containing CSS variables that define the website's theme.
 * The theme is generated based on the aesthetic and historical context associated with the author.
 *
 * - `adjustTheme`:  A function that takes an author's name and returns a theme object.
 * - `AdjustThemeInput`: The input type for the `adjustTheme` function.
 * - `AdjustThemeOutput`: The return type for the `adjustTheme` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustThemeInputSchema = z.object({
  author: z.string().describe('The name of the author.'),
});
export type AdjustThemeInput = z.infer<typeof AdjustThemeInputSchema>;

const AdjustThemeOutputSchema = z.object({
  primaryColor: z.string().describe('The primary color for the theme.'),
  backgroundColor: z.string().describe('The background color for the theme.'),
  accentColor: z.string().describe('The accent color for the theme.'),
  fontFamily: z.string().describe('The font family for the theme.'),
  iconStyle: z.string().describe('The icon style for the theme.'),
});
export type AdjustThemeOutput = z.infer<typeof AdjustThemeOutputSchema>;

export async function adjustTheme(input: AdjustThemeInput): Promise<AdjustThemeOutput> {
  return adjustThemeFlow(input);
}

const adjustThemePrompt = ai.definePrompt({
  name: 'adjustThemePrompt',
  input: {schema: AdjustThemeInputSchema},
  output: {schema: AdjustThemeOutputSchema},
  prompt: `You are an expert in historical aesthetics and web design.

  Based on the author: "{{{author}}}", generate a JSON object containing CSS variables to theme a website to match the author's historical period and personality.

  Consider the following:
  - primaryColor: A primary color that represents the author's era and personality.
  - backgroundColor: A background color that complements the primary color and ensures readability.
  - accentColor: An accent color to highlight important elements, inspired by the author's culture.
  - fontFamily: A font family that evokes the author's historical period.
  - iconStyle: A description of the icon style that would be appropriate for the author and their time.

  Example:
  {
    "primaryColor": "#6A4C93",
    "backgroundColor": "#E6E6FA",
    "accentColor": "#FFC107",
    "fontFamily": "Literata, serif",
    "iconStyle": "Classical Roman-style icons (e.g., laurel wreaths, Roman numerals)"
  }

  Ensure the JSON is valid and contains all the required fields.
`,
});

const adjustThemeFlow = ai.defineFlow(
  {
    name: 'adjustThemeFlow',
    inputSchema: AdjustThemeInputSchema,
    outputSchema: AdjustThemeOutputSchema,
  },
  async input => {
    const {output} = await adjustThemePrompt(input);
    return output!;
  }
);
