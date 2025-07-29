"use client"; 

import { Sidebar } from "./components/sidebar";
import { useSidebarContext } from "../../app/admin/components/sidebar/sidebar-context";
import RequireAuth from "../requireauth";
import { Menu } from "lucide-react";

export default function AdminPage() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
   <RequireAuth>
  <div className="flex min-h-screen">
    <Sidebar />

    <main className="flex-1 bg-gray-50">
      {/* Bouton Menu mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-[100px] left-4 z-50 md:hidden bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow"
      >
        <Menu size={20} />
        Menu
      </button>

      {/* Ton contenu ici */}
      <div className="p-6">
        Bienvenue dans l’espace admin !
      </div>
    </main>
  </div>
</RequireAuth>

  );
}
