import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "http://3.27.72.201:5000/api/message";

function App() {
  const location = useLocation();
  const [serverMessage, setServerMessage] = useState(null);
  const [serverStatus, setServerStatus] = useState("idle"); // idle | ok | error

  useEffect(() => {
    let isMounted = true;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setServerMessage(data.message);
        setServerStatus("ok");
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Backend message unavailable:", err.message);
        setServerStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="App">
      <Navbar />

      {/* Subtle banner only renders if the backend actually has something to say */}
      {serverStatus === "ok" && serverMessage && (
        <div className="serverBanner">{serverMessage}</div>
      )}

      <main key={location.pathname} className="pageFade">
        <Routes location={location}>
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/order-confirmation/:orderId' element={<OrderConfirmation />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
