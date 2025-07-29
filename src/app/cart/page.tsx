"use client";
import { useCart } from "./cartcontext";
import Image from "next/image";
import { useState } from "react";

export default function PanierPage() {
  const { state, dispatch } = useCart();
  const { panier } = state;

  const total = panier.reduce(
    (acc, item) => acc + Number(item.prix) * item.quantite,
    0
  );

  const [confirmation, setConfirmation] = useState("");

  const handleCommander = () => {
    if (panier.length === 0) {
      setConfirmation("Votre panier est vide.");
      return;
    }

    const message = panier
      .map((item) => `${item.nom} x${item.quantite} - ${item.prix} FCFA`)
      .join("%0A"); 

    const phone = "+22943094136";
    const url = `https://wa.me/${phone}?text=Commande:%0A${message}%0ATotal: ${total} FCFA`;

    window.open(url, "_blank");
    setConfirmation("Votre commande est prête à être envoyée via WhatsApp !");
  };

  const handleEnvoyerMail = () => {
    if (panier.length === 0) {
      setConfirmation("Votre panier est vide.");
      return;
    }

    const message = panier
      .map((item) => `${item.nom} x${item.quantite} - ${item.prix} FCFA`)
      .join("\n"); 

    const subject = encodeURIComponent("Commande depuis le site");
    const body = encodeURIComponent(
      `Bonjour,\n\nJe souhaite passer la commande suivante :\n\n${message}\n\nTotal : ${total} FCFA\n\nMerci.`
    );

    const mailtoUrl = `mailto:floratogbonon@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    setConfirmation("Votre commande est prête à être envoyée par email !");
  };

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
                  <p className="text-sm text-gray-500">{item.prix} FCFA</p>
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
            <button
              onClick={handleCommander}
              className="mt-4 ml-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-800"
            >
              Passer la commande
            </button>
            <button
              onClick={handleEnvoyerMail}
              className="mt-4 ml-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
            >
              Envoyer par mail
            </button>
          </div>

          {confirmation && (
            <p className="mt-4 text-center text-green-700 font-semibold">
              {confirmation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
