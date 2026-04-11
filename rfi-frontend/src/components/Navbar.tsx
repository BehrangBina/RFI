import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../config/api';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Posters', href: '/posters' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'News', href: '/news' },
  { label: 'Training', href: '/training' },
  { label: 'Membership', href: '/membership' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' }
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();

  return (
    <nav className="bg-[#00AEB2]/95 fixed inset-x-0 top-0 z-50 shadow-md backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-semibold text-white transition-transform hover:scale-105" 
            aria-label="Home"
          >
            <img 
              src={`${API_BASE_URL}/images/favicon.svg`}
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
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex lg:flex-row lg:items-center lg:gap-6 font-semibold text-white">
            {links.map(link => (
              <li key={link.label} className="relative group">
                <Link
                  to={link.href}
                  className="relative transition-all duration-300 hover:text-slate-100 hover:tracking-wider hover:scale-110 inline-block"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
            <li className="relative group">
              <Link
                to="/cart"
                className="relative transition-all duration-300 hover:text-slate-100 hover:scale-125 inline-block"
                title="Shopping Cart"
              >
                <i className="fa-solid fa-shopping-cart fa-xl" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cart.totalItems > 9 ? '9+' : cart.totalItems}
                  </span>
                )}
              </Link>
            </li>
            <li className="relative group">
              <a
                href="https://www.instagram.com/rise_for_iran/?igsh=OWgybzdpenl6OTUx&utm_source=qr#"
                className="transition-all duration-300 hover:text-slate-100 hover:scale-125 inline-block hover:rotate-12"
                title="Instagram"
              >
                <i className="fa-brands fa-instagram fa-xl" />
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        <ul
          className={[
            'lg:hidden flex flex-col gap-3 font-semibold text-white bg-[#00AEB2] rounded-lg mt-4 p-4 shadow-lg',
            open ? 'block' : 'hidden'
          ].join(' ')}
        >
          {links.map(link => (
            <li key={link.label} className="border-b border-white/20 last:border-b-0 pb-3 last:pb-0">
              <Link
                to={link.href}
                className="block py-2 px-3 rounded-md transition-all duration-300 hover:bg-white/10 hover:pl-5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {/* Cart and Instagram Icons */}
          <li className="flex gap-6 pt-3 border-t border-white/30">
            <Link
              to="/cart"
              className="relative transition-all duration-300 hover:scale-110 inline-flex items-center gap-2"
              onClick={() => setOpen(false)}
              title="Shopping Cart"
            >
              <i className="fa-solid fa-shopping-cart fa-xl" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cart.totalItems > 9 ? '9+' : cart.totalItems}
                </span>
              )}
            </Link>
            <a
              href="https://www.instagram.com/rise_for_iran/?igsh=OWgybzdpenl6OTUx&utm_source=qr#"
              className="transition-all duration-300 hover:scale-110 inline-block"
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
