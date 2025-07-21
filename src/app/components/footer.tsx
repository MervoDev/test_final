import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-black to-purple-600 text-white py-8 px-4 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo / Nom */}
         <div>
            <h3 className="text-xl font-semibold mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-10 w-10 text-blue-400" />
                <span className="text-gray-300">Agla</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-10 w-10 text-blue-400" />
                <span className="text-gray-300 ">+229 01 67 52 24 13/01 43 09 41 36</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-10 w-10 text-blue-400" />
                <span className="text-gray-300">floratogbonon@gmail.com</span>
              </div>
            </div>
          </div>

        {/* Réseaux sociaux */}
        <div className="flex gap-4 items-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-200 transition">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="mailto:contact@lesdelicesdeflora.com" className="hover:text-white/80 transition">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-6">
        &copy; {new Date().getFullYear()} FloraDecor. Tous droits réservés.
      </div>
    </footer>
  );
}
