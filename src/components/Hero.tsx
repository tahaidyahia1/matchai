import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from './Button';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] pt-16 flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream-50 via-white to-matcha-50">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/5946637/pexels-photo-5946637.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Premium matcha powder and whisk"
          className="w-full h-full object-cover opacity-[0.12]"
        />
      </div>

      <div className="absolute top-20 left-10 w-96 h-96 bg-matcha-200/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cream-300/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-matcha-100/20 to-transparent rounded-full blur-2xl"></div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-display font-bold text-charcoal-950 mb-6 leading-[1.1] animate-slide-up" style={{ letterSpacing: '-0.02em' }}>
          Where Tradition
          <span className="block text-charcoal-950">Meets Excellence</span>
        </h1>

        <p className="text-xl md:text-2xl text-charcoal-600 mb-10 max-w-3xl mx-auto leading-relaxed font-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Experience the art of Japanese matcha, ceremonially whisked and thoughtfully crafted in the heart of Rabat.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/menu">
            <Button size="lg" icon={ArrowRight}>
              Explore Menu
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg">
              Our Story
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-matcha-600 mb-2">100%</div>
            <div className="text-sm text-charcoal-600 font-medium">Ceremonial Grade</div>
          </div>
          <div className="text-center border-x border-charcoal-200">
            <div className="text-3xl md:text-4xl font-bold text-matcha-600 mb-2">Made</div>
            <div className="text-sm text-charcoal-600 font-medium">Fresh Daily</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-matcha-600 mb-2">#1</div>
            <div className="text-sm text-charcoal-600 font-medium">In Morocco</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-50 to-transparent"></div>
    </section>
  );
}