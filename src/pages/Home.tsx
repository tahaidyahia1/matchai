import React from 'react';
import { Link } from 'react-router-dom';
import { Award, MapPin, Leaf } from 'lucide-react';
import Hero from '../components/Hero';
import Button from '../components/Button';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Intro Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Welcome to Matchai
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                The first matcha bar in Morocco, where tradition is honored and every cup is freshly whisked before your eyes. A serene and elegant escape from reality. Sip green, feel seen.
              </p>
              <Link to="/about">
                <Button variant="outline">
                  Our Story
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
                <img 
                  src="/IMG_9716.jpg" 
                  alt="Premium Matcha"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Award className="h-8 w-8 text-black" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Matchai?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of authentic Japanese tradition and modern Moroccan hospitality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Leaf className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                Sourced directly from the finest Japanese matcha farms, ensuring authentic taste and superior quality in every cup.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Expert Craftsmanship</h3>
              <p className="text-gray-600">
                Each drink is carefully crafted by our trained baristas who understand the delicate art of matcha preparation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Prime Location</h3>
              <p className="text-gray-600">
                Conveniently located in the heart of Agdal, Rabat, making it the perfect spot for your daily matcha ritual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for your Matchai moment?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join us for an unforgettable matcha experience where Japanese tradition meets refined simplicity
          </p>
          <Link to="/menu">
            <Button variant="secondary" size="lg">
              Order Your Matcha Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}