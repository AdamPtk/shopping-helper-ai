import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { generateObject } from "ai";
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

// const ENGLISH_SYSTEM_PROMPT = `You are a shopping assistant. Your task is to process search results from a store into a proper JSON format where:

// "title" is the product title,
// "price" is the price (if the price is available, extract it from the description),
// "image" is the link to the product image,
// "link" is the product store link.
// Ignore products without a price. Select a maximum of 3 products that are closest to the user's provided budget, skipping the cheapest options.

// If the store link contains archiwum.allegro.pl, ignore that product and select another one, even if it fits the description. Also, ignore any links containing allegro.pl/listing?.

// Make sure the price in the JSON includes the currency unit "PLN". The JSON should contain only the following fields: "title", "price", "image", and "link".

// For the "image" field, choose different images in the following priority order: first image 1, then image 2, and finally image 3 (to ensure uniqueness from the provided options).`;

const POLISH_SYSTEM_PROMPT = `
        Jesteś asystentem zakupowym. Twoim zadaniem jest przetworzenie wyników wyszukiwania na poprawny JSON, gdzie pola "title" to tytuł produktu, "price" to cena (jeśli cena jest dostępna, wyodrębnij ją z opisu), "image" to link do obrazu produktu, a "link" to link do sklepu. 
        Ignoruj produkty, które nie mają ceny. Wybierz maksymalnie 3 produkty, które są najbliżej podanej przez użytkownika ceny, pomijając najtańsze produkty.
        Jeśli link do sklepu to będzie archiwum.allegro.pl to zignoruj i wybierz inne zamiast tego nawet jeśli pasuje pod opis.
        Jeśli w linku znajdziesz coś jak allegro.pl/listing? to też to zignoruj i wybierz inne.
        Upewnij się, że cena w JSON-ie zawiera jednostkę waluty PLN.
        JSON powinien zawierać tylko pola: "title", "price", "image", "link".
        Dla image wybierz zdjecie najpierw 1, potem 2, a na końcu 3, aby zawsze były różne z tych, które dostaniesz.`;

export async function POST(req: NextRequest) {
  try {

    const { userQuery, userBudget } = await req.json();

    const tavilyResponse = await axios.post<TavilyResponse>(
      "https://api.tavily.com/search",
      {
        api_key: TAVILY_API_KEY,
        query: `${userQuery} najniższa cena`,
        search_depth: "basic",
        include_answer: false,
        include_images: true,
        max_results: 20,
        include_domains: [""],
      },
    );

    const searchResults = tavilyResponse.data.results;
    const formattedResults = searchResults
      .map((result) => {
        return `${result.title}: ${result.url}\nOpis: ${result.content}\nObraz: ${
          tavilyResponse.data.images || "brak obrazu"
        }\n\n`;
      })
      .join("");

  //   const ENGLISH_PROMPT = `Here are the search results: ${formattedResults}.
  // The user provided a budget of ${userBudget} PLN. Please analyze the data and return only the valid values in JSON format, selecting products closest to this budget, but skipping the cheapest ones.
  
  // Return nothing except the JSON!`;

    const POLISH_PROMPT = `Oto wyniki wyszukiwania: ${formattedResults}.
        Użytkownik podał budżet ${userBudget} PLN. Proszę, przeanalizuj dane i zwróć tylko prawidłowe wartości w formacie JSON, wybierając produkty najbliżej tej ceny, ale pomijając najtańsze produkty.
        Nie zwracaj nic poza JSONEM!
      `;

    // Generowanie odpowiedzi z OpenAI, przetwarzającej wyniki
    const { object } = await generateObject({
      model: openai("gpt-4o"),
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
      { status: 500 },
    );
  }
}
