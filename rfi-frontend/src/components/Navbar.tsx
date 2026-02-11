import { useState } from 'react';
import { Link } from 'react-router-dom';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Posters', href: '/posters' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'News', href: '/news' },
  { label: 'Training', href: '/training' },
  { label: 'Contact', href: '/contact' }
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#46A2B9]/95 fixed inset-x-0 top-0 z-50 shadow-md backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-white transition-transform hover:scale-105" 
          aria-label="Home"
        >
          <img 
            src="http://localhost:5000/images/favicon.svg" 
            alt="Rise For Iran logo" 
            className="h-10 w-10 transition-transform hover:rotate-12" 
          />
          Rise For Iran
        </Link>

        <button
          type="button"
          className="text-white lg:hidden transition-transform hover:scale-110"
          aria-label="Toggle navigation"
          onClick={() => setOpen(v => !v)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <ul
          className={[
            'flex flex-col gap-4 font-semibold text-white lg:flex lg:flex-row lg:items-center lg:gap-6',
            open ? 'mt-4' : 'hidden lg:flex'
          ].join(' ')}
        >
          {links.map(link => (
            <li key={link.label} className="relative group">
              <Link
                to={link.href}
                className="relative transition-all duration-300 hover:text-slate-100 hover:tracking-wider hover:scale-110 inline-block"
                onClick={() => setOpen(false)}
              >
                {link.label}
                {/* Animated underline */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
          <li className="relative group">
            <a
              href="https://www.instagram.com/rise_for_iran/?igsh=OWgybzdpenl6OTUx&utm_source=qr#"
              className="transition-all duration-300 hover:text-slate-100 hover:scale-125 inline-block hover:rotate-12"
              title="Instagram"
              onClick={() => setOpen(false)}
            >
              <i className="fa-brands fa-instagram fa-xl" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
