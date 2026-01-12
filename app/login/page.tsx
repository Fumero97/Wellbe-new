"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOGIN_ENDPOINT } from "@/lib/variables";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, EyeOff, Globe } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const params = new URLSearchParams();
            params.append("email", email);
            params.append("password", password);

            const res = await axios.post(LOGIN_ENDPOINT, params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true,
            });
            setLoading(false);

            if (res.status === 200) {
                router.push("/organizations");
            } else {
                alert("Credenziali non valide");
            }

        } catch (error: unknown) {
            setLoading(false);
            if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                alert("Email o password errate");
            } else {
                alert("Errore di connessione al server");
                console.error(error);
            }
        }
    }

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Left Column - Image */}
            <div className="hidden lg:block lg:w-1/3 relative overflow-hidden bg-slate-900">
                {/* Fallback pattern/gradient if image fails or while loading */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1C75BC] to-[#0A2E50]" />
                 {/* 
                    Ideally, we would use the exact image from the user. 
                    For now, I'll use a high-quality Unsplash image that matches the "windy freedom" vibe 
                    and overlay the blue tint to match the brand.
                 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2670&auto=format&fit=crop" 
                    alt="Woman looking at landscape" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                
                {/* Branding Overlay (optional, based on screenshot might just be clean) */}
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-2/3 flex flex-col p-8 lg:p-12 xl:p-24 relative">
                
                {/* Header: Language & Logo */}
                <div className="flex justify-between items-start mb-20">
                     <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-3 py-1.5 rounded text-sm font-medium cursor-pointer hover:bg-slate-200 transition-colors">
                        <Globe className="h-4 w-4" />
                        <span>IT</span>
                        <ChevronDown className="h-3 w-3 ml-1" />
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/img/Wellbe-logo-blue.svg" alt="Wellbe" className="h-8" />
                </div>

                {/* Main Content */}
                <div className="flex-1 max-w-md mx-auto w-full">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Accedi al tuo account</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="email" className="text-blue-600 font-semibold">e-mail •</Label>
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder=""
                                className="bg-blue-50/50 border-blue-300 focus:border-blue-600 focus:ring-blue-600 h-12 rounded-md"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                             <Label htmlFor="password" className="text-slate-500 font-medium">Password •</Label>
                             <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="bg-slate-100 border-transparent focus:bg-white focus:border-slate-300 h-12 rounded-md pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                             </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-12 text-lg bg-[#1C75BC] hover:bg-[#155a91] text-white shadow-lg shadow-blue-900/10 rounded-md mt-4 font-medium" 
                            disabled={loading}
                        >
                            {loading ? "Accesso..." : "Login"}
                        </Button>

                         <div className="text-center pt-2">
                            <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-700">
                                Password dimenticata?
                            </a>
                        </div>
                    </form>
                </div>

                 {/* Footer */}
                 <div className="mt-auto pt-10 text-center space-y-2">
                    <div className="flex justify-center gap-6 text-sm text-slate-500 font-medium">
                        <a href="#" className="hover:text-slate-800">WB Index</a>
                        <a href="#" className="hover:text-slate-800">Terms of service</a>
                        <a href="#" className="hover:text-slate-800">Privacy policy</a>
                    </div>
                    <div className="text-xs text-slate-400">
                        @2025 Wellbe by Blue Innovation. - All right reserved
                    </div>
                 </div>
            </div>
        </div>
    );
}
