
"use client";
import { useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); 
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      // Création de l'utilisateur dans Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ajout dans Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: role,
        createdAt: new Date(),
      });

      router.push("/SignIn");
    } catch {
     
    }
  };

  return (
    <section className="h-screen w-full flex items-center justify-center flex-col gap-2">
      <form className="flex flex-col gap-2 bg-slate-50 p-5 rounded-md shadow-md">
        <h1 className="text-center text-gray-900 text-4xl mb-3 font-bold">Inscription</h1>

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

        <label htmlFor="role" className="text-slate-900">Rôle</label>
        <select
          id="role"
          className="h-10 border border-slate-900 rounded-md p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>

        <button
          type="button"
          onClick={handleSignUp}
          className="bg-blue-400 px-3 py-1.5 text-white my-3 rounded-md hover:bg-gray-700"
        >
          S'inscrire
        </button>

        <a href="/signin" className="text-red-500 hover:text-red-900 text-sm">
          Déjà un compte ? Se connecter
        </a>
      </form>
    </section>
  );
}
