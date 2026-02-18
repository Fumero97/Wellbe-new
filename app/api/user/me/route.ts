import { NextResponse } from "next/server";
import { FrontEndUserDTO } from "@/lib/variables";

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const mockUser: FrontEndUserDTO = {
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@example.com",
    consulente: true,
    ruolo: "partner", // Simulating a consultant/partner
  };

  return NextResponse.json(mockUser);
}
