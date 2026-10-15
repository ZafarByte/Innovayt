import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";

const motionEase = [0.22, 0.8, 0.2, 1];

const services = [
  {
    number: "01",
    title: "Digital\nMarketing",
    description:
      "Social media management, creative strategy, performance marketing, and campaign optimization.",
    list: ["Social Media", "Performance Marketing", "Content Strategy", "Campaign Optimization"],
  },
  {
    number: "02",
    title: "AI &\nAutomation",
    description:
      "WhatsApp AI chatbots, lead qualification, marketing automation, and customer communication workflows.",
    list: ["AI Chatbots", "Lead Qualification", "Workflow Automation", "Customer Communication"],
  },
  {
    number: "03",
    title: "Digital\nExperiences",
    description:
      "Website design, web development, UI/UX design, mobile applications, and custom software.",
    list: ["Web Development", "UI/UX Design", "Mobile Applications", "Custom Software"],
  },
  {
    number: "04",
    title: "Business\nOptimization",
    description:
      "Conversion optimization, analytics dashboards, reporting automation, and data-driven decision support.",
    list: ["Conversion Optimization", "Analytics Dashboards", "Reporting Automation", "Business Insights"],
  },
];

const projects = [
  {
    number: "01",
    title: "Business Website Redesign",
    description: "A modern, responsive website designed to reflect the brand and improve user experience.",
    tags: ["Web Design", "Development", "UI/UX"],
    image: "/projects/website-redesign.svg",
    alt: "Illustration of a modern editorial website design in a browser window",
  },
  {
    number: "02",
    title: "WhatsApp Lead Automation",
    description: "An AI-powered WhatsApp automation system to capture, qualify, and manage leads.",
    tags: ["AI Automation", "WhatsApp API", "Workflow"],
    image: "/projects/lead-automation.svg",
    alt: "Illustration of a mobile messaging interface connected to an automated lead workflow",
  },
  {
    number: "03",
    title: "Marketing Performance Analytics",
    description: "A clean and intuitive analytics interface to track campaign performance and business insights.",
    tags: ["Analytics", "Dashboard", "Data Visualization"],
    image: "/projects/performance-analytics.svg",
    alt: "Illustration of a campaign analytics dashboard with charts and performance trends",
  },
];

const steps = [
  ["Discover", "Understand the business, audience, and goals."],
  ["Strategize", "Identify the right opportunities and define a focused plan."],
  ["Build", "Design, develop, test, and implement the solution."],
  ["Improve", "Measure performance, refine the experience, and identify the next opportunity."],
];

const packages = [
  {
    title: "Launch",
    description: "A strong start for your digital journey.",
    icon: "tag",
    features: ["Website design and development", "Basic SEO setup", "Essential integrations", "Project handover and training"],
  },
  {
    title: "Growth",
    description: "For businesses ready to scale.",
    icon: "chart",
    features: ["Advanced website or platform", "Digital marketing support", "Automation workflows", "Analytics and reporting setup"],
  },
  {
    title: "Automation",
    description: "For higher efficiency and long-term growth.",
    icon: "settings",
    features: ["AI-powered automation solutions", "Custom development", "System integrations", "Ongoing support and optimization"],
  },
];

const faqs = [
  ["What is the typical project timeline?", "Most projects take between 2 and 8 weeks, depending on the scope and the services involved. We’ll share a clear timeline before work begins."],
  ["What services do you offer?", "We bring digital marketing, AI and automation, digital experiences, and business optimization together to help your business grow."],
  ["How do you price your projects?", "Every project is different. After learning about your goals, scope, and timeline, we’ll provide a tailored proposal with clear pricing."],
  ["Do you provide ongoing support after the project is completed?", "Yes. We can continue to support your team with maintenance, improvements, reporting, and ongoing optimization."],
  ["Do you work with small and medium-sized businesses?", "Absolutely. We work with ambitious businesses of different sizes and tailor the scope to suit your needs."],
];

function BrandedPreloader() {
  const [complete, setComplete] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (complete) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [complete]);

  useEffect(() => {
    if (complete) return undefined;
    const timeout = window.setTimeout(() => setComplete(true), 1600);
    return () => window.clearTimeout(timeout);
  }, [complete]);

  if (complete) return null;

  return (
    <div
      className="branded-preloader"
      role="status"
      aria-label="Loading Inovayt"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) setComplete(true);
      }}
    >
      <div className="preloader-content">
        <div className="preloader-mark">
          <span className="preloader-spark" aria-hidden="true">↗</span>
          <span className="preloader-wordmark">
            Inovayt
          </span>
        </div>
        <p className="preloader-tagline">
          Build Better. Grow Smarter.
        </p>
        <div className="preloader-track" aria-hidden="true">
          <span />
        </div>
      </div>
      <span className="preloader-index" aria-hidden="true">DIGITAL GROWTH &amp; AUTOMATION</span>
    </div>
  );
}

function Reveal({ as = "div", className, children, direction = "up", delay = 0, whileHover, ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const MotionElement = motion[as];
  const offset = direction === "left" ? { x: -24, y: 0 } : direction === "right" ? { x: 24, y: 0 } : { x: 0, y: 18 };

  return (
    <MotionElement
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, ...offset }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.62, delay, ease: motionEase }}
      whileHover={shouldReduceMotion ? undefined : whileHover}
      {...props}
    >
      {children}
    </MotionElement>
  );
}

function MagneticLink({ as = "a", href, className, children, onPointerMove, onPointerLeave, ...props }) {
  const reducedMotion = useReducedMotion();
  const [canMagnetize, setCanMagnetize] = useState(false);
  const Element = as;

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanMagnetize(media.matches && !reducedMotion);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [reducedMotion]);

  function handlePointerMove(event) {
    if (canMagnetize && event.pointerType === "mouse") {
      const bounds = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--magnetic-x", `${(event.clientX - bounds.left - bounds.width / 2) * 0.12}px`);
      event.currentTarget.style.setProperty("--magnetic-y", `${(event.clientY - bounds.top - bounds.height / 2) * 0.12}px`);
    }
    onPointerMove?.(event);
  }

  function resetPosition(event) {
    event.currentTarget.style.setProperty("--magnetic-x", "0px");
    event.currentTarget.style.setProperty("--magnetic-y", "0px");
    onPointerLeave?.(event);
  }

  return (
    <Element
      href={href}
      className={`magnetic-link${className ? ` ${className}` : ""}`}
      style={{ "--magnetic-x": "0px", "--magnetic-y": "0px" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      {...props}
    >
      {children}
    </Element>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return <div className="scroll-progress" aria-hidden="true"><motion.span style={{ scaleX: scrollYProgress }} /></div>;
}

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>;
}

function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    const moveCursor = (event) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        cursor.classList.add("is-ready");
        cursor.classList.toggle(
          "is-hovering",
          Boolean(event.target instanceof Element && event.target.closest("a, button, input, select, textarea, summary, [role='button']")),
        );
      });
    };
    const hideCursor = () => cursor.classList.remove("is-ready");

    window.addEventListener("pointermove", moveCursor);
    document.addEventListener("pointerleave", hideCursor);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", moveCursor);
      document.removeEventListener("pointerleave", hideCursor);
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef} aria-hidden="true"><span /></div>;
}

function PackageIcon({ name }) {
  if (name === "tag") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1 0-2.8l7.2-7.2A2 2 0 0 1 12 2.8H19a2 2 0 0 1 2 2V12a2 2 0 0 1-.4 1.4Z" />
        <circle cx="16.5" cy="7.5" r="1" />
      </svg>
    );
  }

  if (name === "chart") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20h18" />
        <rect x="5" y="11" width="3" height="7" rx=".5" />
        <rect x="11" y="7" width="3" height="11" rx=".5" />
        <rect x="17" y="3" width="3" height="15" rx=".5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      <path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V2a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z" transform="translate(0 1)" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, italic, description, id }) {
  return (
    <div className="section-heading" id={id}>
      <Reveal direction="left">
        <p className="eyebrow">{eyebrow}<span /></p>
        <h2>{title}<br /><em>{italic}</em></h2>
      </Reveal>
      {description && <Reveal as="p" className="section-description" direction="right">{description}</Reveal>}
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={closeMenu}>Inovayt</a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span /><span />
      </button>
      <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#work" onClick={closeMenu}>Work</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#insights" onClick={closeMenu}>Insights</a>
        <MagneticLink className="button button-lime nav-cta" href="#contact" onClick={closeMenu}>Let’s Talk <Arrow /></MagneticLink>
      </nav>
    </header>
  );
}

function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const headlineVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 1.28 } },
  };
  const headlineWordVariants = {
    hidden: { y: "115%", opacity: 0 },
    visible: { y: "0%", opacity: 1, transition: { duration: 0.58, ease: motionEase } },
  };
  const headlineLines = ["Your business", "deserves more", "than just a", "digital presence."];
  const renderWords = (line) => line.split(" ").map((word, index) => (
    <motion.span className="hero-word" variants={headlineWordVariants} key={`${word}-${index}`}>{word}</motion.span>
  ));

  return (
    <section className="hero" id="home">
      <motion.div
        className="hero-copy"
        initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.72, delay: 0.08, ease: motionEase }}
      >
        <p className="eyebrow">Digital growth &amp; automation agency<span /></p>
        <motion.h1
          aria-label={headlineLines.join(" ")}
          variants={headlineVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
        >
          {headlineLines.map((line, index) => (
            <span className="hero-title-line" aria-hidden="true" key={line}>
              <span className="hero-word-line">
                {index === headlineLines.length - 1
                  ? <em className="highlight">{renderWords(line)}</em>
                  : renderWords(line)}
              </span>
            </span>
          ))}
        </motion.h1>
        <motion.p
          className="hero-description"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 2.66, ease: motionEase }}
        >
          We design digital experiences, build intelligent automation, and create growth systems that help ambitious businesses move forward.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 2.8, ease: motionEase }}
        >
            <MagneticLink className="button button-lime" href="#contact">Start a Project <Arrow /></MagneticLink>
            <MagneticLink className="button button-outline" href="#services">Explore Our Services</MagneticLink>
        </motion.div>
        <p className="hero-keywords">Strategy <i>/</i> Design <i>/</i> Technology <i>/</i> Growth</p>
      </motion.div>
      <HeroVisual />
    </section>
  );
}

function TypewriterText({ lines }) {
  const reducedMotion = useReducedMotion();
  const fullText = lines.join(" ");
  const [typedCharacters, setTypedCharacters] = useState(reducedMotion ? fullText.length : 0);

  useEffect(() => {
    if (reducedMotion) {
      setTypedCharacters(fullText.length);
      return undefined;
    }

    let characterCount = 0;
    let interval;
    const startDelay = window.setTimeout(() => {
      interval = window.setInterval(() => {
        characterCount += 1;
        setTypedCharacters(characterCount);
        if (characterCount >= fullText.length) window.clearInterval(interval);
      }, 48);
    }, 900);

    return () => {
      window.clearTimeout(startDelay);
      window.clearInterval(interval);
    };
  }, [fullText, reducedMotion]);

  let remainingCharacters = typedCharacters;
  return (
    <p aria-label={fullText}>
      {lines.map((line, index) => {
        const visibleCharacters = Math.min(remainingCharacters, line.length);
        remainingCharacters -= visibleCharacters;
        return (
          <span key={line} aria-hidden="true">
            {line.slice(0, visibleCharacters) || "\u00a0"}
            {index < lines.length - 1 && <br />}
          </span>
        );
      })}
    </p>
  );
}

function HeroVisual() {
  const visualRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const [allowParallax, setAllowParallax] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setAllowParallax(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const reducedMotion = useReducedMotion();
  const growthFigure = useMotionValue(reducedMotion ? 42 : 0);
  const revenueFigure = useMotionValue(reducedMotion ? 824000 : 0);
  const revenueGrowthFigure = useMotionValue(reducedMotion ? 28 : 0);
  const growthLabel = useTransform(growthFigure, (value) => `+${Math.round(value)}%`);
  const revenueLabel = useTransform(revenueFigure, (value) => `₹ ${Math.round(value).toLocaleString("en-IN")}`);
  const revenueGrowthLabel = useTransform(revenueGrowthFigure, (value) => `↗ ${Math.round(value)}%`);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const controls = [
      animate(growthFigure, 42, { duration: 1.6, delay: 0.9, ease: motionEase }),
      animate(revenueFigure, 824000, { duration: 1.5, delay: 0.55, ease: motionEase }),
      animate(revenueGrowthFigure, 28, { duration: 1.25, delay: 0.75, ease: motionEase }),
    ];
    return () => controls.forEach((control) => control.stop());
  }, [growthFigure, revenueFigure, revenueGrowthFigure, reducedMotion]);

  return (
      <motion.div
        className="hero-visual"
        aria-label="Illustrative digital growth dashboard with sample metrics"
        ref={visualRef}
        style={{ y: allowParallax && !prefersReducedMotion ? parallaxY : 0 }}
        initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.12, ease: motionEase }}
      >
        <div className="hero-photo" />
        <div className="hero-browser">
          <div className="browser-top"><span>◉ inovayt</span><span>−　□　×</span></div>
          <div className="browser-content">
            <div>
              <TypewriterText lines={["Modern", "Solutions for", "Growing Brands"]} />
              <span className="tiny-button">Get Started</span>
            </div>
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=550&q=80" alt="" />
          </div>
        </div>
        <div className="float-card growth-card">
          <strong>Digital Growth</strong>
          <p className="growth-rate">● <motion.span>{growthLabel}</motion.span></p>
          <small>Sample dashboard data</small>
          <div className="bar-chart" aria-hidden="true">
            {[28, 48, 38, 63, 51, 82, 66, 100].map((height, index) => (
              <motion.i
                key={index}
                initial={reducedMotion ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.75, delay: 0.85 + index * 0.11, ease: motionEase }}
                style={{ height: `${height}%`, transformOrigin: "bottom" }}
              />
            ))}
          </div>
        </div>
        <div className="float-card automation-card">
          <strong>AI Automation</strong>
          <div className="automation-icons">
            <span><b>✦</b><small>Leads</small></span>
            <span><b>⌘</b><small>Qualify</small></span>
            <span><b>◉</b><small>Nurture</small></span>
          </div>
        </div>
        <div className="float-card revenue-card">
          <div className="revenue-heading">↗ <span>•••</span></div>
          <small>Sample Revenue</small>
          <strong><motion.span>{revenueLabel}</motion.span></strong>
          <svg viewBox="0 0 220 90" role="img" aria-label="Illustrative revenue trend">
            <motion.path
              d="M2 78 C20 60 30 71 43 54 S67 64 78 48 S105 52 117 36 S143 48 154 25 S178 40 188 18 S205 25 218 3"
              initial={reducedMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.35, delay: 0.4, ease: motionEase }}
            />
          </svg>
          <b className="revenue-growth"><motion.span>{revenueGrowthLabel}</motion.span></b>
          <small>Illustrative data</small>
        </div>
      </motion.div>
  );
}

function Services() {
  return (
    <section className="content-section services-section" id="services">
      <SectionHeading
        eyebrow="What we do"
        title="Everything digital."
        italic="Built around your growth."
        description="We combine strategy, design, technology and automation to help businesses attract, engage and grow in a digital-first world."
      />
      <div className="service-grid">
        {services.map((service) => (
          <Reveal as="article" className="service-card" key={service.number} delay={Number(service.number) * 0.04} whileHover={{ y: -5 }}>
            <span className="card-number">{service.number}</span>
            <a className="service-link" href="#contact" aria-label={`Talk to us about ${service.title.replace("\n", " ")}`}><Arrow /></a>
            <h3>{service.title.split("\n").map((part) => <React.Fragment key={part}>{part}<br /></React.Fragment>)}</h3>
            <p>{service.description}</p>
            <ul>{service.list.map((item) => <li key={item}>{item}</li>)}</ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="content-section work-section" id="work">
      <SectionHeading
        eyebrow="Selected work"
        title="Thoughtful work."
        italic="Practical outcomes."
        description={<><span>A selection of recent work that highlights our approach to design, development and automation.</span><MagneticLink className="button button-outline" href="#contact">View All Projects <Arrow /></MagneticLink></>}
      />
      <div className="project-grid">
        {projects.map((project) => (
          <Reveal as="article" className="project-card" key={project.number} delay={Number(project.number) * 0.07} whileHover={{ y: -5 }}>
            <a
              className="project-image"
              href="#contact"
              aria-label={`Discuss a project like ${project.title}`}
            >
              <img src={project.image} alt={project.alt} loading="lazy" />
            </a>
            <div className="project-meta"><span>{project.number}</span><Arrow /></div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const processRef = useRef(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    const section = processRef.current;
    if (!section || hasEnteredView) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasEnteredView(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasEnteredView]);

  return (
    <section className={`content-section process-section${hasEnteredView ? " is-visible" : ""}`} id="insights" ref={processRef}>
      <SectionHeading
        eyebrow="How we work"
        title="Less complexity."
        italic="More momentum."
        description="A clear and collaborative process designed to bring clarity, speed and measurable progress to your project."
      />
      <div className="process-grid">
        {steps.map(([title, description], index) => (
          <Reveal as="article" className="process-step" key={title} delay={index * 0.08} whileHover={{ y: -4 }}>
            <span className="card-number">0{index + 1}</span>
            <div className="process-track" aria-hidden="true">
              <span className="process-connector" />
              <i />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="content-section founder-section" id="about">
      <Reveal className="founder-copy" direction="left">
        <p className="eyebrow">Meet the founder<span /></p>
        <h2>Built around<br /><em>your business.</em></h2>
        <p>Inovayt was founded with a simple belief — that technology and design should solve real business problems. We work closely with business owners and teams to understand their goals and build digital solutions that create long-term value.</p>
        <MagneticLink className="button button-outline" href="#contact">Our Approach <Arrow /></MagneticLink>
      </Reveal>
      <Reveal className="founder-visual" direction="right">
        <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=85" alt="Geometric contemporary architecture" loading="lazy" />
        <a className="founder-arrow" href="#contact" aria-label="Start a conversation"><Arrow /></a>
      </Reveal>
      <Reveal as="aside" className="founder-aside" delay={0.1}>
        <p>Strategy<br />Design<br />Technology<br />Growth</p>
        <span />
        <p>A focused, hands-on approach that combines strategic thinking, creative execution, and technical expertise to help businesses move forward.</p>
      </Reveal>
    </section>
  );
}

function Packages() {
  return (
    <section className="content-section packages-section" id="packages">
      <SectionHeading
        eyebrow="Our packages"
        title="Clear scope."
        italic="Real value."
        description="Flexible engagement options designed to fit different business needs. Each package can be customized based on your goals and requirements."
      />
      <div className="package-grid">
        {packages.map((plan, index) => (
          <Reveal as="article" className="package-card" key={plan.title} delay={index * 0.08} whileHover={{ y: -5 }}>
            <div className="package-title-row">
              <h3>{plan.title}</h3>
              <a className="package-arrow" href="#contact" aria-label={`Ask about the ${plan.title} package`}><Arrow /></a>
            </div>
            <p className="package-description">{plan.description}</p>
            <div className="package-highlight">
              <span className="package-icon" aria-hidden="true"><PackageIcon name={plan.icon} /></span>
              <span><strong>Tailored to your requirements</strong><small>Custom scope based on your goals and needs.</small></span>
            </div>
            <ul>{plan.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
            <MagneticLink className="package-cta" href="#contact">Discuss this package <Arrow /></MagneticLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="content-section faq-section" id="faq">
      <Reveal className="faq-heading" direction="left">
        <p className="eyebrow">Frequently asked questions<span /></p>
        <h2>Common questions.<br /><em>Clear answers.</em></h2>
      </Reveal>
      <Reveal className="faq-list" direction="right">
        {faqs.map(([question, answer]) => (
          <details className="faq-item" key={question}>
            <summary>{question}<span aria-hidden="true" /></summary>
            <p>{answer}</p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}

function Contact() {
  const [formStatus, setFormStatus] = useState("idle");
  const [formError, setFormError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFormStatus("submitting");
    setFormError("");

    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "We couldn’t send your message right now. Please try again shortly.");
      }

      setFormStatus("success");
      form.reset();
    } catch (error) {
      setFormStatus("error");
      setFormError(error instanceof Error ? error.message : "We couldn’t send your message right now. Please try again shortly.");
    }
  }

  return (
    <section className="contact-section" id="contact">
      <Reveal className="contact-copy" direction="left">
        <p className="eyebrow">Let’s work together<span /></p>
        <h2>Have a business<br />goal? Let’s build<br />the way <em>forward.</em></h2>
        <p>Tell us where you want to go. We’ll help you figure out what to build next.</p>
      </Reveal>
      <Reveal className="contact-form" as="form" direction="right" onSubmit={handleSubmit} aria-busy={formStatus === "submitting"}>
        <div className="form-grid">
          <label>Name<input name="name" type="text" placeholder="Your name" required /></label>
          <label>Business email<input name="email" type="email" placeholder="you@company.com" required /></label>
          <label>Company name<input name="company" type="text" placeholder="Your company name" /></label>
          <label>Service required
            <select name="service" defaultValue="" required>
              <option value="" disabled>Select a service</option>
              <option>Digital Marketing</option>
              <option>AI &amp; Automation</option>
              <option>Digital Experiences</option>
              <option>Business Optimization</option>
              <option>Something else</option>
            </select>
          </label>
          <label className="full-field">Project budget
            <select name="budget" defaultValue="">
              <option value="" disabled>Select budget range</option>
              <option>Under ₹1,00,000</option>
              <option>₹1,00,000 – ₹5,00,000</option>
              <option>₹5,00,000 – ₹10,00,000</option>
              <option>₹10,00,000+</option>
            </select>
          </label>
          <label className="full-field">Project description<textarea name="description" placeholder="Tell us about your project..." rows="3" required /></label>
        </div>
        <div className="form-honeypot" aria-hidden="true">
          <label>Leave this field empty<input name="website" type="text" tabIndex="-1" autoComplete="off" /></label>
        </div>
        <MagneticLink as="button" className="button button-lime submit-button" type="submit" disabled={formStatus === "submitting"}>
          {formStatus === "submitting" ? "Sending..." : <>Start a Conversation <Arrow /></>}
        </MagneticLink>
        {formStatus === "success" && <p className="form-success" role="status">Thanks — your enquiry was sent. We’ll be in touch soon.</p>}
        {formStatus === "error" && <p className="form-error" role="alert">{formError}</p>}
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <Reveal as="footer" className="site-footer" direction="up">
      <div className="footer-main">
        <div className="footer-brand"><a className="wordmark" href="#home">Inovayt</a><p>Build Better. Grow Smarter.</p></div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="#services">Services</a><a href="#work">Work</a><a href="#about">About</a><a href="#insights">Insights</a>
        </nav>
        <div className="social-links"><a href="https://www.linkedin.com/in/innovayt-studio-63402a443/?isSelfProfile=true" aria-label="LinkedIn">in</a><a href="https://www.instagram.com/" aria-label="Instagram">◎</a></div>
      </div>
      <div className="footer-legal"><span>© 2026 Inovayt. All rights reserved.</span><div><a href="#contact">Privacy Policy</a><a href="#contact">Terms of Service</a></div></div>
    </Reveal>
  );
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <BrandedPreloader />
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <Services />
        <Work />
        <Process />
        <About />
        <Packages />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
