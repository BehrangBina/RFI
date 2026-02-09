import { useState, useEffect } from 'react';
import HeroCarousel from '../components/HeroCarousel';

interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  orderIndex: number;
}

const Home = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/heroslides')
      .then(res => res.json())
      .then(data => {
        setSlides(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load hero slides:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Carousel - Full Width */}
      <div className="-mt-24 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        {!loading && slides.length > 0 && <HeroCarousel slides={slides} />}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Welcome to Rise For Iran</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We are a community dedicated to promoting human rights, democracy, and freedom for Iran.
          </p>
        </section>

        {/* Featured Events/News sections can go here */}
      </div>
    </div>
  );
};

export default Home;
