import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbycnadV-zgUSe1cBrNuXwV3lNgJ81DOMvB-7uIO06290oyVJWXVc-rQWjNnPeeG7jmx/exec';

const STATE_LIST = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman & Nicobar Islands', 'Chandigarh', 'Delhi (NCT)', 
  'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Other country'
];

const DOMAIN_OPTIONS = [
  'Data Science & AI', 'Web Development', 'UI/UX Design', 'Digital Marketing', 
  'Business Analytics', 'Cloud Computing', 'Cybersecurity', 'Finance & FinTech', 
  'HR & Management', 'Content & Media', 'Machine Learning', 'Product Management'
];

const LANG_OPTIONS = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi'];

const ApplicationForm = () => {
  const [step, setStep] = useState(0); // 0, 1, 2, 3 (Review), 4 (Success)
  const [toastMsg, setToastMsg] = useState({ text: '', show: false });
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    collegeEmail: '',
    personalEmail: '',
    state: '',
    college: '',
    branch: '',
    year: '',
    crContact: '',
    domain: '',
    langs: [],
    consent: false
  });

  const triggerToast = (msg) => {
    setToastMsg({ text: msg, show: true });
    setTimeout(() => {
      setToastMsg({ text: msg, show: false });
    }, 2800);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'lang') {
        let newLangs = [...formData.langs];
        if (checked) newLangs.push(value);
        else newLangs = newLangs.filter(l => l !== value);
        setFormData({ ...formData, langs: newLangs });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else if (type === 'radio') {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validation
  const validateStep = (s) => {
    if (s === 0) {
      if (!formData.fullName.trim()) return failStep('full name');
      if (!formData.phone.trim()) return failStep('phone number');
      if (!formData.whatsapp.trim()) return failStep('WhatsApp number');
      if (!formData.collegeEmail.trim()) return failStep('college email');
      if (!formData.personalEmail.trim()) return failStep('personal email');
      if (!formData.state) return failStep('state');
    }
    if (s === 1) {
      if (!formData.college.trim()) return failStep('college name');
      if (!formData.branch.trim()) return failStep('branch / stream');
      if (!formData.year) return failStep('year of study');
    }
    if (s === 2) {
      if (!formData.domain) { triggerToast('Select one domain.'); return false; }
    }
    if (s === 3) {
      if (formData.langs.length === 0) { triggerToast('Select at least one language.'); return false; }
    }
    return true;
  };

  const failStep = (label) => {
    triggerToast(`Please enter your ${label}.`);
    return false;
  };

  const goNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setTimeout(() => { document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
    }
  };

  const goPrev = () => {
    setStep(step - 1);
    setTimeout(() => { document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  };

  const launchConfetti = () => {
    const cols = ['#FA0F00', '#FF6B35', '#FFD166', '#00CFFF', '#C4B5FD', '#fff', '#00FF9D'];
    for (let i = 0; i < 80; i++) {
        const el = document.createElement('div');
        const s = Math.random() * 10 + 4;
        Object.assign(el.style, {
            position: 'fixed',
            width: s + 'px',
            height: s + 'px',
            background: cols[Math.floor(Math.random() * cols.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            left: Math.random() * 100 + 'vw',
            top: '-12px',
            zIndex: '9999',
            pointerEvents: 'none',
            animation: `cfall ${1.6 + Math.random() * 2.4}s ${Math.random() * 0.7}s ease-in forwards`
        });
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 5000);
    }
  };

  const doSubmit = async () => {
    if (!formData.consent) {
      triggerToast('Please confirm your details by ticking the box.');
      return;
    }

    setSubmitting(true);
    
    // Format data for the backend payload that we built earlier
    const payload = {
      studentName: formData.fullName,
      studentEmail: formData.collegeEmail,
      personalEmail: formData.personalEmail,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      collegeName: formData.college,
      branchName: formData.branch,
      yearOfStudy: formData.year,
      domain: formData.domain,
      languages: formData.langs,
      collegeState: formData.state,
      crContact: formData.crContact,
      chargesAgreed: formData.consent
    };

    try {
      const response = await axios.post(BACKEND_URL, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        }
      });
      if (response.data.success) {
        setStep(5);
        launchConfetti();
      } else {
        triggerToast('Failed to submit application. Try again.');
      }
    } catch (error) {
      triggerToast('Server Connection Failed. Is backend running?');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <div className={`toast-msg ${toastMsg.show ? 'show' : 'hide'}`}>
        {toastMsg.text}
      </div>

      <div className="stepper-area">
        <div className="stepper" id="stepper">
          {[0, 1, 2, 3, 4].map(st => (
            <div key={st} className={`step ${step > st || step === 5 ? 'completed' : ''} ${step === st ? 'active' : ''}`}>
              <div className="step-dot">{st + 1}</div>
              <span className="step-lbl">
                  {st === 0 && 'Personal'}
                  {st === 1 && 'Academic'}
                  {st === 2 && 'Domain'}
                  {st === 3 && 'Language'}
                  {st === 4 && 'Submit'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-card">
        <div className="card-inner">
          <div className="prog-rail">
            <div className="prog-fill" style={{ width: step === 5 ? '100%' : `${['20%', '40%', '60%', '80%', '100%'][step]}` }}></div>
          </div>

          {step === 0 && (
            <div className="panel active">
              <div className="panel-num">Step 01 of 05</div>
              <div className="panel-title">Personal Details</div>
              <div className="panel-sub">Let's start with the basics so we can personalise your journey.</div>
              <div className="fgrid">
                <div className="field"><label>Full Name <span className="req">*</span></label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Priya Sharma" />
                </div>
                <div className="fgrid fg2">
                  <div className="field"><label>Phone Number <span className="req">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                  </div>
                  <div className="field"><label>WhatsApp Number <span className="req">*</span></label>
                    <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="Same as phone" />
                  </div>
                </div>
                <div className="fgrid fg2">
                  <div className="field"><label>College Email <span className="req">*</span></label>
                    <input type="email" name="collegeEmail" value={formData.collegeEmail} onChange={handleChange} placeholder="you@college.edu" />
                  </div>
                  <div className="field"><label>Personal Email <span className="req">*</span></label>
                    <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} placeholder="you@gmail.com" />
                  </div>
                </div>
                <div className="field"><label>State / Region <span className="req">*</span></label>
                  <select name="state" value={formData.state} onChange={handleChange}>
                    <option value="">— Select your state —</option>
                    {STATE_LIST.map(st => <option key={st}>{st}</option>)}
                  </select>
                </div>
              </div>
              <div className="nav-row"><span></span><button className="btn btn-next" onClick={goNext}>Continue &nbsp;→</button></div>
            </div>
          )}

          {step === 1 && (
            <div className="panel active">
              <div className="panel-num">Step 02 of 05</div>
              <div className="panel-title">Academic Background</div>
              <div className="panel-sub">Help us understand your educational context and year of study.</div>
              <div className="fgrid">
                <div className="field"><label>College / University Name <span className="req">*</span></label>
                  <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="e.g. RV College of Engineering, Bengaluru" />
                </div>
                <div className="fgrid fg2">
                  <div className="field"><label>Branch / Stream <span className="req">*</span></label>
                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. Computer Science" />
                  </div>
                  <div className="field"><label>Year of Study <span className="req">*</span></label>
                    <select name="year" value={formData.year} onChange={handleChange}>
                      <option value="">— Select year —</option>
                      {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Semester', 'Graduated'].map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div className="or-div">Optional</div>
                <div className="field"><label>Class Representative Contact</label>
                  <input type="text" name="crContact" value={formData.crContact} onChange={handleChange} placeholder="CR name & phone number (optional)" />
                </div>
              </div>
              <div className="nav-row"><button className="btn btn-back" onClick={goPrev}>← Back</button><button className="btn btn-next" onClick={goNext}>Continue &nbsp;→</button></div>
            </div>
          )}

          {step === 2 && (
            <div className="panel active">
              <div className="panel-num">Step 03 of 05</div>
              <div className="panel-title">Industry Domain</div>
              <div className="panel-sub">Select the primary domain you wish to upskill and gain experience in.</div>
              <div className="fgrid">
                <div className="field">
                  <label style={{fontSize: '13px', marginBottom: '8px'}}>Domain to Upskill In <span className="req">*</span></label>
                  <div className="cb-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px'}}>
                    {DOMAIN_OPTIONS.map(d => (
                       <label key={d} className="cb-item" style={{padding: '8px 0'}}>
                         <input type="radio" name="domain" value={d} checked={formData.domain === d} onChange={handleChange} />
                         <span className="cb-box" style={{width: '24px', height: '24px'}}></span>
                         <span className="cb-lbl-lg" style={{fontSize: '1.15rem', paddingLeft: '8px'}}>{d}</span>
                       </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="nav-row"><button className="btn btn-back" onClick={goPrev}>← Back</button><button className="btn btn-next" onClick={goNext}>Continue &nbsp;→</button></div>
            </div>
          )}

          {step === 3 && (
            <div className="panel active">
              <div className="panel-num">Step 04 of 05</div>
              <div className="panel-title">Preferred Language(s)</div>
              <div className="panel-sub">Select your training language(s) for the best mentorship experience.</div>
              <div className="fgrid">
                <div className="field"><label>Language(s) <span className="req">*</span></label>
                  <div className="cb-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px'}}>
                    {LANG_OPTIONS.map(l => (
                       <label key={l} className="cb-item" style={{padding: '8px 0'}}>
                         <input type="checkbox" name="lang" value={l} checked={formData.langs.includes(l)} onChange={handleChange} />
                         <span className="cb-box" style={{width: '24px', height: '24px'}}></span>
                         <span className="cb-lbl-lg" style={{fontSize: '1.25rem', paddingLeft: '8px'}}>{l}</span>
                       </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="nav-row"><button className="btn btn-back" onClick={goPrev}>← Back</button><button className="btn btn-next" onClick={goNext}>Continue &nbsp;→</button></div>
            </div>
          )}

          {step === 4 && (
            <div className="panel active">
              <div className="panel-num">Step 05 of 05</div>
              <div className="panel-title">Review & Submit</div>
              <div className="panel-sub">Almost there — confirm your details and secure your seat for the 2026 cohort.</div>
              <div className="review-box" id="review-box">
                  <div className="rrow"><span className="rkey">Name</span><span className="rval">{formData.fullName}</span></div>
                  <div className="rrow"><span className="rkey">Phone</span><span className="rval">{formData.phone}</span></div>
                  <div className="rrow"><span className="rkey">Email</span><span className="rval">{formData.personalEmail}</span></div>
                  <div className="rrow"><span className="rkey">College</span><span className="rval">{formData.college}</span></div>
                  <div className="rrow"><span className="rkey">Branch</span><span className="rval">{formData.branch} (- {formData.year})</span></div>
                  <div className="rrow"><span className="rkey">Domain</span><span className="rval">{formData.domain}</span></div>
                  <div className="rrow"><span className="rkey">Lang(s)</span><span className="rval">{formData.langs.join(', ')}</span></div>
              </div>
              <div className="cert-row">
                <div className="cert-ico">🎓</div>
                <div className="cert-info"><h4>Adobe Co-Branded Certificate Included</h4><p>Verifiable at krutanic.com/verify · Recognised by 50+ MNC hiring partners · Global Adobe branding on credential</p></div>
              </div>
              <div className="consent-row">
                <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} />
                <p>I confirm all details are accurate and understand that a nominal program fee applies for SETIP 2026. I agree to be contacted by Krutanic Solutions via WhatsApp & email.</p>
              </div>
              <div className="nav-row">
                <button className="btn btn-back" onClick={goPrev} disabled={submitting}>← Back</button>
                <button className="btn btn-submit" onClick={doSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : '🚀 Submit Application — Secure My Seat'}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div id="success-screen" style={{ display: 'block' }}>
              <div className="success-ring">🎉</div>
              <div className="success-title">Application Received!</div>
              <div className="success-sub">Welcome to the 2026 cohort! Our team will reach out within 24–48 hours via WhatsApp and email with next steps.</div>
              <div className="success-tags">
                <div className="stag">✓ <b>Adobe Co-Cert</b> Included</div>
                <div className="stag">✓ <b>Mentor</b> Assigned</div>
                <div class="stag">✓ <b>Placement</b> Support</div>
                <div className="stag">✓ <b>LoR</b> on Performance</div>
              </div>
              <div className="success-contact">Questions? Contact <strong>Dr. Mandeep Singh</strong> — Placements Controller<br/>📞 +91 8105954318 &nbsp;·&nbsp; ✉ info@krutanic.org</div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ApplicationForm;
