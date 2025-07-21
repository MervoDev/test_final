"use client";
import { useState } from "react";
import { auth } from "../../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin"); 
    } catch (err: any) {
      console.error(err);
      setError("Email ou mot de passe invalide");
    }
  };

  return (
    <section className="h-screen w-full flex items-center justify-center flex-col gap-2">
      <form className="flex flex-col gap-2 bg-slate-50 p-5 rounded-md shadow-md">
        <h1 className="text-center text-gray-900 text-4xl mb-3 font-bold">Connexion</h1>

        <label htmlFor="email" className="text-slate-900">Email</label>
        <input
          type="email"
          id="email"
          className="h-10 border border-slate-900 rounded-md p-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password" className="text-slate-900">Mot de passe</label>
        <input
          type="password"
          id="password"
          className="h-10 border border-slate-900 rounded-md p-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="button"
          onClick={handleSignIn}
          className="bg-blue-400 px-3 py-1.5 text-white my-3 rounded-md hover:bg-gray-700"
        >
          Se connecter
        </button>

        <a href="/SignUp" className="text-red-500 hover:text-red-900 text-sm">
          Pas de compte ? Créer un compte
        </a>
      </form>
    </section>
  );
}
