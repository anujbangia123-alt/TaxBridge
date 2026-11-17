import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import VideoSection from '../components/VideoSection';
import ResourceSection from '../components/ResourceSection';
import KnowledgeBase from '../components/KnowledgeBase';
import FAQSection from '../components/FAQSection';
import { Toaster } from '../components/ui/toaster';
import './HomePage.css';

const HomePage = () => {
  useEffect(() => {
    // Stamp animation
    const stamp = document.getElementById('stamp');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stamp.classList.add('show');
          }
        });
      },
      { threshold: 0.5 }
    );

    if (stamp) {
      observer.observe(stamp);
    }

    // Cleanup
    return () => {
      if (stamp) {
        observer.unobserve(stamp);
      }
    };
  }, []);

  return (
    <div className="home-page">
      <Header />
      <Hero />
      
      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-head">
          <h2>About this desk</h2>
          <div className="section-num">01 / Background</div>
        </div>
        <div className="about-grid">
          <div>
            <p>
              My work runs through the same filings listed here — drafting transfer pricing
              documentation, preparing Form 3CEB accountant's reports, and handling the
              certification non-resident clients need to claim treaty relief under Form 41 and
              Form 10F.
            </p>
            <p>
              Each of these has a specific, technical shape — a benchmarking method that has to
              be defensible, a report format the tax portal expects exactly, a certificate that
              has to match what the treaty actually allows. That's the level this is handled at:
              precise, checked, and explained back to you in plain terms.
            </p>
          </div>
          <div className="credential-card">
            <h3>On file</h3>
            <ul className="credential-list">
              <li>
                Focus areas <span>Transfer Pricing · International Tax</span>
              </li>
              <li>
                Filings handled <span>Form 3CEB, Form 41, Form 10F</span>
              </li>
              <li>
                Working knowledge <span>Income Tax Act, 2025</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-head">
          <h2>Services on the desk</h2>
          <div className="section-num">02 / Case Files</div>
        </div>

        <ServiceIndex />

        <ServiceCard
          id="service-tp"
          fileId="FILE / TPS"
          title="Transfer Pricing Study"
          description1="This is the documentation behind the numbers — required wherever an entity transacts with a related party across borders (or, in specified cases, within India). It establishes that the price charged between associated enterprises is what unrelated parties would have charged each other, and it's the evidence a tax authority will ask for first if a transaction is questioned."
          description2="The study covers a functional analysis of what each party actually does, bears, and owns; selection and testing of comparable companies; and a benchmarking report that arrives at an arm's-length range. Every comparable chosen is explained, not just listed — so the reasoning holds up if it's ever challenged."
          fields={[
            { label: 'Applies to', value: 'Entities with related-party cross-border transactions' },
            { label: 'Deliverables', value: 'FAR analysis, benchmarking study, TP report' },
            { label: 'Turnaround', value: '10–15 working days' },
            { label: 'Starts at', value: 'On request, scoped to transaction volume' }
          ]}
        />

        <ServiceCard
          id="service-3ceb"
          fileId="FILE / 3CEB"
          title="Form 3CEB Filing"
          description1="Form 3CEB is the accountant's report that formally reports international and specified domestic transactions to the tax department, built on top of the transfer pricing study. It's a mandatory filing wherever those transactions cross the applicable threshold, filed separately from the income tax return but due alongside it."
          description2="This covers preparing the form itself — transaction-wise disclosure, method applied, and arm's-length price for each category — and e-filing it on the income tax portal, so the study and the formal report line up exactly."
          fields={[
            { label: 'Applies to', value: 'Entities required to report under Section 92E' },
            { label: 'Deliverables', value: 'Form 3CEB preparation and e-filing' },
            { label: 'Turnaround', value: '3–5 working days (after TP study)' },
            { label: 'Starts at', value: 'On request, per entity' }
          ]}
        />

        <ServiceCard
          id="service-form41"
          fileId="FILE / 41-10F"
          title="Form 41 & Form 10F Filing"
          description1="When a non-resident earns income from India and wants to be taxed at the lower rate their country's tax treaty allows — instead of the higher domestic rate — they need to back that claim with the right paperwork. That's what Form 41 and Form 10F do, alongside a Tax Residency Certificate from their home country."
          description2="This covers the transition from the older Form 10F to Form 41 under the Income Tax Act, 2025, so the correct form is filed depending on which regime applies, plus review of the TRC to confirm it supports the treaty claim being made."
          fields={[
            { label: 'Applies to', value: 'Non-resident payees claiming DTAA relief' },
            { label: 'Deliverables', value: 'Form 41/10F preparation, e-filing, TRC review' },
            { label: 'Turnaround', value: '3–5 working days' },
            { label: 'Starts at', value: 'On request, per certificate' }
          ]}
        />
      </section>

      {/* Process Section */}
      <section id="process" className="process-section">
        <div className="section-head">
          <h2>How a file moves</h2>
          <div className="section-num">03 / Process</div>
        </div>
        <div className="process-list">
          <ProcessStep
            title="Consultation"
            description="A short call or message thread to understand the transaction, entity, or return in question, and confirm which filing applies."
          />
          <ProcessStep
            title="Document collection"
            description="A clear checklist of what's needed — financials, agreements, prior filings — so nothing holds up preparation later."
          />
          <ProcessStep
            title="Preparation"
            description="The study, form, or return is drafted, with working notes kept so every position taken can be explained if questioned."
          />
          <ProcessStep
            title="Review & sign-off"
            description="You review the draft before anything is filed. Changes are made until it's right, not just done."
          />
          <ProcessStep
            title="Filing & acknowledgment"
            description="Submission on the relevant portal, with the acknowledgment and working file handed over for your records."
          />
        </div>

        <div className="stamp-wrap">
          <div className="stamp" id="stamp">
            Reviewed
            <br />& Filed
          </div>
        </div>
      </section>

      <WhoWeServe />
      <Testimonials />
      <BlogSection />
      <VideoSection />
      <ResourceSection />
      <KnowledgeBase />
      <FAQSection />

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-head">
          <h2>Open a file</h2>
          <div className="section-num">10 / Contact</div>
        </div>
        <div className="contact-grid">
          <div>
            <p className="contact-note">
              Fill this in with what you need filed, and I'll follow up with scope and timing
              before anything is billed.
            </p>
            <ul className="contact-list">
              <li>
                <span>Email</span>
                <span>anujbangia123@gmail.com</span>
              </li>
              <li>
                <span>Phone</span>
                <span>+91 70825 47822</span>
              </li>
              <li>
                <span>LinkedIn</span>
                <span>
                  <a href="https://www.linkedin.com/in/anujbangia" target="_blank" rel="noopener noreferrer">
                    linkedin.com/in/anujbangia
                  </a>
                </span>
              </li>
              <li>
                <span>Based in</span>
                <span>India — filings handled remotely</span>
              </li>
              <li>
                <span>Hours</span>
                <span>Mon–Sat, 10:00–19:00 IST</span>
              </li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">TaxBridge Advisory</div>
            <p>Transfer pricing and international tax filings, handled remotely across India.</p>
          </div>
          <div>
            <h5>Filings</h5>
            <a href="#service-tp">TP Study</a>
            <a href="#service-3ceb">Form 3CEB</a>
            <a href="#service-form41">Form 41 / 10F</a>
          </div>
          <div>
            <h5>Contact</h5>
            <a href="mailto:anujbangia123@gmail.com">anujbangia123@gmail.com</a>
            <a href="tel:+917082547822">+91 70825 47822</a>
          </div>
        </div>
        <p className="footer-disclaimer">
          The content on this website is for general information only and is not an advertisement or
          solicitation of professional services, nor tax advice. Terms of any engagement are set out
          in the written engagement letter for that matter.
        </p>
        <p className="footer-copy">© {new Date().getFullYear()} TaxBridge Advisory. All rights reserved.</p>
      </footer>

      <Toaster />
    </div>
  );
};

const POINTS = {
  'service-tp': ['Functional analysis (FAR)', 'Comparable selection & benchmarking', 'Arm\'s-length range & TP report'],
  'service-3ceb': ['Transaction-wise disclosure', 'Method & arm\'s-length price per category', 'E-filing on the income tax portal'],
  'service-form41': ['Correct form for the applicable regime', 'Tax Residency Certificate review', 'Preparation & e-filing']
};

const ServiceIndex = () => (
  <div className="svc-index">
    {[['I', 'Transfer Pricing Study', 'Documentation & benchmarking', '#service-tp'],
      ['II', 'Form 3CEB Filing', 'Accountant\'s report, e-filed', '#service-3ceb'],
      ['III', 'Form 41 & 10F', 'Treaty relief for non-residents', '#service-form41']].map(([n, t, d, h]) => (
      <a key={n} href={h} className="svc-index-item">
        <span className="svc-index-num">{n}</span>
        <strong>{t}</strong>
        <span>{d}</span>
      </a>
    ))}
  </div>
);

const WhoWeServe = () => (
  <section id="who" className="who-section">
    <div className="section-head">
      <h2>Who this is for</h2>
      <div className="section-num">Clients</div>
    </div>
    <div className="who-grid">
      {[['i.', 'Indian subsidiaries of foreign groups', 'Inbound related-party transactions.', ['Section 92E', 'Form 3CEB', 'TP study']],
        ['ii.', 'Indian groups with overseas entities', 'Outbound transactions, reported cleanly.', ['Benchmarking', 'Form 3CEB']],
        ['iii.', 'Non-residents earning from India', 'Treaty relief, with the paperwork to back it.', ['DTAA', 'Form 41 / 10F', 'TRC']]].map(([n, t, d, tags]) => (
        <div key={n} className="who-card">
          <span className="who-num">{n}</span>
          <h3>{t}</h3>
          <p>{d}</p>
          <div className="who-tags">{tags.map((x) => <span key={x}>{x}</span>)}</div>
        </div>
      ))}
    </div>
    <a href="#contact" className="case-cta">Not sure where you fit? Send the details →</a>
  </section>
);

// Service Card Component
const ServiceCard = ({ id, fileId, title, description1, description2, fields }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={`case-file ${open ? 'open' : ''}`} id={id}>
      <div className="case-file-head" onClick={() => setOpen(!open)}>
        <div className="case-file-head-left">
          <span className="case-file-id">{fileId}</span>
          <h3>{title}</h3>
        </div>
        <span className="case-file-toggle">+</span>
      </div>
      <div className="case-file-body">
        <div className="case-file-inner">
          <div>
            <p>{description1}</p>
            <p>{description2}</p>
            <ul className="case-points">{(POINTS[id] || []).map((x) => <li key={x}>{x}</li>)}</ul>
            <a href="#contact" className="case-cta">Discuss this filing →</a>
          </div>
          <div>
            {fields.map((field, index) => (
              <div key={index} className="field-row">
                <span className="field-label">{field.label}</span>
                <span className="field-value">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Process Step Component
const ProcessStep = ({ title, description }) => (
  <div className="process-item">
    <div className="process-item-body">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    service: 'Transfer Pricing Study',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Request sent! I\'ll follow up by email shortly.');
    setFormData({ name: '', email: '', service: 'Transfer Pricing Study', message: '' });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="form-field">
        <label htmlFor="service">Service needed</label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
        >
          <option>Transfer Pricing Study</option>
          <option>Form 3CEB Filing</option>
          <option>Form 41 / 10F Filing</option>
          <option>Not sure — need guidance</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="message">Details</label>
        <textarea
          id="message"
          name="message"
          placeholder="Entity type, transaction, or return year..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Send request →
      </button>
    </form>
  );
};

export default HomePage;
