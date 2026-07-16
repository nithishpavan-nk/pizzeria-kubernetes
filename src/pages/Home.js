import React from 'react';
import { Link } from 'react-router-dom';
import BannerImage from '../assets/pizza.jpeg';
import '../styles/Home.css';

function Home() {
  return (
    <div className='home'>
      <div className='homeHero' style={{ backgroundImage: `url(${BannerImage})` }}>
        <div className="heroOverlay" />
        <div className='headerContainer'>
          <span className="eyebrow">Wood-fired &middot; Made fresh daily</span>
          <h1>Nithish Pizzeria</h1>
          <p>Pizza to fit any taste, fired in a real wood oven.</p>
          <Link to="/menu" className="orderLink">
            <button>See the menu</button>
          </Link>
        </div>
      </div>
      <div className="charred-edge" />

      <section className="homeHighlights">
        <div className="highlightCard">
          <h3>Stone-baked</h3>
          <p>Every base goes into a 450&deg;C wood oven for that proper char.</p>
        </div>
        <div className="highlightCard">
          <h3>Local ingredients</h3>
          <p>Fresh produce sourced daily, never frozen, never rushed.</p>
        </div>
        <div className="highlightCard">
          <h3>20-minute promise</h3>
          <p>From dough to doorstep, hot and on time, or it's on us.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
