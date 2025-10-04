import React from 'react';
import { Leaf, Heart, Globe, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              About Matchai
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Where the ancient art of matcha meets modern elegance in the heart of Rabat
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                
Driven by our passion for matcha and the lack of high-quality options in Morocco, we moved from Amsterdam to Rabat to bring you the authentic experience you deserve.
 
At machai we believe matcha is more than a drink. it's a ritual of balance, clarity, and energy. Our mission is to bring the authentic taste of Japanese matcha to Rabat, with a modern twist that matches your lifestyle.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
              Whether you're starting your day, taking a break, or meeting with friends, Matchai is your location for pure green energy. 
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl overflow-hidden">
                <img
                  src="/348dabb9-de37-4148-ac58-bf1def118856.JPG"
                  alt="Matchai store interior with traditional matcha preparation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything we do is guided by our commitment to quality, tradition, and community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Authenticity</h3>
              <p className="text-gray-600">
                We source our matcha directly from traditional Japanese farms, ensuring every cup honors centuries of tradition.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Passion</h3>
              <p className="text-gray-600">
                Our love for matcha culture drives us to create exceptional experiences that go beyond just serving drinks.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Innovation</h3>
              <p className="text-gray-600">
               We honor traditional methods while infusing modern flavors, crafting unique drinks designed for today’s tastes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Community</h3>
              <p className="text-gray-600">
            Beyond serving matcha, we create a community where quality and connection go hand in hand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-100 rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1565117764032-21d3efebc7e3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
"
                  alt="Matchai interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">100%</div>
                  <div className="text-sm text-gray-600">Premium</div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                The Matchai Experience
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Step into our thoughtfully designed space in Agdal, where every element has been carefully chosen to create 
                an atmosphere of calm sophistication. From our minimalist silver and white interior to the gentle aroma 
                of freshly whisked matcha, every detail contributes to your moment of zen.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
               Every cup is more than a drink. It’s a ritual, where our baristas turn Japanese matcha into a work of art for both the eyes and the palate.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-gray-700">Ceremonial grade matcha powder</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-gray-700">Traditional whisking techniques</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-gray-700">Modern flavor innovations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-gray-700">Elegant, Instagram-worthy presentation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}