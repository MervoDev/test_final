
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Sidebar } from "../components/sidebar";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import {
  PlusCircle,
  XCircle,
  Pencil,
  Trash,
  FolderPlus,
  Search,
} from "lucide-react";

interface Produit {
  id: string;
  nom: string;
  reference?: string;
  prix: string | number;
  categorie: string;
  statut: "Disponible" | "Indisponible";
  images?: string[];
}

export default function ProduitsPage() {
  const [search, setSearch] = useState("");
  const [produits, setProduits] = useState<Produit[]>([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [images, setImages] = useState<string[]>([""]);
  const [isEditing, setIsEditing] = useState(false);
  const [produitActuel, setProduitActuel] = useState<Produit | null>(null);

  const CATEGORIES = [
    "Art de table",
    "Table",
    "Planche de fond",
    "Structure",
    "Figurine",
    "Outils & Accessoires",
    "Plantes artificielles",
    "Arche",
  ];

  const produitsFiltres = produits.filter((p) =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddImageField = () => {
    setImages([...images, ""]);
  };

  const handleRemoveImageField = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const [formData, setFormData] = useState({
    nom: "",
    id: "",
    reference: "",
    prix: "",
    categorie: "",
    statut: "Disponible" as "Disponible" | "Indisponible",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchProduits = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "produits"));
      const produitsList: Produit[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Produit[];
      setProduits(produitsList);
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const resetForm = () => {
    setFormData({
      nom: "",
      id: "",
      reference: "",
      prix: "",
      categorie: "",
      statut: "Disponible",
    });
    setImages([""]);
    setIsEditing(false);
    setProduitActuel(null);
    setAfficherFormulaire(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, images, updatedAt: new Date() };

    try {
      if (isEditing && produitActuel) {
        await updateDoc(doc(db, "produits", produitActuel.id), payload);
      } else {
        await addDoc(collection(db, "produits"), {
          ...payload,
          createdAt: new Date(),
        });
      }
      await fetchProduits();
      resetForm();
    } catch (error) {
      console.error("Erreur Firebase :", error);
      alert("Erreur lors de l'enregistrement. Voir console.");
    }
  };

  const handleEdit = (produit: Produit) => {
    setFormData({
      nom: produit.nom,
      id: produit.id,
      reference: produit.reference || "",
      prix: String(produit.prix),
      categorie: produit.categorie,
      statut: produit.statut,
    });
    setImages(produit.images || [""]);
    setProduitActuel(produit);
    setIsEditing(true);
    setAfficherFormulaire(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "produits", id));
      setProduits((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="flex min-h-screen pt-20">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Produits</h2>
          <button
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
            onClick={() => {
              resetForm();
              setAfficherFormulaire(true);
            }}
          >
            <FolderPlus size={18} /> Ajouter
          </button>
        </div>

        {afficherFormulaire && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {isEditing ? "Modifier le produit" : "Nouveau produit"}
                </h3>
                <button onClick={resetForm}>
                  <XCircle className="text-gray-400 hover:text-red-500" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Nom */}
                
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleFormChange}
                  className="border px-3 py-2 rounded-lg"
                  required
                />
                {/* ID*/}
                <input
                  type="text"
                  name="id"
                  placeholder="agb-001-id"
                  value={formData.id}
                  onChange={handleFormChange}
                  className="border px-3 py-2 rounded-lg"
                  required
                />
                {/* Prix */}
                <input
                  type="text"
                  name="prix"
                  placeholder="Prix"
                  value={formData.prix}
                  onChange={handleFormChange}
                  className="border px-3 py-2 rounded-lg"
                  required
                />
                {/* Catégorie */}
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleFormChange}
                  className="border px-3 py-2 rounded-lg"
                  required
                >
                  <option value="">Choisir une catégorie</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {/* Statut */}
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleFormChange}
                  className="border px-3 py-2 rounded-lg"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Indisponible">Indisponible</option>
                </select>
                {/* Images */}
                <div className="md:col-span-2">
                  <label className="block mb-2 font-semibold text-gray-700">Images du produit</label>

                  <div className="space-y-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <input
                          type="url"
                          value={img}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="https://raw.githubusercontent.com/MervoDev/test_final/refs/heads/main/images/Panneaux%20floraux3.webp"
                        />

                        {images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImageField(index)}
                            className="absolute top-1/2 -translate-y-1/2 right-2 text-red-500 hover:text-red-700"
                            title="Supprimer cette image"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-start">
                    <button
                      type="button"
                      onClick={handleAddImageField}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow transition"
                    >
                      ➕ Ajouter une image
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-between gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {

                      setAfficherFormulaire(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                  >
                    ❌ Annuler
                  </button>

                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                  >
                    {isEditing ? "💾 Enregistrer les modifications" : "💾 Enregistrer le produit"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Nom</th>
                <th className="p-4">Prix</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produitsFiltres.map((produit) => (
                <tr key={produit.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Image
                      src={produit.images?.[0] || ""}
                      alt={produit.nom}
                      className="w-12 h-12 rounded object-cover"
                      width={48}
                      height={48}
                    />
                  </td>
                  <td className="p-4 font-semibold">{produit.nom}</td>
                  <td className="p-4">{produit.prix} FCFA</td>
                  <td className="p-4">{produit.categorie}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${produit.statut === "Disponible" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {produit.statut}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <button onClick={() => handleEdit(produit)}>
                      <Pencil className="text-blue-500 hover:text-blue-700" size={18} />
                    </button>
                    <button onClick={() => handleDelete(produit.id)}>
                      <Trash className="text-red-500 hover:text-red-700" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}


