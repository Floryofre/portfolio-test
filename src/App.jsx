
import { useState, useEffect } from 'react'
import { portfolioData } from './data/portfolio.js'

export default function App(){
  const [activeSection, setActiveSection] = useState('inicio')
  const [menuOpen, setMenuOpen] = useState(false)
  const [typeIndex, setTypeIndex] = useState(0)
  const [typeText, setTypeText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [theme, setTheme] = useState('light')
  const [projectTab, setProjectTab] = useState('data')
  const [filter, setFilter] = useState('all')
  const [clickedNav, setClickedNav] = useState('')

  const { rotatingTitles, nav, recomendaciones, proyectosData, proyectosWeb, experiencia, habilidades, formacion, about, contacto, personal } = portfolioData

  useEffect(()=>{
    try{
      const saved = localStorage.getItem('theme')
      if(saved) setTheme(saved)
      else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
    }catch{}
  },[])
  useEffect(()=>{
    try{
      localStorage.setItem('theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    }catch{}
  },[theme])

  useEffect(()=>{
    const current = rotatingTitles[typeIndex]
    const timeout = setTimeout(()=>{
      if(!isDeleting){
        if(typeText.length < current.length) setTypeText(current.slice(0, typeText.length+1))
        else setTimeout(()=> setIsDeleting(true), 1600)
      } else {
        if(typeText.length>0) setTypeText(current.slice(0, typeText.length-1))
        else { setIsDeleting(false); setTypeIndex((prev)=>(prev+1)%rotatingTitles.length) }
      }
    }, isDeleting ? 35 : 85)
    return ()=> clearTimeout(timeout)
  },[typeText, isDeleting, typeIndex, rotatingTitles])

  useEffect(()=>{
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{ if(entry.isIntersecting) setActiveSection(entry.target.id) })
    },{rootMargin:"-45% 0px -45% 0px", threshold:0})
    nav.forEach((n)=>{ const el=document.getElementById(n.id); if(el) observer.observe(el) })
    return ()=> observer.disconnect()
  },[])

  const scrollTo = (id)=>{
    setMenuOpen(false)
    setActiveSection(id)
    setClickedNav(id)
    setTimeout(()=> setClickedNav(''),600)
    try{ history.replaceState(null,'',`#${id}`)}catch{}
    const el=document.getElementById(id)
    if(el) el.scrollIntoView({behavior:"smooth", block:"start"})
    else window.scrollTo({top:0, behavior:"smooth"})
  }

  const isDark = theme==='dark'

  return (
    <div className="min-h-screen antialiased selection:bg-[#D4AF37]/30 overflow-x-hidden" style={{backgroundColor:"var(--bg)", color:"var(--text)", paddingTop:"64px"}}>
      {/* HEADER - ORIGINAL EXACTO */}
      <header className="fixed left-0 right-0 top-0 z-[9999] flex h-[64px] w-full items-center border-b" style={{backgroundColor: isDark ? "rgba(15,23,42,0.92)" : "rgba(253,251,247,0.92)", borderColor:"var(--border)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)"}}>
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-3 px-3 sm:px-4 lg:px-6">
          <a href="#inicio" onClick={(e)=>{e.preventDefault(); scrollTo('inicio'); window.scrollTo({top:0, behavior:"smooth"})}} className="flex shrink-0 items-center" aria-label="Inicio">
            <img src="/icon.png" alt="MFY Icon" className="h-[36px] w-auto object-contain" style={{height:"36px", filter: isDark ? "none" : "drop-shadow(0 1px 2px rgba(0,0,0,0.25))"}} />
          </a>
          <nav className="flex flex-1 items-center justify-start gap-[12px] overflow-x-auto whitespace-nowrap px-2 scrollbar-hide lg:justify-center">
            {nav.map((item)=>(
              <button key={item.id} onClick={()=>scrollTo(item.id)} data-nav-id={item.id} className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${activeSection===item.id ? "bg-[#1e293b] text-white dark:bg-white dark:text-[#0f172a]" : "hover:bg-black/5 dark:hover:bg-white/10"} ${clickedNav===item.id ? "scale-95 ring-2 ring-[#D4AF37]/50" : ""}`} style={{color: activeSection===item.id ? undefined : "var(--text-muted)"}}>{item.label}</button>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={()=>setTheme(isDark?'light':'dark')} aria-label="Toggle theme" className="flex h-8 w-8 items-center justify-center rounded-full border transition" style={{backgroundColor:"var(--card)", borderColor:"var(--border)", color:"var(--text)"}}>
              {isDark ? "☀️" : "🌙"}
            </button>
            <div className="hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium md:flex" style={{backgroundColor: isDark ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.10)", borderColor:"rgba(212,175,55,0.25)", color: isDark ? "#D4AF37" : "#8a6a2e"}}>
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#D4AF37]"></span>
              <span>{personal.availability}</span>
            </div>
            <a href="#contacto" onClick={(e)=>{e.preventDefault(); scrollTo('contacto')}} className="inline-flex items-center gap-1.5 rounded-full bg-[#1e293b] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-black dark:bg-white dark:text-[#0f172a]">✉️ Contactar</a>
            <button onClick={()=>setMenuOpen(!menuOpen)} className="flex h-8 w-8 items-center justify-center rounded-full border lg:hidden" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}} aria-label="Menu">
              <div className="space-y-1">
                <div className={`h-px w-4 bg-current transition ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`}></div>
                <div className={`h-px w-4 bg-current transition ${menuOpen ? "opacity-0" : ""}`}></div>
                <div className={`h-px w-4 bg-current transition ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`}></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 top-[64px] z-[9998] border-b p-4 shadow-xl lg:hidden" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
          <div className="grid grid-cols-2 gap-2">
            {nav.map((item)=>(
              <button key={item.id} onClick={()=>scrollTo(item.id)} className="rounded-xl border px-4 py-3 text-left text-[13px] font-medium" style={{backgroundColor: activeSection===item.id ? "#1e293b" : "var(--card-soft)", color: activeSection===item.id ? "white" : "var(--text-muted)", borderColor:"var(--border)"}}>{item.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* INICIO */}
      <section id="inicio" className="relative" style={{backgroundColor:"var(--bg)"}}>
        <div className="relative h-[140px] w-full overflow-hidden md:h-[180px]">
          <img src="/banner.webp" alt="Teal network banner" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/40 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 -mt-12 flex flex-col gap-6 rounded-[24px] border p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,.25)] sm:-mt-16 sm:flex-row sm:items-center sm:p-7 md:gap-8" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
            <div className="shrink-0 self-center sm:self-auto">
              <img src="/profile.jpg" alt={personal.fullName} className="h-[110px] w-[110px] rounded-full object-cover md:h-[140px] md:w-[140px]" style={{border:"4px solid #D4AF37", boxShadow:"0 8px 24px -8px rgba(0,0,0,.3)"}} />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="text-[26px] font-bold leading-[1.1] tracking-tight sm:text-[32px] md:text-[36px]" style={{color:"var(--text)"}}>{personal.fullName}</h1>
              <p className="mt-2 text-[13px] font-medium leading-6 sm:text-[14px] md:text-[15px]" style={{color:"var(--text-muted)"}}>{personal.headline}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="mono text-[11px] font-semibold tracking-[0.18em] text-[#D4AF37]">{personal.subHeadline}</span>
                <span className="hidden h-3 w-px bg-[#D4AF37]/30 sm:block"></span>
                <span className="flex items-center gap-1.5 text-[11px]" style={{color:"var(--text-muted)"}}><span className="h-2 w-2 animate-pulse rounded-full bg-[#D4AF37]"></span> {personal.location}</span>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                {["SQL","Power BI","Airtable","Automatizacion","Python","n8n"].map((tag)=>(
                  <span key={tag} className="rounded-full border px-2.5 py-1 text-[11px] font-medium" style={{backgroundColor:"var(--card-soft)", borderColor:"var(--border)", color:"var(--text-muted)"}}>{tag}</span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-[12px] sm:justify-start" style={{color:"var(--text-muted)"}}>
                <span>{">"}</span> {typeText}<span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[1px] animate-pulse bg-[#D4AF37]"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE MI */}
      <section id="sobre-mi" className="border-t" style={{backgroundColor:"var(--bg)", borderColor:"var(--border)"}}>
        <div className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8 lg:py-24">
          <div className="flex items-center gap-2">
            <div className="h-px w-10 bg-[#D4AF37]"></div>
            <span className="mono text-[11px] font-semibold tracking-[0.18em]" style={{color:"var(--text-muted)"}}>SOBRE MÍ</span>
          </div>
          <h2 className="mt-3 max-w-[760px] text-[28px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[34px]" style={{color:"var(--text)"}}>Perfil Profesional</h2>
          <p className="mt-4 max-w-[800px] text-[15px] leading-7" style={{color:"var(--text-muted)"}}>
            {about.intro} <strong style={{color:"var(--text)"}}>{about.currentRole}</strong>
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[20px] border p-6" style={{backgroundColor:"var(--card-soft)", borderColor:"var(--border)"}}>
              <div className="flex items-center gap-2 text-[12px] font-semibold tracking-wide" style={{color:"var(--text)"}}>📘 Mi camino</div>
              <p className="mt-3 text-[14px] leading-6" style={{color:"var(--text-muted)"}}>{about.camino}</p>
            </div>
            <div className="rounded-[20px] border p-6" style={{backgroundColor:"var(--card-soft)", borderColor:"var(--border)"}}>
              <div className="flex items-center gap-2 text-[12px] font-semibold tracking-wide" style={{color:"var(--text)"}}>💼 Experiencia actual</div>
              <p className="mt-3 text-[14px] leading-6" style={{color:"var(--text-muted)"}}>{about.experienciaActual}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HABILIDADES */}
      <section id="habilidades" className="border-t" style={{backgroundColor:"var(--bg)", borderColor:"var(--border)"}}>
        <div className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium" style={{backgroundColor:"var(--card)", borderColor:"var(--border)", color:"var(--text-muted)"}}> STACK TÉCNICO & OPERATIVO</div>
            <h2 className="mt-4 text-[28px] font-bold tracking-tight sm:text-[36px]" style={{color:"var(--text)"}}>Habilidades Técnicas</h2>
            <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-6" style={{color:"var(--text-muted)"}}>Combino análisis, visualización y automatización para construir sistemas que escalan.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habilidades.map((cat)=>(
              <div key={cat.title} className="card-hover rounded-[20px] border p-6" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e293b] text-white">●</div>
                  <h3 className="text-[14px] font-semibold" style={{color:"var(--text)"}}>{cat.title}</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cat.pills.map((pill)=>(
                    <span key={pill} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${cat.special ? "bg-[#D4AF37]/15 text-[#8a6a2e] dark:text-[#D4AF37] border-[#D4AF37]/20" : ""}`} style={cat.special ? undefined : {backgroundColor:"var(--card-soft)", borderColor:"var(--border)", color:"var(--text-muted)"}}>{pill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCIA */}
      <section id="experiencia" className="border-t" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
        <div className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8 lg:py-24">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-[0.18em]" style={{color:"var(--text-muted)"}}>TRAYECTORIA</span>
              </div>
              <h2 className="mt-3 text-[28px] font-bold tracking-tight sm:text-[36px]" style={{color:"var(--text)"}}>Experiencia Profesional</h2>
            </div>
          </div>
          <div className="relative mt-12">
            <div className="absolute left-3 top-2 hidden h-[calc(100%-16px)] w-px bg-gradient-to-b from-[#D4AF37]/40 via-[#D4AF37]/10 to-transparent lg:block"></div>
            <div className="space-y-6">
              {experiencia.map((exp)=>(
                <div key={exp.title} className="group relative rounded-[20px] border p-6 transition lg:ml-10 lg:p-7" style={{backgroundColor:"var(--card-soft)", borderColor:"var(--border)"}}>
                  <div className="absolute -left-[35px] top-8 hidden h-3 w-3 rounded-full border-2 border-white bg-[#D4AF37] shadow lg:flex"></div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[16px] font-semibold" style={{color:"var(--text)"}}>{exp.title}</h3>
                      <p className="mt-1 text-[13px] font-medium" style={{color:"var(--text-muted)"}}>{exp.org} • {exp.meta}</p>
                    </div>
                    {exp.current && <span className="rounded-full bg-[#10b981]/20 px-2.5 py-1 text-[10px] font-semibold text-[#10b981]">Actual</span>}
                  </div>
                  <ul className="mt-4 list-disc space-y-1.5 pl-4 text-[13px] leading-5" style={{color:"var(--text-muted)"}}>
                    {exp.bullets.map((b,i)=><li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROYECTOS */}
      <section id="proyectos" className="border-t" style={{backgroundColor:"var(--bg)", borderColor:"var(--border)"}}>
        <div className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="text-[28px] font-bold tracking-tight sm:text-[36px]" style={{color:"var(--text)"}}>Proyectos Destacados</h2>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex rounded-full border p-1" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
              <button onClick={()=>{setProjectTab('data'); setFilter('all')}} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition ${projectTab==='data' ? "bg-[#1e293b] text-white" : ""}`} style={{color: projectTab==='data' ? undefined : "var(--text-muted)"}}>Datos, BI, Automatización + IA</button>
              <button onClick={()=>{setProjectTab('web'); setFilter('all')}} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition ${projectTab==='web' ? "bg-[#1e293b] text-white" : ""}`} style={{color: projectTab==='web' ? undefined : "var(--text-muted)"}}>MFY Web Studio</button>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {(projectTab==='data' ? proyectosData.filter(p=> filter==='all' || p.category===filter) : proyectosWeb).map((proj)=>(
              <div key={proj.id} className="card-hover overflow-hidden rounded-[20px] border" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
                <div className={`relative h-[160px] w-full bg-gradient-to-br ${proj.coverGradient} flex items-center justify-center`}>
                  <span className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold ${proj.badgeClass}`}>{proj.badge}</span>
                  <div className="text-4xl opacity-80">📊</div>
                </div>
                <div className="p-5">
                  <h3 className="text-[16px] font-semibold leading-tight" style={{color:"var(--text)"}}>{proj.title}</h3>
                  <p className="mt-2 text-[13px] leading-6" style={{color:"var(--text-muted)"}}>{proj.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.tags.map((t)=><span key={t} className="rounded-full border px-2.5 py-1 text-[10px] font-medium" style={{backgroundColor:"var(--card-soft)", borderColor:"var(--border)", color:"var(--text-muted)"}}>{t}</span>)}
                  </div>
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-[12px] leading-5" style={{color:"var(--text-muted)"}}>
                    {proj.bullets.map((b,i)=><li key={i}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMENDACIONES */}
      <section id="recomendaciones" className="border-t" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
        <div className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8 lg:py-24">
          <h2 className="text-[28px] font-bold tracking-tight sm:text-[36px]" style={{color:"var(--text)"}}>Recomendaciones</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recomendaciones.map((rec)=>(
              <div key={rec.id} className="rounded-[20px] border p-6" style={{backgroundColor:"var(--card-soft)", borderColor:"var(--border)"}}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-bold text-white ${rec.color}`}>{rec.initials}</div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-tight" style={{color:"var(--text)"}}>{rec.name}</p>
                    <p className="mt-0.5 line-clamp-1 text-[11px]" style={{color:"var(--text-muted)"}}>{rec.role}</p>
                  </div>
                </div>
                <p className="mt-1 text-[10px]" style={{color:"var(--text-muted)"}}>{rec.date} • {rec.relation}</p>
                <p className="mt-3 line-clamp-5 text-[13px] leading-6" style={{color:"var(--text-muted)"}}>"{rec.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMACION */}
      <section id="formacion" className="border-t" style={{backgroundColor:"var(--bg)", borderColor:"var(--border)"}}>
        <div className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8 lg:py-24">
          <h2 className="text-[28px] font-bold tracking-tight sm:text-[36px]" style={{color:"var(--text)"}}>Formación Continua</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {formacion.map((f)=>(
              <div key={f.title} className="rounded-[16px] border p-5" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[14px] font-semibold" style={{color:"var(--text)"}}>{f.title}</h3>
                  <span className="shrink-0 rounded-full bg-[#D4AF37]/15 px-2 py-0.5 text-[10px] font-medium text-[#8a6a2e]">{f.year}</span>
                </div>
                <p className="mt-1 text-[12px] font-medium" style={{color:"var(--text-muted)"}}>{f.org}</p>
                <p className="mt-2 text-[12px] leading-5" style={{color:"var(--text-muted)"}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="border-t" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
        <div className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8 lg:py-24">
          <h2 className="text-[28px] font-bold tracking-tight sm:text-[36px]" style={{color:"var(--text)"}}>Trabajemos juntos</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="rounded-[20px] border p-6" style={{backgroundColor:"var(--card-soft)", borderColor:"var(--border)"}}>
              <div className="space-y-4">
                <a href={`mailto:${contacto.email}`} className="flex items-center gap-3 rounded-2xl border px-4 py-4" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e293b] text-white">✉️</div>
                  <div><p className="text-[11px]" style={{color:"var(--text-muted)"}}>EMAIL</p><p className="text-[14px] font-semibold" style={{color:"var(--text)"}}>{contacto.email}</p></div>
                </a>
                <a href={contacto.linkedin} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-2xl border px-4 py-4" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2] text-white">in</div>
                  <div><p className="text-[11px]" style={{color:"var(--text-muted)"}}>LINKEDIN</p><p className="text-[14px] font-semibold" style={{color:"var(--text)"}}>{contacto.linkedin}</p></div>
                </a>
                <a href={contacto.github} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-2xl border px-4 py-4" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-white">GH</div>
                  <div><p className="text-[11px]" style={{color:"var(--text-muted)"}}>GITHUB</p><p className="text-[14px] font-semibold" style={{color:"var(--text)"}}>{contacto.github}</p></div>
                </a>
              </div>
            </div>
            <div className="rounded-[20px] border p-6" style={{backgroundColor:"var(--card)", borderColor:"var(--border)"}}>
              <h3 className="text-[14px] font-semibold" style={{color:"var(--text)"}}>Envíame un mensaje</h3>
              <p className="mt-2 text-[13px]" style={{color:"var(--text-muted)"}}>Respuesta en menos de 24hs.</p>
              <a href={`mailto:${contacto.email}`} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#1e293b] px-6 py-3 text-[14px] font-semibold text-white">Enviar email</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center" style={{borderColor:"var(--border)", backgroundColor:"var(--bg)"}}>
        <p className="text-[12px]" style={{color:"var(--text-muted)"}}>© 2025 {personal.fullName} — Data • Security • Process</p>
      </footer>
    </div>
  )
}
