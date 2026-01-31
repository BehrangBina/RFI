import { useState } from 'react';
import { Link } from 'react-router-dom';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Posters', href: '/posters' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' }
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#46A2B9]/95 fixed inset-x-0 top-0 z-50 shadow-md backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold text-white" aria-label="Home">
          <img src="./images/sitelogo.svg" alt="Rise For Iran logo" className="h-10 w-10" />
          Rise For Iran
        </Link>

        <button
          type="button"
          className="text-white lg:hidden"
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
            <li key={link.label}>
              <Link
                to={link.href}
                className="transition hover:text-slate-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://www.instagram.com/rise_for_iran/?igsh=OWgybzdpenl6OTUx&utm_source=qr#"
              className="transition hover:text-slate-100"
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
