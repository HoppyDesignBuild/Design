import { useState, useRef } from "react";

const PROJECT_TYPES = ["Patio", "Deck", "Screened Porch", "Pergola", "Combined Patio + Pergola", "Multi-Level Outdoor Living"];
const SIZE_OPTIONS = ["Small (under 400 sq ft)", "Medium (400–700 sq ft)", "Large (700–1,200 sq ft)", "Estate (1,200+ sq ft)"];
const FEATURE_OPTIONS = ["Fire Pit / Fire Table", "Outdoor Kitchen / Grill Station", "Pergola / Shade Structure", "Retaining Wall", "Steps / Grade Change", "Landscape Lighting", "Built-in Seating", "Water Feature", "Outdoor TV / Entertainment"];
const PERGOLA_STYLES = ["Black Aluminum (modern)", "White Vinyl (classic)", "Natural Cedar (warm)", "Louvered / Adjustable Roof", "Not sure yet"];
const BUDGET_OPTIONS = ["$25K–$50K", "$50K–$100K", "$100K–$150K", "$150K+", "Not sure — show me options"];
const STYLE_OPTIONS = ["Modern / Minimalist", "Traditional / Classic", "Transitional", "Rustic / Natural", "Contemporary Luxury"];

const SIZE_BASE = {
  "Small (under 400 sq ft)": { low: 22000, mid: 32000, high: 45000 },
  "Medium (400–700 sq ft)": { low: 38000, mid: 58000, high: 80000 },
  "Large (700–1,200 sq ft)": { low: 65000, mid: 95000, high: 135000 },
  "Estate (1,200+ sq ft)": { low: 110000, mid: 155000, high: 220000 },
};
const FEATURE_ADDERS = {
  "Fire Pit / Fire Table": 6500, "Outdoor Kitchen / Grill Station": 18000,
  "Pergola / Shade Structure": 12000, "Retaining Wall": 9000,
  "Steps / Grade Change": 4500, "Landscape Lighting": 5500,
  "Built-in Seating": 3800, "Water Feature": 8500, "Outdoor TV / Entertainment": 4200,
};
const STYLE_MULT = { "Modern / Minimalist": 1.0, "Traditional / Classic": 1.0, "Transitional": 1.05, "Rustic / Natural": 0.95, "Contemporary Luxury": 1.2 };

const DESIGNS = {
  Patio: {
    "Modern / Minimalist": { concept: "The Clean Slate", tagline: "Crisp lines and open air — a patio designed to disappear into your lifestyle.", description: "Large-format porcelain or concrete pavers in a light stone tone create a seamless ground plane. Minimal edge detailing, flush step transitions, and disciplined planting beds keep the visual field uncluttered.", layout: "A single open entertaining zone anchors the rear of the home with a defined seating area and clear sightlines to the yard.", palette: ["#d4cfc8","#2c3035","#8a9a8a"] },
    "Contemporary Luxury": { concept: "The Obsidian Garden", tagline: "Dark drama, premium materials, and a space that feels like a five-star resort.", description: "Charcoal-toned large-format pavers paired with black steel accents and warm uplighting create a sophisticated nighttime atmosphere. Lush plantings frame the perimeter.", layout: "A primary entertaining zone surrounds a central fire feature with flanking lounge areas. A secondary dining zone sits closer to the home.", palette: ["#2a2a2a","#c8aa6e","#4a6a4a"] },
    "Traditional / Classic": { concept: "The Estate Terrace", tagline: "Timeless stone craftsmanship that feels like it's always been there.", description: "Tumbled bluestone in a classic ashlar pattern grounds the space in Old World character. Raised planter beds with stone caps and a central fire feature complete the composition.", layout: "A symmetrical layout with a centered focal point and balanced seating on either side.", palette: ["#b8a898","#4a3a2a","#6a8a6a"] },
    "Transitional": { concept: "The Refined Retreat", tagline: "Where clean design meets warm materials — built for how you actually live.", description: "Smooth concrete pavers in warm gray tones bridge modern form with traditional comfort. Subtle texture variation and natural wood accents add warmth without sacrificing sophistication.", layout: "An open central entertaining zone flows to a defined lounge area, adapting from quiet evenings to large gatherings.", palette: ["#c0b8a8","#3a4a3a","#8a7a6a"] },
    "Rustic / Natural": { concept: "The Garden Room", tagline: "Natural stone, organic edges, and a space that feels grown — not built.", description: "Irregular bluestone pavers with planted joints create an organic ground plane. Cedar accents and naturalistic planting masses reinforce the garden character.", layout: "Informal zones defined by planting rather than hard edges. A central gathering area opens to garden views.", palette: ["#a89878","#4a5a3a","#786858"] },
  },
  Deck: {
    "Modern / Minimalist": { concept: "The Floating Platform", tagline: "A deck that hovers between your home and your landscape — effortlessly.", description: "TimberTech composite in cool gray with hidden fasteners delivers a seamless surface. Cable railing keeps sightlines open and the deck reads as an architectural extension.", layout: "One primary level with a clean perimeter and integrated bench detailing. Steps cascade to grade in a single disciplined run.", palette: ["#b0b8c0","#2a3038","#6a8090"] },
    "Contemporary Luxury": { concept: "The Sky Lounge", tagline: "Glass rails, premium composite, and views worth designing around.", description: "Premium TimberTech Tigerwood composite with ViewRail glass panel railing creates a resort-caliber platform. LED deck lighting and custom built-ins complete the picture.", layout: "Multi-zone layout with dining adjacent to the home and a lounge zone with views. Built-in bench seating defines the perimeter.", palette: ["#c8aa6e","#1a2030","#a09080"] },
    "Traditional / Classic": { concept: "The Wraparound", tagline: "Classic proportions, painted rails, and the feeling of home.", description: "TimberTech Harvest Collection in warm cedar tone pairs with white-painted rail. Turned balusters and a defined post cap profile complete the traditional character.", layout: "Primary deck level with stairs on two sides for maximum flow. A defined seating zone anchors the far end.", palette: ["#c8a878","#f0ece4","#3a3028"] },
    "Transitional": { concept: "The Elevated Garden", tagline: "Composite performance meets warm design — a deck built for daily life.", description: "Mid-tone composite decking with aluminum balusters and a clean fascia profile. Integrated planters and cable rail sections balance traditional form with modern detailing.", layout: "Open central zone with defined dining near the house and a lounge zone toward the yard edge.", palette: ["#b8a890","#3a3830","#8a9888"] },
    "Rustic / Natural": { concept: "The Timber Frame", tagline: "Natural materials, warm grain, and a deck that ages like fine furniture.", description: "Ipe or cedar decking with a natural oil finish and steel cable railing delivers an organic, handcrafted character. Exposed timber framing reinforces the natural aesthetic.", layout: "A single-level deck with generous width and simple perimeter detailing. Focus on materiality and the view.", palette: ["#8a6840","#3a3028","#6a7860"] },
  },
};

const FALLBACK = { concept: "The Signature Outdoor Room", tagline: "A bespoke outdoor living space designed around the way your family lives.", description: "Premium materials selected for your style and site come together in a cohesive, well-proportioned design.", layout: "Defined functional zones for dining, lounging, and gathering flow naturally from the home's interior.", palette: ["#c8aa6e","#2a3040","#8a9888"] };

const MATERIALS = {
  "Modern / Minimalist": [
    { category: "Paving", recommendation: 'Porcelain tile or concrete paver, 24"×24"', note: "Clean joints and consistent tone" },
    { category: "Pergola / Shade", recommendation: "Black powder-coat aluminum pergola", note: "Slim profile, architectural feel" },
    { category: "Lighting", recommendation: "Flush-mount LED step lights + uplights", note: "Hidden source, dramatic effect" },
    { category: "Railing", recommendation: "Stainless cable rail or frameless glass", note: "Preserves sightlines completely" },
  ],
  "Contemporary Luxury": [
    { category: "Paving", recommendation: "Large-format Italian porcelain", note: "Premium surface, near-zero maintenance" },
    { category: "Pergola / Shade", recommendation: "Louvered aluminum pergola (Equinox)", note: "Year-round usability" },
    { category: "Lighting", recommendation: "Integral LED in posts, treads, ceiling", note: "Full-scene nighttime drama" },
    { category: "Railing", recommendation: "ViewRail glass panel system", note: "Unobstructed views, premium hardware" },
  ],
  "Traditional / Classic": [
    { category: "Paving", recommendation: "Tumbled bluestone or travertine", note: "Age-appropriate texture, classic feel" },
    { category: "Pergola / Shade", recommendation: "White vinyl or painted cedar pergola", note: "Matches most NoVA home trim" },
    { category: "Lighting", recommendation: "Post cap lights and step risers", note: "Warm brass tones" },
    { category: "Railing", recommendation: "Painted aluminum with turned balusters", note: "Classic silhouette, composite durability" },
  ],
  "Transitional": [
    { category: "Paving", recommendation: 'Smooth concrete paver, warm gray, 16"×16"', note: "Bridges modern and traditional" },
    { category: "Pergola / Shade", recommendation: "Natural cedar or composite timber pergola", note: "Warm tone, versatile" },
    { category: "Lighting", recommendation: "Path lights + adjustable spot uplights", note: "Functional and flexible" },
    { category: "Railing", recommendation: "Black aluminum with horizontal bar infill", note: "Modern pattern, traditional form" },
  ],
  "Rustic / Natural": [
    { category: "Paving", recommendation: "Irregular bluestone or fieldstone, tight-set", note: "Organic edge pattern" },
    { category: "Pergola / Shade", recommendation: "Rough-sawn cedar or Douglas fir pergola", note: "Ages beautifully" },
    { category: "Lighting", recommendation: "Low-voltage path lights + lantern fixtures", note: "Warm, soft glow" },
    { category: "Railing", recommendation: "Horizontal cedar rail with steel cable", note: "Natural material, modern detail" },
  ],
};

function buildDesign(inputs) {
  const base = SIZE_BASE[inputs.size] || SIZE_BASE["Medium (400–700 sq ft)"];
  const mult = STYLE_MULT[inputs.style] || 1.0;
  let add = 0; inputs.features.forEach(f => { add += FEATURE_ADDERS[f] || 0; });
  const low = Math.round((base.low + add * 0.7) * mult / 1000) * 1000;
  const mid = Math.round((base.mid + add) * mult / 1000) * 1000;
  const high = Math.round((base.high + add * 1.3) * mult / 1000) * 1000;
  const d = (DESIGNS[inputs.projectType] && DESIGNS[inputs.projectType][inputs.style]) ? DESIGNS[inputs.projectType][inputs.style] : FALLBACK;
  return { ...d, materials: MATERIALS[inputs.style] || MATERIALS["Transitional"],
    tiers: [
      { name: "Essential", price: low, desc: "Core scope with quality materials." },
      { name: "Signature", price: mid, desc: "Full features, premium upgrades. Most popular." },
      { name: "Premium", price: high, desc: "Top-tier materials, full lighting, every feature." },
    ]
  };
}

function buildPrompt(inputs, design) {
  const feats = inputs.features.length ? inputs.features.join(", ") : "outdoor seating area";
  return `Photorealistic architectural rendering of a luxury backyard ${inputs.projectType} for a home in McLean, Virginia. Design concept: "${design.concept}". Style: ${inputs.style}. Size: ${inputs.size}. Features: ${feats}${inputs.pergolaStyle && inputs.pergolaStyle !== "Not sure yet" ? `, ${inputs.pergolaStyle} pergola` : ""}. ${design.description} Shot from a wide elevated angle showing the full outdoor space with the home's rear facade. Warm golden hour evening lighting. Lush mature landscaping. Professional architectural photography, photorealistic, 8K quality. No text or watermarks.`;
}

const G = "#c8aa6e";
const fmt = n => "$" + Number(n).toLocaleString();

export default function Home() {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({ projectType:"", size:"", features:[], pergolaStyle:"", budget:"", style:"", notes:"", photoMode:"" });
  const [photo, setPhoto] = useState(null);
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [renderedImage, setRenderedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [lead, setLead] = useState({ name:"", email:"", phone:"" });
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const tog = f => setInputs(p => ({ ...p, features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f] }));

  const canNext = () => {
    if (step === 0) return !!inputs.projectType;
    if (step === 1) return !!inputs.size;
    if (step === 2) return !!inputs.budget && !!inputs.style;
    if (step === 3) return !!inputs.photoMode && (inputs.photoMode === "skip" || !!photo || address.length > 5);
    return false;
  };

  const handleFile = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    const r = buildDesign(inputs);
    setResult(r);
    setStep(4);
    setImageLoading(true);
    setImageError(null);
    try {
      const body = { prompt: buildPrompt(inputs, r) };
      if (photo) body.photoBase64 = photo;
      const res = await fetch("/api/generate-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRenderedImage(data.imageUrl);
    } catch(e) {
      setImageError("Rendering unavailable: " + e.message);
    } finally {
      setImageLoading(false);
    }
  };

  const lbl = t => <div style={{ fontSize:"10px", letterSpacing:"4px", color:G, textTransform:"uppercase", marginBottom:"12px" }}>{t}</div>;

  const sel = (active, onClick, text) => (
    <button onClick={onClick} style={{ padding:"14px 16px", background: active?"rgba(200,170,110,0.15)":"rgba(255,255,255,0.04)", border: active?`1px solid ${G}`:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", color: active?G:"#c0c8d0", cursor:"pointer", fontSize:"14px", textAlign:"left", fontFamily:"inherit", transition:"all 0.2s", width:"100%" }}>{text}</button>
  );

  const chip = (active, onClick, text) => (
    <button onClick={onClick} style={{ padding:"9px 15px", background: active?"rgba(200,170,110,0.2)":"rgba(255,255,255,0.04)", border: active?`1px solid ${G}`:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", color: active?G:"#a0a8b0", cursor:"pointer", fontSize:"13px", fontFamily:"inherit", transition:"all 0.2s" }}>{active?"✓ ":""}{text}</button>
  );

  const navBtn = (text, onClick, disabled) => (
    <button onClick={onClick} disabled={disabled} style={{ flex:1, padding:"15px", background: !disabled?`linear-gradient(135deg,${G},#a88840)`:"rgba(255,255,255,0.06)", border:"none", borderRadius:"8px", color: !disabled?"#0d1117":"#4a5a6a", cursor: !disabled?"pointer":"not-allowed", fontSize:"15px", fontWeight:"bold", fontFamily:"inherit", letterSpacing:"1px" }}>{text}</button>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0d1117 0%,#1a2332 60%,#0f1923 100%)", fontFamily:"Georgia,serif", color:"#e8dcc8" }}>

      <div style={{ borderBottom:"1px solid rgba(200,170,110,0.2)", padding:"18px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(0,0,0,0.3)" }}>
        <div>
          <div style={{ fontSize:"10px", letterSpacing:"4px", color:G, textTransform:"uppercase", marginBottom:"2px" }}>Hoppy Design & Build</div>
          <div style={{ fontSize:"18px", fontWeight:"bold", color:"#f0e6d0" }}>Free AI Design Studio</div>
        </div>
        <div style={{ fontSize:"10px", color:"#506070", letterSpacing:"2px", textTransform:"uppercase" }}>McLean, VA</div>
      </div>

      {step < 4 && (
        <div style={{ padding:"20px 28px 0", maxWidth:"600px", margin:"0 auto" }}>
          <div style={{ display:"flex", gap:"6px", marginBottom:"8px" }}>
            {[0,1,2,3].map(i => <div key={i} style={{ flex:1, height:"3px", background: i<step?G:i===step?"rgba(200,170,110,0.5)":"rgba(255,255,255,0.08)", borderRadius:"2px", transition:"background 0.3s" }} />)}
          </div>
          <div style={{ fontSize:"10px", color:"#607080", letterSpacing:"2px", textTransform:"uppercase" }}>
            Step {step+1} of 4 — {["Project Type","Size & Features","Style & Budget","Your Home"][step]}
          </div>
        </div>
      )}

      <div style={{ maxWidth:"600px", margin:"0 auto", padding:"28px" }}>

        {step === 0 && (
          <div>
            <h2 style={{ fontSize:"26px", color:"#f0e6d0", marginBottom:"6px" }}>What are you building?</h2>
            <p style={{ color:"#7a8a9a", marginBottom:"22px", fontSize:"14px" }}>Choose your outdoor living project type.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              {PROJECT_TYPES.map(t => sel(inputs.projectType===t, () => setInputs(p=>({...p,projectType:t})), t))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontSize:"26px", color:"#f0e6d0", marginBottom:"6px" }}>Size & Features</h2>
            <p style={{ color:"#7a8a9a", marginBottom:"22px", fontSize:"14px" }}>How big, and what do you want?</p>
            <div style={{ marginBottom:"26px" }}>
              {lbl("Approximate Size")}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {SIZE_OPTIONS.map(s => sel(inputs.size===s, () => setInputs(p=>({...p,size:s})), s))}
              </div>
            </div>
            <div style={{ marginBottom:"22px" }}>
              {lbl("Features")}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                {FEATURE_OPTIONS.map(f => chip(inputs.features.includes(f), () => tog(f), f))}
              </div>
            </div>
            {inputs.features.includes("Pergola / Shade Structure") && (
              <div>
                {lbl("Pergola Style")}
                <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                  {PERGOLA_STYLES.map(s => chip(inputs.pergolaStyle===s, () => setInputs(p=>({...p,pergolaStyle:s})), s))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize:"26px", color:"#f0e6d0", marginBottom:"6px" }}>Style & Investment</h2>
            <p style={{ color:"#7a8a9a", marginBottom:"22px", fontSize:"14px" }}>Your design direction and budget.</p>
            <div style={{ marginBottom:"26px" }}>
              {lbl("Design Style")}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {STYLE_OPTIONS.map(s => sel(inputs.style===s, () => setInputs(p=>({...p,style:s})), s))}
              </div>
            </div>
            <div style={{ marginBottom:"22px" }}>
              {lbl("Investment Range")}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {BUDGET_OPTIONS.map(b => sel(inputs.budget===b, () => setInputs(p=>({...p,budget:b})), b))}
              </div>
            </div>
            <div>
              {lbl("Anything Else? (optional)")}
              <textarea placeholder="e.g. we want privacy, dog-friendly, existing deck..." value={inputs.notes} onChange={e=>setInputs(p=>({...p,notes:e.target.value}))}
                style={{ width:"100%", padding:"12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", color:"#e8dcc8", fontSize:"14px", fontFamily:"inherit", resize:"vertical", minHeight:"70px", outline:"none", boxSizing:"border-box" }} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize:"26px", color:"#f0e6d0", marginBottom:"6px" }}>Your Home</h2>
            <p style={{ color:"#7a8a9a", marginBottom:"22px", fontSize:"14px" }}>A photo helps our AI render your space accurately.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"22px" }}>
              {[
                { key:"upload", label:"📷  Upload a photo of my backyard" },
                { key:"address", label:"🏠  Use my property address" },
                { key:"skip", label:"⟶  Skip — just show me the design" },
              ].map(opt => (
                <button key={opt.key} onClick={() => setInputs(p=>({...p,photoMode:opt.key}))} style={{ padding:"16px 18px", background: inputs.photoMode===opt.key?"rgba(200,170,110,0.12)":"rgba(255,255,255,0.04)", border: inputs.photoMode===opt.key?`1px solid ${G}`:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color: inputs.photoMode===opt.key?G:"#c0c8d0", cursor:"pointer", fontSize:"14px", textAlign:"left", fontFamily:"inherit", transition:"all 0.2s" }}>
                  {opt.label}
                </button>
              ))}
            </div>

            {inputs.photoMode === "upload" && (
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
                {!photo ? (
                  <div onClick={() => fileRef.current.click()} style={{ border:"2px dashed rgba(200,170,110,0.3)", borderRadius:"12px", padding:"40px", textAlign:"center", cursor:"pointer", background:"rgba(200,170,110,0.03)" }}>
                    <div style={{ fontSize:"32px", marginBottom:"10px" }}>📷</div>
                    <div style={{ color:G, fontSize:"14px", marginBottom:"4px" }}>Tap to upload your backyard photo</div>
                    <div style={{ color:"#506070", fontSize:"12px" }}>JPG, PNG, or HEIC</div>
                  </div>
                ) : (
                  <div style={{ position:"relative" }}>
                    <img src={photo} alt="backyard" style={{ width:"100%", borderRadius:"12px", border:`1px solid rgba(200,170,110,0.3)` }} />
                    <button onClick={() => setPhoto(null)} style={{ position:"absolute", top:"10px", right:"10px", background:"rgba(0,0,0,0.7)", border:"none", borderRadius:"50%", width:"28px", height:"28px", color:"#fff", cursor:"pointer", fontSize:"14px" }}>✕</button>
                  </div>
                )}
              </div>
            )}

            {inputs.photoMode === "address" && (
              <div>
                {lbl("Property Address")}
                <input placeholder="e.g. 1234 Elm Street, McLean, VA 22101" value={address} onChange={e=>setAddress(e.target.value)}
                  style={{ width:"100%", padding:"14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color:"#e8dcc8", fontSize:"14px", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
                <div style={{ marginTop:"10px", fontSize:"12px", color:"#506070", lineHeight:"1.6" }}>We'll use this address to find your home and generate a rendering based on typical McLean homes with similar architecture.</div>
              </div>
            )}

            {inputs.photoMode === "skip" && (
              <div style={{ padding:"14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", fontSize:"13px", color:"#7a8a9a" }}>
                We'll generate a rendering based on your style selections and a typical McLean home.
              </div>
            )}
          </div>
        )}

        {step < 4 && (
          <div style={{ marginTop:"30px", display:"flex", gap:"10px" }}>
            {step > 0 && (
              <button onClick={() => setStep(s=>s-1)} style={{ padding:"13px 22px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"8px", color:"#7a8a9a", cursor:"pointer", fontSize:"14px", fontFamily:"inherit" }}>Back</button>
            )}
            {step < 3 && navBtn("Continue →", () => setStep(s=>s+1), !canNext())}
            {step === 3 && navBtn("✦ Generate My Design", handleGenerate, !canNext())}
          </div>
        )}

        {step === 4 && result && (
          <div>
            {/* AI RENDERED IMAGE */}
            <div style={{ marginBottom:"22px" }}>
              {lbl("AI Rendering of Your Space")}
              {imageLoading && (
                <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"60px 20px", textAlign:"center" }}>
                  <div style={{ fontSize:"28px", marginBottom:"14px", animation:"spin 2s linear infinite" }}>⟳</div>
                  <div style={{ color:G, fontSize:"14px", marginBottom:"6px" }}>Rendering your space with AI...</div>
                  <div style={{ color:"#506070", fontSize:"12px" }}>This takes about 15–20 seconds</div>
                  <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
                </div>
              )}
              {renderedImage && !imageLoading && (
                <div>
                  <img src={renderedImage} alt="AI rendering" style={{ width:"100%", borderRadius:"12px", border:`1px solid rgba(200,170,110,0.3)` }} />
                  <div style={{ marginTop:"8px", fontSize:"11px", color:"#506070", fontStyle:"italic" }}>AI-generated visualization. Actual results may vary based on site conditions.</div>
                </div>
              )}
              {imageError && !imageLoading && (
                <div style={{ padding:"16px", background:"rgba(200,80,80,0.08)", border:"1px solid rgba(200,80,80,0.2)", borderRadius:"8px", fontSize:"13px", color:"#c07070" }}>{imageError}</div>
              )}
              {photo && !imageLoading && !renderedImage && !imageError && (
                <img src={photo} alt="your backyard" style={{ width:"100%", borderRadius:"12px", border:`1px solid rgba(200,170,110,0.2)` }} />
              )}
            </div>

            {/* CONCEPT */}
            <div style={{ background:"linear-gradient(135deg,rgba(200,170,110,0.12),rgba(200,170,110,0.04))", border:"1px solid rgba(200,170,110,0.25)", borderRadius:"14px", padding:"26px", marginBottom:"16px" }}>
              {lbl("Your Design Concept")}
              <h1 style={{ fontSize:"24px", fontWeight:"bold", color:"#f0e6d0", margin:"0 0 8px" }}>{result.concept}</h1>
              <p style={{ fontSize:"15px", color:"#b0bcc8", margin:"0 0 14px", fontStyle:"italic" }}>{result.tagline}</p>
              <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
                {result.palette.map((c,i) => <div key={i} style={{ width:"26px", height:"26px", borderRadius:"50%", background:c, border:"2px solid rgba(255,255,255,0.1)" }} />)}
              </div>
              <p style={{ fontSize:"14px", color:"#c0c8d0", lineHeight:"1.75", margin:0 }}>{result.description}</p>
            </div>

            {/* LAYOUT */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", padding:"20px", marginBottom:"14px" }}>
              {lbl("Layout & Zones")}
              <p style={{ fontSize:"14px", color:"#a0b0c0", lineHeight:"1.75", margin:0 }}>{result.layout}</p>
            </div>

            {/* MATERIALS */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", padding:"20px", marginBottom:"14px" }}>
              {lbl("Materials & Finishes")}
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {result.materials.map((m,i) => (
                  <div key={i} style={{ display:"flex", gap:"14px" }}>
                    <div style={{ minWidth:"100px", fontSize:"10px", letterSpacing:"2px", color:"#506070", textTransform:"uppercase", paddingTop:"2px" }}>{m.category}</div>
                    <div>
                      <div style={{ color:"#e0d0b8", fontSize:"14px", fontWeight:"bold", marginBottom:"2px" }}>{m.recommendation}</div>
                      <div style={{ color:"#6a7a8a", fontSize:"13px" }}>{m.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRICING */}
            <div style={{ marginBottom:"18px" }}>
              {lbl("Investment Tiers")}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
                {result.tiers.map((tier,i) => (
                  <div key={i} style={{ background: i===1?"rgba(200,170,110,0.1)":"rgba(255,255,255,0.03)", border: i===1?"1px solid rgba(200,170,110,0.4)":"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", padding:"16px 10px", textAlign:"center" }}>
                    {i===1 && <div style={{ fontSize:"8px", letterSpacing:"3px", color:G, textTransform:"uppercase", marginBottom:"6px" }}>Most Popular</div>}
                    <div style={{ fontSize:"11px", color:"#8090a0", marginBottom:"6px" }}>{tier.name}</div>
                    <div style={{ fontSize:"18px", fontWeight:"bold", color: i===1?G:"#d8c8a8", marginBottom:"6px" }}>{fmt(tier.price)}</div>
                    <div style={{ fontSize:"11px", color:"#506070", lineHeight:"1.5" }}>{tier.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:"11px", color:"#405060", marginTop:"8px", fontStyle:"italic" }}>Final pricing follows your free in-home design consultation.</div>
            </div>

            {/* CTA */}
            <div style={{ background:"linear-gradient(135deg,rgba(200,170,110,0.08),rgba(168,136,64,0.04))", border:"1px solid rgba(200,170,110,0.2)", borderRadius:"12px", padding:"24px", marginBottom:"16px" }}>
              {lbl("Schedule Your Free Consultation")}
              <p style={{ fontSize:"14px", color:"#a0b0c0", lineHeight:"1.7", margin:"0 0 16px" }}>
                We serve McLean and all of Northern Virginia. We'll visit your home, review this design, and deliver a fixed-price proposal — at no cost.
              </p>
              {!submitted ? (
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"8px" }}>
                    <input placeholder="Your name" value={lead.name} onChange={e=>setLead(p=>({...p,name:e.target.value}))} style={{ padding:"11px 12px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"7px", color:"#e8dcc8", fontSize:"14px", fontFamily:"inherit", outline:"none" }} />
                    <input placeholder="Phone" value={lead.phone} onChange={e=>setLead(p=>({...p,phone:e.target.value}))} style={{ padding:"11px 12px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"7px", color:"#e8dcc8", fontSize:"14px", fontFamily:"inherit", outline:"none" }} />
                  </div>
                  <input placeholder="Email address" value={lead.email} onChange={e=>setLead(p=>({...p,email:e.target.value}))} style={{ width:"100%", padding:"11px 12px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"7px", color:"#e8dcc8", fontSize:"14px", fontFamily:"inherit", outline:"none", boxSizing:"border-box", marginBottom:"10px" }} />
                  <button onClick={() => setSubmitted(true)} style={{ width:"100%", padding:"15px", background:`linear-gradient(135deg,${G},#a88840)`, border:"none", borderRadius:"8px", color:"#0d1117", fontSize:"15px", fontWeight:"bold", letterSpacing:"1px", cursor:"pointer", fontFamily:"inherit" }}>
                    Schedule My Free Consultation →
                  </button>
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:"12px" }}>
                  <div style={{ fontSize:"26px", marginBottom:"8px" }}>✦</div>
                  <div style={{ color:G, fontSize:"16px", fontWeight:"bold", marginBottom:"6px" }}>You're on our list{lead.name?", "+lead.name:""}.</div>
                  <div style={{ color:"#607080", fontSize:"13px" }}>We'll reach out within one business day.</div>
                </div>
              )}
            </div>

            <button onClick={() => { setStep(0); setResult(null); setRenderedImage(null); setInputs({ projectType:"",size:"",features:[],pergolaStyle:"",budget:"",style:"",notes:"",photoMode:"" }); setPhoto(null); setAddress(""); setSubmitted(false); }} style={{ width:"100%", padding:"13px", background:"transparent", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color:"#506070", cursor:"pointer", fontSize:"13px", fontFamily:"inherit" }}>
              Start Over
            </button>
          </div>
        )}
      </div>

      <div style={{ textAlign:"center", padding:"20px", borderTop:"1px solid rgba(255,255,255,0.05)", fontSize:"10px", color:"#384858", letterSpacing:"2px", textTransform:"uppercase" }}>
        Hoppy Design & Build · McLean, VA · Platinum TimberTech & Trex Certified · 25-Year Craftsmanship Warranty
      </div>
    </div>
  );
}
