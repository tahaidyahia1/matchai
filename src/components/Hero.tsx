import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import Button from './Button';

export default function Hero() {
  return (
    <div>
      <section className="relative h-[500px] pt-16 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/andrea-lacasse-o4r21WG-VKw-unsplash (1) copy.jpg"
            alt="Matcha powder background"
            className="w-full h-full object-cover brightness-105"
          />
          <div className="absolute inset-0 bg-white/40"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 tracking-tight">

            <span className="block text-black">Matchai</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-900 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
       Discover the place where matcha and community comes together.
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
    </div>
  );
}