"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc , getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [produit, setProduit] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduit = async () => {
      const docRef = doc(db, "produits", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduit({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("Produit non trouvé");
      }
    };
    fetchProduit();
  }, [id]);

  if (!produit) return <div>Chargement...</div>;

  return (
    <div className="pt-24 px-6 lg:px-16">
      <h1 className="text-3xl font-bold mb-4">{produit.nom}</h1>
      {/* Affiche d'autres infos ici */}
      <p>Prix : {produit.prix} FCFA</p>
      <p>Catégorie : {produit.categorie}</p>
      <p>Statut : {produit.statut}</p>
      {/* Images */}
      {produit.images?.map((img: string, index: number) => (
        <img key={index} src={img} alt={`${produit.nom} image ${index + 1}`} />
      ))}
    </div>
  );
}
