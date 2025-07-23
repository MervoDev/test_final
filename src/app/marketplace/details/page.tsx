"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import Image from "next/image";

type Produit = {
  id: string;
  nom: string;
  reference?: string;
  prix: string;
  categorie: string;
  statut: "Disponible" | "Indisponible";
  images?: string[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";
  const [produit, setProduit] = useState<Produit | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduit = async () => {
      try {
        const docRef = doc(db, "produits", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduit({ id: docSnap.id, ...(docSnap.data() as Omit<Produit, "id">) });
        } else {
          console.log("Produit non trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
      }
    };

    fetchProduit();
  }, [id]);

  if (!produit) return <div className="pt-24 px-6">Chargement...</div>;

  return (
    <div className="pt-24 px-6 lg:px-16">
      <h1 className="text-3xl font-bold mb-4">{produit.nom}</h1>
      <p>Prix : {produit.prix} FCFA</p>
      <p>Catégorie : {produit.categorie}</p>
      <p>Statut : {produit.statut}</p>

      {produit.images?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {produit.images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`${produit.nom} image ${index + 1}`}
              width={300}
              height={300}
              className="rounded shadow"
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">Aucune image disponible.</p>
      )}
    </div>
  );
}
