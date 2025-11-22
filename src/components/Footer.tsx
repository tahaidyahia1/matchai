import React from 'react';
import { MapPin, Phone, Mail, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#dcdcdc] text-black">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-4xl font-black text-black tracking-tight uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}>
                MAT<span className="text-black">CHA</span>I
              </span>
            </div>
            <p className="text-black mb-6 max-w-md">
             Ready for you Matchai moment? 
 
Join us for an unforgettable matcha experience — where Japanese tradition meets refined simplicity
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/matchai.ma?igsh=YnA0bDVqMHVtdGN1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 text-white hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@matchai.ra?_t=ZS-90GBuphEnf3&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 text-white hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-black text-sm">Agdal, Rabat – Morocco</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-black text-sm">+212 654-339907</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-black text-sm">contact@matchai.ma</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Hours</h3>
            <div className="space-y-2">
              <div className="text-black text-sm">
                <div className="font-medium">Monday – Sunday</div>
                <div>9:00 AM – 10:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-400 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-black text-sm">
              © 2025 Matchai. All rights reserved.
            </p>
            <p className="text-black text-sm mt-2 md:mt-0">
              Matcha in Rabat • Matchai Agdal • Premium Matcha Coffee Morocco
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}