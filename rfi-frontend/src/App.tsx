import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Posters from './pages/Posters';
import About from './pages/About';
import Events from './pages/Events';
import News from './pages/News';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-24 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posters" element={<Posters />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;