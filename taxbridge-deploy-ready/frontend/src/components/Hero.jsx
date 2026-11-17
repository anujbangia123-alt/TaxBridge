import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="file-eyebrow">Transfer pricing & international tax</div>
      <h1>Three filings. One careful <em>desk.</em></h1>
      <p className="hero-sub">
        Transfer pricing documentation, Form 3CEB filing, and non-resident
        certification under Form 41 and Form 10F — prepared with the same
        discipline used on live client files.
      </p>
      <div className="hero-actions">
        <a href="#contact" className="btn btn-primary">
          Request a quote →
        </a>
        <a href="#services" className="btn btn-ghost">
          See what's covered
        </a>
      </div>

      <div className="hero-stats">
        <div><strong>10–15 days</strong><span>TP study</span></div>
        <div><strong>3–5 days</strong><span>Form 3CEB</span></div>
        <div><strong>3–5 days</strong><span>Form 41 / 10F</span></div>
      </div>
    </section>
  );
};

export default Hero;
