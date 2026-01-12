import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json([
    { id: 1, denominazione: "Wellbe Demo Corp", sedeLegale: "Milano", tipo: "S.p.A." },
    { id: 2, denominazione: "Tech Solutions Srl", sedeLegale: "Roma", tipo: "S.r.l." },
    { id: 3, denominazione: "Green Energy Group", sedeLegale: "Torino", tipo: "S.p.A." },
    { id: 4, denominazione: "Studio Legale Rossi", sedeLegale: "Napoli", tipo: "Studio Associato" },
    { id: 5, denominazione: "Future FinTech", sedeLegale: "Milano", tipo: "S.p.A." },
    { id: 6, denominazione: "BioHealth Pharma", sedeLegale: "Firenze", tipo: "S.r.l." },
    { id: 7, denominazione: "Logistic Pro", sedeLegale: "Bologna", tipo: "S.p.A." },
    { id: 8, denominazione: "Creative Agency", sedeLegale: "Milano", tipo: "S.r.l." },
    { id: 9, denominazione: "Manifattura Italiana", sedeLegale: "Vicenza", tipo: "S.p.A." },
    { id: 10, denominazione: "StartUp Valley", sedeLegale: "Roma", tipo: "S.r.l.s." },
    { id: 11, denominazione: "Global Consulting", sedeLegale: "Londra (UK)", tipo: "Ltd" },
    { id: 12, denominazione: "EcoFriendly Foods", sedeLegale: "Parma", tipo: "S.r.l." }
  ]);
}
