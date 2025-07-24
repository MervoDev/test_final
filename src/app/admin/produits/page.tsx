"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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

// Typage du produit
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

    const payload = {
      nom: formData.nom,
      reference: formData.reference,
      prix: formData.prix,
      categorie: formData.categorie,
      statut: formData.statut,
      images,
      updatedAt: new Date(),
    };

    try {
      if (isEditing && produitActuel) {
        const docRef = doc(db, "produits", produitActuel.id);
        await updateDoc(docRef, payload);
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
      reference: produit.reference || "",
      prix:String(produit.prix),
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Gestion des Produits</h2>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            onClick={() => {
              resetForm();
              setAfficherFormulaire(true);
            }}
          >
            <Plus size={20} /> Ajouter un produit
          </button>
        </div>

       
        {afficherFormulaire && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {isEditing ? "✏️ Modifier le produit" : "➕ Nouveau produit"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block mb-1 font-medium">Nom du produit</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">ID (référence)</label>
                  <input
                    type="text"
                    name="reference"
                    placeholder="agb-001-id"
                    value={formData.reference}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Prix</label>
                  <input
                    type="text"
                    name="prix"
                    value={formData.prix}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Catégorie</label>
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Statut</label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Indisponible">Indisponible</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">Images</label>
                  {images.map((img, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg"
                        placeholder="https://exemple.com/image.jpg"
                      />
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageField(index)}
                          className="px-3 text-red-500 hover:text-red-700"
                        >
                          -
                        </button>
                      )}
                      {index === images.length - 1 && (
                        <button
                          type="button"
                          onClick={handleAddImageField}
                          className="px-3 text-green-500 hover:text-green-700"
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                  >
                    {isEditing ? "Enregistrer les modifications" : "Enregistrer le produit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
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
                <tr key={produit.id} className="border-b">
                  <td className="p-4">
                    <Image
                      src={produit.images?.[0] || ""}
                      alt={produit.nom}
                      className="w-12 h-12 rounded object-cover"
                      width={500}
                      height={500}
                    />
                  </td>
                  <td className="p-4 font-medium">{produit.nom}</td>
                  <td className="p-4">{produit.prix}</td>
                  <td className="p-4">{produit.categorie}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        produit.statut === "Disponible"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {produit.statut}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(produit)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(produit.id)}
                    >
                      <Trash2 size={18} />
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
