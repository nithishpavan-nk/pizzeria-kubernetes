import React from 'react'
import MultiplePizzas from "../assets/multiplePizzas.jpeg";
import MakingPizza from "../assets/makingpizza.jpeg";
import '../styles/About.css';

function About() {
  return (
    <div className='about'>
      <div className='aboutTop' style={{ backgroundImage: `url(${MultiplePizzas})` }}>
        <div className="aboutTopOverlay" />
      </div>
      <div className="charred-edge" />

      <div className='aboutBottom'>
        <h1>Our Story</h1>
        <p>
          Nithish Pizzeria started with one wood-fired oven and a simple idea:
          pizza tastes better when nothing is rushed. We hand-stretch every
          base to order, char it at 450&deg;C, and top it with produce we pick
          up the same morning we use it.
        </p>
        <p>
          No shortcuts, no pre-made bases sitting in a freezer. Just dough,
          fire, and whatever's freshest that day &mdash; built by people who
          actually like making pizza.
        </p>

        <div className="aboutImageRow">
          <img src={MakingPizza} alt="Chef hand-stretching pizza dough" />
        </div>
      </div>
    </div>
  )
}

export default About
