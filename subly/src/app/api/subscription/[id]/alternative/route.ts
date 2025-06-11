import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/verifyAuth';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

async function fetchSubscriptionAlternatives(subName: string, category: string) {
    const prompt = `
Ta tâche est de proposer une liste d'alternatives pertinentes au service suivant :

- Nom du service : "${subName}"
- Catégorie : "${category}"

Consignes :
- Les alternatives doivent offrir des services ou fonctionnalités comparables.
- Si possible, reste dans la même catégorie.
- Mentionne des services connus, accessibles, et actuels.

Retourne la réponse au format JSON sous forme d'une liste d'objets avec les propriétés suivantes :
- name (string) : nom de l'alternative
- minPrice (number) : prix mensuel minimal (en CHF)
- minPriceFrequency (string) : fréquence du prix (mensuel, annuel, etc.)
- url (string) : lien vers le site officiel
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            systemInstruction: "Tu es un assistant spécialisé en recommandations de services numériques.",
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        minPrice: { type: Type.NUMBER },
                        minPriceFrequency: { type: Type.STRING },
                        url: { type: Type.STRING },
                    },
                    required: ["name", "minPrice", "minPriceFrequency", "url"],
                },
            },
        },
    });

    return response.text;
}

export async function GET(request: NextRequest, context: { params: { id: string } }) {
    try {
        const { userId, error } = await verifyAuth(request);

        if (error) {
            return NextResponse.json({ error }, { status: 401 });
        }

        const { id } = await context.params;
        const subId = parseInt(id, 10);

        if (isNaN(subId)) {
            return NextResponse.json({ error: "Invalid subscription ID" }, { status: 400 });
        }

        const sub = await prisma.subscription.findUnique({
            where: { id: subId },
            include: { category: true },
        });

        if (!sub) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        const categoryName = sub.category?.name ?? "Autre";
        const alternativesRaw = await fetchSubscriptionAlternatives(sub.title, categoryName);
        const alternatives = JSON.parse(alternativesRaw as string);

        return NextResponse.json(alternatives, { status: 200 });
    } catch (error) {
        console.error("Error fetching subscription alternatives:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
