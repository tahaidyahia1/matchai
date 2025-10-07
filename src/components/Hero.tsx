import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import Button from './Button';

export default function Hero() {
  return (
    <section className="relative h-[500px] pt-16 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://unsplash.com/fr/photos/une-cuillere-en-bois-remplie-de-poudre-verte-o4r21WG-VKw')] bg-cover bg-center opacity-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gray-200 rounded-full blur-2xl opacity-40"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 tracking-tight">
         
          <span className="block text-black">Matcha with Elegance</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
     Discover the finest Japanese matcha, now in Agdal. Where
tradition meets modern sophistication.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/menu">
            <Button size="lg" icon={ArrowRight}>
              Order Now
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}