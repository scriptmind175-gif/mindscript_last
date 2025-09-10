import React, { useState, useEffect } from "react";
import "./Navbar.css";

const sections = [
  { id: "home", label: "Home" },
  { id: "courses", label: "Courses" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      let found = "home";
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            found = sec.id;
            break;
          }
        }
      }
      setActive(found);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setMenuOpen(false);
  
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <span className="logo-text">MINDSCRIPT</span>
      </div>
      <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <div className={`nav-links${menuOpen ? " open" : ""}`}>
        {sections.map((sec) => (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            onClick={handleNavClick}
            className={active === sec.id ? "active" : ""}
          >
            {sec.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;