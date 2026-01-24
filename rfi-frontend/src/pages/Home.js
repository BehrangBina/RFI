import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaTelegramPlane } from 'react-icons/fa';

const slides = [
  {
    image: `${process.env.PUBLIC_URL}/images/highlights/18Jan.png`,
    caption: '',
    subcaption: '',
  },
  {
    image: `${process.env.PUBLIC_URL}/images/highlights/olb-2.jpg`,
    caption: 'A Future of Hope',
    subcaption: 'Together we build the path forward.',
  },
  {
    image: `${process.env.PUBLIC_URL}/images/statements/paf1.jpg`,
    caption: '',
    subcaption: '',
  },
  {
    image: `${process.env.PUBLIC_URL}/images/highlights/alb-5.png`,
    caption: 'Trump take action now',
    subcaption: '12 & 13 / Jan / 2026',
  },
  {
    image: `${process.env.PUBLIC_URL}/images/highlights/18-3.jpg`,
    caption: 'Justice for 30000+ Iranian',
    subcaption: '18 / Jan / 2026',
  },
  {
    image: `${process.env.PUBLIC_URL}/images/highlights/18-2.jpg`,
    caption: '',
    subcaption: '',
  },
  {
    image: `${process.env.PUBLIC_URL}/images/highlights/18-1.jpg`,
    caption: '',
    subcaption: '',
  },
  {
    image: `${process.env.PUBLIC_URL}/images/highlights/18-5.png`,
    caption: '',
    subcaption: '',
  },
];

function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 8000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToSlide = (direction) => {
    setActiveSlide((prev) => (prev + direction + totalSlides) % totalSlides);
  };

  const heroHeight = useMemo(() => 'min-h-[calc(100vh-6rem)]', []);

  return (
    <div className="space-y-32 pb-20">
      {/* Hero Carousel */}
      <section className={`relative ${heroHeight} w-full overflow-hidden rounded-b-[2.5rem] bg-night shadow-2xl shadow-black/50`}>
        <div className="absolute inset-0 background-grid opacity-30" aria-hidden />
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[activeSlide].image}
            src={slides[activeSlide].image}
            alt="Rise For Iran highlight"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" aria-hidden />

        <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pb-16 pt-24 text-center text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-white/70">Rise For Iran</p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-6xl lg:text-7xl">
              {slides[activeSlide].caption || 'Justice. Unity. Freedom.'}
            </h1>
            {slides[activeSlide].subcaption && (
              <p className="mt-4 text-lg text-white/80 sm:text-2xl">{slides[activeSlide].subcaption}</p>
            )}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/Events" className="pill-button pill-button--primary">
                Explore Events
              </Link>
              <Link to="/Posters" className="pill-button pill-button--secondary">
                View Posters
              </Link>
            </div>
          </motion.div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => goToSlide(-1)}
              className="rounded-full border border-white/30 p-3 text-white transition hover:bg-white/20"
              aria-label="Previous slide"
            >
              ‹
            </button>
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 w-8 rounded-full ${idx === activeSlide ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
            <button
              onClick={() => goToSlide(1)}
              className="rounded-full border border-white/30 p-3 text-white transition hover:bg-white/20"
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="px-4">
        <div className="glass-card mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10 text-center text-night">
          <div>
            <p className="text-lg uppercase tracking-[0.5em] text-primary">Melbourne, Victoria, Australia</p>
            <h2 className="mt-4 text-3xl font-bold text-night">We'd love to hear from you</h2>
            <p className="mt-2 text-night/80">
              Thank you for your interest in Rise For Iran. Together, we can make a difference!
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <a
              href="mailto:riseforiran@gmail.com?subject=Website%20Inquiry%20from%20User"
              className="pill-button pill-button--secondary w-full max-w-xs justify-center"
            >
              Send a message
            </a>
            <Link to="/Contact" className="pill-button pill-button--primary w-full max-w-xs justify-center">
              Contact page
            </Link>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="flex flex-col items-center gap-8 text-center">
        <h3 className="text-3xl font-bold text-white">Connect with us</h3>
        <div className="flex items-center gap-8 text-white">
          <a
            href="https://www.instagram.com/rise_for_iran/?igsh=OWgybzdpenl6OTUx&utm_source=qr#"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/30 p-4 transition hover:bg-white/10"
            title="Instagram"
          >
            <FaInstagram className="text-3xl" />
          </a>
          <a
            href="https://t.me/riseforiran"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/30 p-4 transition hover:bg-white/10"
            title="Telegram"
          >
            <FaTelegramPlane className="text-3xl" />
          </a>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white">
          <h4 className="text-2xl font-semibold">Disclaimer</h4>
          <p className="mt-4 text-base text-white/80">
            Rise For Iran is an independent organisation with no affiliation to any political party or government. All views
            expressed on this website represent the organisation alone and should not be interpreted as the position of any
            other group or entity.
          </p>
          <p className="mt-8 text-sm text-white/50">© 2026 Rise For Iran — All rights reserved.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;