"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";

type Produit = {
  id: string;
  nom: string;
  prix: string;
  image?: string;
  quantite: number;
};

type State = {
  panier: Produit[];
};

type Action =
  | { type: "AJOUTER"; payload: Produit }
  | { type: "SUPPRIMER"; payload: string }
  | { type: "VIDER" };

const CartContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: { panier: [] }, dispatch: () => null });

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "AJOUTER":
      const exist = state.panier.find(p => p.id === action.payload.id);
      if (exist) {
        return {
          ...state,
          panier: state.panier.map(p =>
            p.id === action.payload.id ? { ...p, quantite: p.quantite + 1 } : p
          ),
        };
      }
      return {
        ...state,
        panier: [...state.panier, { ...action.payload, quantite: 1 }],
      };

    case "SUPPRIMER":
      return {
        ...state,
        panier: state.panier.filter(p => p.id !== action.payload),
      };

    case "VIDER":
      return { panier: [] };

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { panier: [] });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
