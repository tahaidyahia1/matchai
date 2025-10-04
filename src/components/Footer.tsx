import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

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
              Experience the finest Japanese matcha with modern elegance in the heart of Agdal, Rabat. 
              Where tradition meets sophistication.
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-gray-700 text-white hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 bg-gray-700 text-white hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </button>
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