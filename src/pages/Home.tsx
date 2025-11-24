import React from 'react';
import { Link } from 'react-router-dom';
import { Award, MapPin, Leaf, Sparkles, Coffee, Users } from 'lucide-react';
import Button from '../components/Button';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <div className="bg-cream-50">
      <Hero />

      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-matcha-100/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] bg-gradient-to-br from-matcha-100 to-cream-200 rounded-3xl overflow-hidden premium-shadow hover-lift">
                <img
                  src="/7fe0472b-ea1c-43c0-94fb-e92e4c133647.jpg"
                  alt="Matchai signature layered drinks"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white rounded-3xl premium-shadow flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                <Award className="h-12 w-12 text-matcha-600" />
              </div>
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-br from-matcha-500 to-matcha-600 rounded-full blur-2xl opacity-20"></div>
            </div>
            <div className="order-1 lg:order-2 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-matcha-100/50 rounded-full mb-6">
                <span className="text-sm font-semibold text-matcha-800">Est. 2024</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal-950 mb-6 leading-tight">
                Welcome to Matchai
              </h2>
              <p className="text-lg text-charcoal-600 leading-relaxed mb-6 font-light">
                Morocco's pioneering matcha bar, where centuries-old Japanese tradition meets contemporary elegance. Every cup is ceremonially whisked before your eyes, transforming premium matcha into a moment of zen.
              </p>
              <p className="text-lg text-charcoal-600 leading-relaxed mb-8 font-light">
                A serene sanctuary in the heart of Rabat where you can escape, sip mindfully, and feel truly seen.
              </p>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Discover Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal-950 mb-6">
              The Matchai Difference
            </h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto font-light">
              Where authenticity, craftsmanship, and community converge to create an unparalleled matcha experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="group">
              <div className="bg-gradient-to-br from-cream-50 to-white p-10 rounded-3xl premium-shadow hover-lift border border-cream-200 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-matcha-500 to-matcha-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Ceremonial Grade</h3>
                <p className="text-charcoal-600 leading-relaxed font-light">
                  Exclusively sourced from premier Japanese tea estates in Uji and Nishio, our ceremonial-grade matcha delivers unmatched flavor, vibrant color, and healthful antioxidants.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-cream-50 to-white p-10 rounded-3xl premium-shadow hover-lift border border-cream-200 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-matcha-500 to-matcha-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Coffee className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Artisan Preparation</h3>
                <p className="text-charcoal-600 leading-relaxed font-light">
                  Our expertly trained baristas honor traditional whisking techniques, ensuring each matcha is properly aerated and served at the perfect temperature for optimal taste.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-cream-50 to-white p-10 rounded-3xl premium-shadow hover-lift border border-cream-200 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-matcha-500 to-matcha-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Prime Agdal Location</h3>
                <p className="text-charcoal-600 leading-relaxed font-light">
                  Nestled in Rabat's vibrant Agdal district, our elegantly designed space offers the perfect retreat for matcha enthusiasts and curious newcomers alike.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-matcha-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-matcha-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
            Begin Your Matcha Journey
          </h2>
          <p className="text-xl md:text-2xl text-cream-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Discover why discerning matcha lovers across Morocco choose Matchai for their daily ritual
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/menu">
              <Button variant="secondary" size="lg">
                View Full Menu
              </Button>
            </Link>
            <Link to="/loyalty">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal-950">
                Join Loyalty Program
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}