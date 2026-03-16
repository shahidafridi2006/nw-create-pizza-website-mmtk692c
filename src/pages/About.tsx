import { Link } from 'react-router-dom'
import { ChefHat, Award, Leaf, Heart, Users, Clock } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Fresh Ingredients',
      description: 'We source the finest ingredients from local farms and imported Italian specialties.',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Made with Love',
      description: 'Every pizza is handcrafted with passion by our skilled pizzaiolos.',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Authentic Recipes',
      description: 'Traditional Neapolitan recipes passed down through generations.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community First',
      description: 'We believe in giving back and supporting our local community.',
    },
  ]

  const timeline = [
    {
      year: '1985',
      title: 'The Beginning',
      description: 'Giuseppe Bella opens a small pizzeria in Little Italy, serving authentic Neapolitan pizza.',
    },
    {
      year: '1995',
      title: 'Growing Family',
      description: 'The Bella family expands, bringing in second-generation pizzaiolos.',
    },
    {
      year: '2005',
      title: 'Award Recognition',
      description: 'Pizza Bella wins "Best Pizza in the City" for the first time.',
    },
    {
      year: '2015',
      title: 'Going Digital',
      description: 'Launched online ordering to serve customers better.',
    },
    {
      year: '2024',
      title: 'Still Going Strong',
      description: 'Three generations later, we continue serving the same authentic recipes.',
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Three generations of passion, tradition, and the perfect slice of pizza
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-6">
                From Naples to Your Table
              </h2>
              <p className="text-stone-600 mb-4 leading-relaxed">
                In 1985, Giuseppe Bella left his hometown of Naples, Italy, with nothing but a dream 
                and his grandmother's treasured pizza recipes. He settled in Little Italy, determined 
                to share the authentic taste of Neapolitan pizza with his new community.
              </p>
              <p className="text-stone-600 mb-4 leading-relaxed">
                What started as a small corner pizzeria has grown into a beloved neighborhood institution. 
                Today, three generations later, the Bella family continues Giuseppe's legacy, using the 
                same traditional techniques and recipes that made our pizza famous.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Every pizza we make is a tribute to Giuseppe's vision: authentic Italian flavors, 
                made with love, served with pride. We invite you to taste the tradition that has 
                brought families together for nearly four decades.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <ChefHat className="w-48 h-48 text-secondary-600 opacity-50" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <span className="font-bold text-2xl">39+</span>
                <span className="block text-sm">Years of Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-stone-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-stone-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">
              Milestones that shaped who we are today
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200 hidden md:block"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-stone-50 rounded-xl p-6 shadow-md">
                      <span className="text-primary-600 font-bold text-lg">{item.year}</span>
                      <h3 className="font-display text-xl font-bold text-stone-800 mt-1 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-stone-600">{item.description}</p>
                    </div>
                  </div>

                  <div className="w-4 h-4 bg-primary-600 rounded-full ring-4 ring-primary-200 z-10"></div>

                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">
              The passionate people behind every perfect pizza
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marco Bella',
                role: 'Head Pizzaiolo',
                bio: 'Third-generation pizza maker with 25 years of experience.',
              },
              {
                name: 'Sofia Bella',
                role: 'Operations Manager',
                bio: 'Keeping everything running smoothly since 2010.',
              },
              {
                name: 'Antonio Bella',
                role: 'Executive Chef',
                bio: 'Creating new recipes while honoring tradition.',
              },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 h-48 flex items-center justify-center">
                  <div className="w-24 h-24 bg-primary-300 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-stone-800">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                  <p className="text-stone-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Taste the Tradition?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Order online and experience authentic Neapolitan pizza made with love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-secondary text-lg">
              View Our Menu
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}