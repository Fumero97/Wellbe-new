"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        // Perform cleanup (clear tokens, cookies, etc.)
        // For now, since we are using mock auth, we just redirect.
        // If we had cookies or localStorage, we would clear them here.
        // document.cookie = "..."; 
        
        // Redirect to homepage
        router.replace("/");
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <p className="text-slate-500">Disconnessione in corso...</p>
        </div>
    );
}
