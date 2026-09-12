import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="file-eyebrow">Case File — Open for Review</div>
      <h1>Tax filings, done the way they're meant to be checked.</h1>
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

      <div className="tabs-strip">
        <a href="#service-tp" className="tab">
          TP Study
          <span>Transfer Pricing Documentation</span>
        </a>
        <a href="#service-3ceb" className="tab">
          Form 3CEB
          <span>Accountant's Report Filing</span>
        </a>
        <a href="#service-form41" className="tab">
          Form 41 / 10F
          <span>Non-Resident Filing</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
