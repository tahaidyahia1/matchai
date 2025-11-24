import React from 'react';
import { MapPin, Phone, Mail, Instagram, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950 text-cream-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-matcha-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-matcha-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-4xl font-black text-white tracking-tight uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}>
                MATCHAI
              </span>
            </div>
            <p className="text-cream-200 mb-8 max-w-md leading-relaxed font-light text-lg">
              Experience the art of ceremonial matcha in Morocco's first dedicated matcha bar. Where Japanese tradition meets contemporary elegance.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/matchai.ma?igsh=YnA0bDVqMHVtdGN1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-matcha-500 to-matcha-600 text-white hover:from-matcha-600 hover:to-matcha-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-matcha-600/30"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@matchai.ra?_t=ZS-90GBuphEnf3&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-matcha-500 to-matcha-600 text-white hover:from-matcha-600 hover:to-matcha-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-matcha-600/30"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <Leaf className="h-5 w-5 text-matcha-400" />
              Quick Links
            </h3>
            <div className="space-y-3">
              {['Menu', 'About', 'Loyalty', 'Contact'].map((link) => (
                <Link
                  key={link}
                  to={`/${link.toLowerCase()}`}
                  className="block text-cream-200 hover:text-matcha-400 transition-colors font-medium text-sm"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-lg font-bold mb-6 text-white">Visit Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <MapPin className="h-5 w-5 text-matcha-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-cream-100 font-medium mb-1">Location</div>
                  <div className="text-cream-300 text-sm">Agdal, Rabat – Morocco</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <Phone className="h-5 w-5 text-matcha-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-cream-100 font-medium mb-1">Phone</div>
                  <a href="tel:+212654339907" className="text-cream-300 text-sm hover:text-matcha-400 transition-colors">+212 654-339907</a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <Mail className="h-5 w-5 text-matcha-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-cream-100 font-medium mb-1">Email</div>
                  <a href="mailto:contact@matchai.ma" className="text-cream-300 text-sm hover:text-matcha-400 transition-colors">contact@matchai.ma</a>
                </div>
              </div>
              <div className="pt-4 border-t border-charcoal-700">
                <div className="text-cream-100 font-medium mb-2">Hours</div>
                <div className="text-cream-300 text-sm">
                  <div>Monday – Sunday</div>
                  <div className="text-matcha-400 font-semibold">9:00 AM – 10:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-charcoal-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream-300 text-sm font-light">
              © 2025 MATCHAI. Crafted with passion in Rabat.
            </p>
            <div className="flex items-center gap-2 text-cream-400 text-xs">
              <span className="px-3 py-1.5 bg-charcoal-800 rounded-full">Premium Matcha</span>
              <span className="px-3 py-1.5 bg-charcoal-800 rounded-full">Rabat Agdal</span>
              <span className="px-3 py-1.5 bg-charcoal-800 rounded-full">Est. 2024</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
