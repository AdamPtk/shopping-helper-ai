import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { generateText, generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

interface TavilyResult {
  title: string;
  content: string;
  url: string;
}

interface TavilyResponse {
  images: string[];
  results: TavilyResult[];
}

const POLISH_SYSTEM_PROMPT = `
  Jesteś asystentem zakupowym. Twoim zadaniem jest przetworzenie wyników wyszukiwania na poprawny JSON, gdzie pola "title" to tytuł produktu, "price" to cena (jeśli cena jest dostępna, wyodrębnij ją z opisu), "image" to link do obrazu produktu, a "link" to link do sklepu. 
  Ignoruj produkty, które nie mają ceny. Wybierz maksymalnie 4 produkty, które są najbliżej podanej przez użytkownika ceny, pomijając najtańsze produkty.
  Jeśli w linku znajdziesz coś jak "allegro" to zignoruj i wybierz inne.
`;

export async function POST(req: NextRequest) {
  try {
    const { userQuery } = await req.json();

    const price = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Extract ONLY the price from the user query: "${userQuery}". Just the number with currency, without any additional text. If the price isn't there, return "brak ceny".`,
    });

    const tavilyResponse = await axios.post<TavilyResponse>(
      "https://api.tavily.com/search",
      {
        api_key: TAVILY_API_KEY,
        query: `${userQuery} do ${price.text}`,
        search_depth: "advanced",
        include_images: true,
        max_results: 20,
        include_domains: [""],
      }
    );

    const searchResults = tavilyResponse.data.results;
    const formattedResults = searchResults
      .map((result, i) => {
        return `${result.title}: ${result.url}\nOpis: ${result.content}\nObraz: ${
          tavilyResponse.data.images[i] || "brak obrazu"
        }\n\n`;
      })
      .join("");

    const POLISH_PROMPT = `
      Oto wyniki wyszukiwania: ${formattedResults}.
      Użytkownik podał budżet ${price.text} PLN. 
      Przeanalizuj dane i zwróć tylko prawidłowe wartości w formacie JSON, wybierając produkty najbliżej tej ceny, ale pomijając najtańsze produkty.
      Nie zwracaj nic poza JSONEM!
    `;

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        data: z
          .object({
            title: z.string(),
            price: z.string(),
            image: z.string(),
            link: z.string(),
          })
          .array(),
      }),
      system: POLISH_SYSTEM_PROMPT,
      prompt: POLISH_PROMPT,
    });

    const aiResult = object.data;

    return NextResponse.json({ answer: aiResult });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
