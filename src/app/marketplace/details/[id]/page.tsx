"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CartProvider } from "@/app/cart/cartcontext"; 
import { useCart } from "@/app/cart/cartcontext"; 



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
  const [imagePrincipale, setImagePrincipale] = useState<string | null>(null);
  const { dispatch } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchProduit = async () => {
      try {
        const docRef = doc(db, "produits", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<Produit, "id">;

          const cleanedUrls = data.images?.map(url => url.trim()) ?? [];
          setProduit({ id: docSnap.id, ...data, images: cleanedUrls });
          if (cleanedUrls.length > 0) {
            setImagePrincipale(cleanedUrls[0]);
          }
        } else {
          console.log("Produit non trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
      }
    };

    fetchProduit();
  }, [id]);

  const router = useRouter();

  const handleAddToCart = () => {
    if (produit) {
      dispatch({
        type: "AJOUTER",
        payload: {
          id: produit.id,
          nom: produit.nom,
          prix: produit.prix,
          image: imagePrincipale || produit.images?.[0],
          quantite: 1,
        },
      });
      router.push("/cart");
    }
  };


  if (!produit) return <div className="pt-24 px-6">Chargement...</div>;

  return (
    <div className="pt-24 px-6 lg:px-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{produit.nom}</h1>
        <p>Prix : {produit.prix} FCFA</p>
        <p>Catégorie : {produit.categorie}</p>
        <p>Statut : {produit.statut}</p>
      </div>
      {imagePrincipale && (
        <div className="my-6 flex justify-center">
          <Image

            src={imagePrincipale}
            alt={produit.nom}
            width={600}
            height={600}
            className="rounded-lg shadow-xl w-full max-w-md object-cover"
          />
        </div>
      )}

      {Array.isArray(produit.images) && produit.images.length > 1 && (
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          {produit.images.map((img, index) => (
            <Image
              key={index}
              src={img.trimStart()}
              alt={`Miniature ${index + 1}`}
              width={100}
              height={100}
              className={`rounded-md cursor-pointer border-2 ${img === imagePrincipale ? "border-blue-500" : "border-transparent"
                }`}
              onClick={() => setImagePrincipale(img)}
            />
          ))}


        </div>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleAddToCart}
          className="mt-6 bg-green-600 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
        >
          Ajouter au panier
        </button>
      </div>
      {produit.images?.length === 0 && (
        <p className="mt-4 text-gray-500">Aucune image disponible.</p>
      )}
    </div>
  );
}
