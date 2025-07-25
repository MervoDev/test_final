"use client";
import { useCart } from "./cartcontext";
import Image from "next/image";

export default function PanierPage() {
  const { state, dispatch } = useCart();
  const { panier } = state;

  const total = panier.reduce(
    (acc, item) => acc + Number(item.prix) * item.quantite,
    0
  );

  return (
    <div className="pt-24 px-6 lg:px-16">
      <h1 className="text-3xl font-bold mb-6 text-center">Mon Panier</h1>

      {panier.length === 0 ? (
        <p className="text-center text-gray-500">Votre panier est vide.</p>
      ) : (
        <div className="space-y-6">
         {panier.map((item) => (
  <div
    key={item.id}
    className="flex items-center justify-between border-b pb-4"
  >
    <div className="flex items-center gap-4">
      {item.image && (
        <Image
          src={item.image}
          alt={item.nom}
          width={80}
          height={80}
          className="rounded"
        />
      )}
      <div>
        <h3 className="text-lg font-semibold">{item.nom}</h3>
        <p className="text-sm text-gray-500">
          {item.prix} FCFA
        </p>
        <div className="flex items-center mt-2 space-x-2">
          <button
            onClick={() =>
              dispatch({ type: "DECREMENTER", payload: item.id })
            }
            className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span>{item.quantite}</span>
          <button
            onClick={() =>
              dispatch({ type: "INCREMENTER", payload: item.id })
            }
            className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>
    </div>
    <button
      onClick={() => dispatch({ type: "SUPPRIMER", payload: item.id })}
      className="text-red-600 hover:underline"
    >
      Supprimer
    </button>
  </div>
))}

          <div className="text-right mt-6">
            <h2 className="text-xl font-bold">Total : {total} FCFA</h2>
            <button
              onClick={() => dispatch({ type: "VIDER" })}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-800"
            >
              Vider le panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
