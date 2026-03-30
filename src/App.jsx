import React, { useEffect, useState } from 'react';
import ApplicationForm from './components/ApplicationForm';

// Import images from assets
import certificateImg from './assets/krutanic certificate.jpeg';
import companiesImg from './assets/krutanic 1.jpeg';

function App() {
  const [geos, setGeos] = useState([]);

  useEffect(() => {
    // Generate floating geo shapes matching the provided script
    const shapes = [
      'border-radius:0',
      'border-radius:50%',
      'border-radius:3px',
      'clip-path:polygon(50% 0%,0% 100%,100% 100%)',
      'clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%)'
    ];
    const cols = [
      'rgba(250,15,0,',
      'rgba(255,180,0,',
      'rgba(0,180,255,',
      'rgba(160,0,255,',
      'rgba(0,255,180,'
    ];
    
    let generatedGeos = [];
    for(let i=0; i<32; i++){
      const s = Math.random() * 12 + 3;
      const ci = Math.floor(Math.random() * cols.length);
      const op = Math.random() * 0.45 + 0.1;
      const dur = Math.random() * 24 + 14;
      const delay = Math.random() * 30;
      
      const styleStr = `width:${s}px;height:${s}px;left:${Math.random()*100}vw;bottom:-20px;background:${cols[ci]}${op});${shapes[Math.floor(Math.random()*shapes.length)]};animation-duration:${dur}s;animation-delay:${delay}s;`;
      
      // convert string style to object for React
      const styleObj = {
        width: `${s}px`,
        height: `${s}px`,
        left: `${Math.random()*100}vw`,
        bottom: `-20px`,
        background: `${cols[ci]}${op})`,
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`
      };
      
      const shapeStr = shapes[Math.floor(Math.random()*shapes.length)];
      if (shapeStr.includes('border-radius')) {
        styleObj.borderRadius = shapeStr.split(':')[1];
      } else if (shapeStr.includes('clip-path')) {
        styleObj.clipPath = shapeStr.split(':')[1];
      }
      
      generatedGeos.push(styleObj);
    }
    setGeos(generatedGeos);
  }, []);

  return (
    <>
      <div id="bg-canvas">
        <div className="bg-deep"></div>
        <div className="stars"></div>
        <div className="aurora-1"></div>
        <div className="aurora-2"></div>
        <div className="aurora-3"></div>
        <div className="halo halo-1"></div>
        <div className="halo halo-2"></div>
        <div className="halo halo-3"></div>
        <div className="mesh-grid"></div>
        <div className="scanlines"></div>
        <div id="geos">
          {geos.map((style, i) => (
            <div key={i} className="geo" style={style}></div>
          ))}
        </div>
      </div>

      <header className="header">
        <div className="logo-row">
          <a href="/" style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="logo-chip cursor-pointer"><div className="adobe-tri"></div>Adobe</div>
          </a>
          <span className="x-sep">×</span>
          <a href="/" style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="logo-chip cursor-pointer">KRUTANIC</div>
          </a>
        </div>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          <div className="badge-live hide-mobile"><span className="live-dot"></span>2026 Applications Open</div>
          <button 
             className="nav-apply-btn"
             onClick={() => document.querySelector('.stepper-area').scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            Apply Now
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-tag"><span className="htag-dot"></span>Adobe Co-Certified · Placement Assured</div>
        <h1>Skill. Intern.<br/><em>Get Placed</em> at<br/><span className="gword">Top MNCs.</span></h1>
        <p className="hero-sub">A <strong>3-month structured program</strong> bridging academics and the workplace — live projects, industry mentors, Adobe-certified credentials, and placement at 50+ MNC partners.</p>
        <div className="stat-row">
          <div className="stat-chip"><b>3</b> Month Program</div>
          <div className="stat-chip"><b>50+</b> MNC Partners</div>
          <div className="stat-chip"><b>3</b> Certificates</div>
          <div className="stat-chip"><b>20+</b> Domains</div>
          <div className="stat-chip"><b>2026</b> Cohort</div>
        </div>

        <div className="image-grid">
          <div className="dark-image-card">
            <img src={certificateImg} alt="Adobe Krutanic Certificate" />
            <div className="img-caption">Adobe Co-Certified Program</div>
          </div>
          <div className="dark-image-card">
            <img src={companiesImg} alt="Corporate Associations & Partners" />
            <div className="img-caption">50+ MNC Hiring Partners</div>
          </div>
        </div>

        <div className="scroll-cue">↓ &nbsp; apply now — limited seats</div>
      </section>

      <ApplicationForm />

      <div className="footer">
        © 2026 Krutanic Solutions &nbsp;·&nbsp; <a href="mailto:info@krutanic.org">info@krutanic.org</a> &nbsp;·&nbsp; +91 8105954318 &nbsp;·&nbsp; <a href="https://www.krutanic.com" target="_blank" rel="noopener noreferrer">www.krutanic.com</a><br/>
        Dr. Mandeep Singh — Placements Controller
      </div>
    </>
  );
}

export default App;
