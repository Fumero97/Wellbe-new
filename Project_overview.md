# Analisi Applicazione Wellbe (AI Generated)

## 📱 **Panoramica**
Questa applicazione è un **portale frontend** (probabilmente B2B) dedicato alla gestione del benessere aziendale e CSR (Corporate Social Responsibility).

### Flusso Utente Principale
1.  **Welcome Page**: Landing page moderna con gradienti e animazioni (`app/page.tsx`).
2.  **Login**: Pagina di autenticazione (`app/login/page.tsx`).
3.  **Selezione Organizzazione**: Dopo il login, l'utente visualizza e cerca tra le aziende a cui ha accesso (`app/organizations/page.tsx`).
4.  **Reindirizzamento**: L'azione "Gestisci" reindirizza a dashboard esterne (`/partner_view` o `/dashboard_azienda`) in base al ruolo dell'utente.

## 🛠 **Tech Stack**
L'applicazione utilizza un'architettura moderna basata sull'ecosistema React/Next.js:

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Core**: [React 19](https://react.dev/)
*   **Linguaggio**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **UI Components**: **Shadcn/UI** (basato su Radix UI)
*   **Icone**: [Lucide React](https://lucide.dev/)
*   **Animazioni**: [Framer Motion](https://www.framer.com/motion/)
*   **Networking**: `axios` per le chiamate API REST

## 📂 **Struttura del Progetto**
*   `app/`: Routing principale e pagine (`login`, `organizations`, `page.tsx`).
*   `components/ui/`: Libreria di componenti atomici (Buttons, Cards, Inputs, ecc.).
*   `lib/`: Configurazioni e utility (es. `variables.ts` per endpoint API).
