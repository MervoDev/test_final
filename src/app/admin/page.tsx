"use client";

import { Sidebar } from "./components/sidebar";
import RequireAuth from "../requireauth";

export default function AdminPage() {
  return (
    <RequireAuth>
      <div className="flex min-h-screen">
      
        <Sidebar />

       
        <main className="flex-1 p-6 bg-gray-50">
          
          
        </main>
      </div>
    </RequireAuth>
  );
}
