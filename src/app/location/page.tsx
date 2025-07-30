"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface ProduitLocation {
  id: string;
  nom: string;
  prixParJour: string | number;
  categorie: string;
  statut: "Disponible" | "Indisponible";
  images?: string[];
}

export default function LocationPage() {
  const [produits, setProduits] = useState<ProduitLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProduitsLocation = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "produits_location"));
      const list: ProduitLocation[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProduitLocation[];
      setProduits(list);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduitsLocation();
  }, []);

  return (
    <div className="pt-24 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Nos articles à louer</h1>

      {loading ? (
        <p className="text-center">Chargement en cours...</p>
      ) : produits.length === 0 ? (
        <p className="text-center text-gray-500">Aucun article de location disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produits.map((produit) => (
            <div key={produit.id} className="bg-[#fffaf6] rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
              <Image
                src={produit.images?.[0] || "/placeholder.jpg"}
                alt={produit.nom}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-semibold">{produit.nom}</h2>
              <p className="text-sm text-gray-600">Catégorie : {produit.categorie}</p>
              <p className="mt-2 font-medium">{produit.prixParJour} FCFA / jour</p>
              <span
                className={`text-xs inline-block mt-1 px-2 py-1 rounded-full ${
                  produit.statut === "Disponible"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {produit.statut}
              </span>

              <button
                disabled={produit.statut !== "Disponible"}
                className={`mt-4 w-full py-2 text-sm font-semibold rounded-lg ${
                  produit.statut === "Disponible"
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {produit.statut === "Disponible" ? "Réserver" : "Indisponible"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
