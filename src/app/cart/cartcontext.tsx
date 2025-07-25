// cartcontext.tsx

"use client";
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

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
  | { type: "VIDER" }
  | { type: "INCREMENTER"; payload: string }
  | { type: "DECREMENTER"; payload: string };

const CartContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: { panier: [] },
  dispatch: () => {},
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "AJOUTER": {
      const exist = state.panier.find((p) => p.id === action.payload.id);
      if (exist) {
        return {
          ...state,
          panier: state.panier.map((p) =>
            p.id === action.payload.id
              ? { ...p, quantite: p.quantite + 1 }
              : p
          ),
        };
      }
      return {
        ...state,
        panier: [...state.panier, { ...action.payload, quantite: 1 }],
      };
    }

    case "SUPPRIMER":
      return {
        ...state,
        panier: state.panier.filter((p) => p.id !== action.payload),
      };

    case "VIDER":
      return { panier: [] };

    case "INCREMENTER":
      return {
        ...state,
        panier: state.panier.map((p) =>
          p.id === action.payload
            ? { ...p, quantite: p.quantite + 1 }
            : p
        ),
      };

    case "DECREMENTER":
      return {
        ...state,
        panier: state.panier
          .map((p) =>
            p.id === action.payload
              ? { ...p, quantite: p.quantite - 1 }
              : p
          )
          .filter((p) => p.quantite > 0),
      };

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
