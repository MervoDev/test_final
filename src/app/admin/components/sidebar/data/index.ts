import * as Icons from "../icons";
import type { ComponentType } from "react";


type NavSubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  url?: string;
  items: NavSubItem[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "Produits",
        icon: Icons.Produits,
        url: "/produits",
        items: [],
      },
      {
        title: "Commandes",
        icon: Icons.Commandes,
        url: "/commande",
        items: [],
      },
      {
        title: "Clients",
        icon: Icons.ClientIcon,
        url: "/clients",
        items: [],
      },
      {
        title: "Compte",
        icon: Icons.CompteIcon,
        url: "/profile",
        items: [],
      },
    ],
  },
];
