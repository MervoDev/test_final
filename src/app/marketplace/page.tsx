"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const imagesCarousel = [
  "/images/img1.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/img4.jpg",
];

interface Produit {
  id: string;
  nom: string;
  prix: number | string;
  categorie: string;
  statut: "Disponible" | "Indisponible";
  images?: string[];
}

export default function BoutiquePage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [produits, setProduits] = useState<Produit[]>([]);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  useEffect(() => {
    const fetchProduits = async () => {
      const querySnapshot = await getDocs(collection(db, "produits"));
      const produitsList: Produit[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Produit[];
      setProduits(produitsList);
    };
    fetchProduits();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % imagesCarousel.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % imagesCarousel.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) =>
      prev === 0 ? imagesCarousel.length - 1 : prev - 1
    );
  };

  const produitsFiltres = produits.filter((p) =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 px-6 lg:px-16 bg-gray-50 min-h-screen">
      <div className="-mx-10 lg:-mx-50 mb-10">
        <div className="relative max-w-screen-xl mx-auto rounded-3xl overflow-hidden shadow-lg">
          <Image
            src={imagesCarousel[carouselIndex]}
            alt={`Slide ${carouselIndex + 1}`}
            width={1280}
            height={400}
            quality={100}
            className="w-full h-64 md:h-[400px] object-cover rounded-3xl transition-all duration-700"
          />

          <button
            onClick={prevSlide}
            aria-label="Précédent"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            aria-label="Suivant"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {imagesCarousel.map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === carouselIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto my-10 relative px-4">
        <Search className="absolute top-3 left-7 text-gray-400" size={17} />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="w-full border border-gray-300 rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {produitsFiltres.map((produit) => (
          <div
            key={produit.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <Image
              src={produit.images?.[0] || "/placeholder.jpg"}
              alt={produit.nom}
              className="h-48 w-full object-cover"
              width={500}
              height={500}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {produit.nom}
              </h3>
              <p className="text-sm text-gray-500">{produit.categorie}</p>
              <p className="text-green-600 font-bold text-lg mt-1">
                {produit.prix} FCFA
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${
                  produit.statut === "Disponible"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {produit.statut}
              </span>

              <Link
                href={`/marketplace/details/${produit.id}`}
                className="block mt-4 text-center text-blue-600 hover:underline"
              >
                Voir le produit →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {produitsFiltres.length === 0 && (
        <p className="text-center text-gray-500 mt-12">Aucun produit trouvé.</p>
      )}
    </div>
  );
}
