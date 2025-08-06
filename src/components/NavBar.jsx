import React, { useEffect, useState, useRef } from "react";
import { Menu, X, Globe } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import cvFile from "../assets/curriculum.pdf";
import "../styles/NavBar.css";

const Navbar = ({ setErrors }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const { t, i18n } = useTranslation("common");
  const observerRef = useRef(null);

  const social = t("socialList", { returnObjects: true });

  const iconMap = {
    Linkedin: FaLinkedin,
    Github: FaGithub,
  };

  const getCurrentHash = () => {
    const hash = window.location.hash.replace("#", "");
    return hash || "home";
  };

  const updateActiveLinkFromHash = () => {
    const hash = getCurrentHash();
    const validSections = ["home", "skills", "projects", "contact"];
    if (validSections.includes(hash)) {
      setActiveLink(hash);
    }
  };

  useEffect(() => {
    updateActiveLinkFromHash();

    const sections = ["home", "skills", "projects", "contact"];

    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -50% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sections.includes(sectionId)) {
            setActiveLink(sectionId);

            window.history.replaceState(null, null, `#${sectionId}`);
          }
        }
      });
    }, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const onHashChange = () => {
      updateActiveLinkFromHash();
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    window.history.pushState(null, null, `#${sectionId}`);
    setActiveLink(sectionId);
    setIsMenuOpen(false);

    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const toggleLanguage = () => {
    setErrors({});
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  const menuItems = [
    {
      name: "home",
      label: t("navigation.home"),
      href: "#home",
    },
    {
      name: "skills",
      label: t("navigation.skills"),
      href: "#skills",
    },
    {
      name: "projects",
      label: t("navigation.projects"),
      href: "#projects",
    },
  ];

   const downloadCV = () => {
     const link = document.createElement("a");
     link.href = cvFile;
     link.download = "CV-Walter-Jimenez.pdf";
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
   };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 sm:px-5 ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Button
              onClick={() => scrollToSection("home")}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-400 transition-all duration-300 cursor-pointer"
            >
              {t("brand.name")}
            </Button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.name)}
                className={`px-3 py-2 text-sm font-medium transition-all duration-300 cursor-pointer relative ${
                  activeLink === item.name
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
                {activeLink === item.name && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 rounded-full transform transition-all duration-300"></span>
                )}
              </button>
            ))}

            <div className="flex items-center space-x-2">
              {social.map((social, index) => {
                const IconComponent = iconMap[social.icon];
                return (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn p-2 rounded-full border border-gray-400 hover:bg-white transition-colors group"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
                  </a>
                );
              })}
            </div>

            <button
              onClick={toggleLanguage}
              className="p-2 flex gap-2 rounded-full border border-gray-400 hover:border-purple-400 hover:bg-purple-400/10 transition-all duration-300 group cursor-pointer"
              aria-label="Change language"
            >
              <Globe className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors duration-300" />
              <span className="ml-1 text-xs text-gray-300 group-hover:text-purple-400">
                {i18n.language.toUpperCase()}
              </span>
            </button>

            <Button
              onClick={() => scrollToSection("contact")}
              className="contact-btn ml-4 border border-white text-white bg-transparent transition-all duration-300 cursor-pointer"
            >
              {t("buttons.contact")}
            </Button>

            <Button
              onClick={downloadCV}
              className="cv-btn ml-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-300 cursor-pointer"
            >
              {t("buttons.downloadCV")}
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-purple-700 transition-colors duration-300"
              aria-label={t("buttons.toggleMenu")}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-purple-800/50 backdrop-blur-sm rounded-lg mt-2 border border-purple-600/30">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.name)}
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${
                    activeLink === item.name
                      ? "text-white bg-purple-700/50"
                      : "text-gray-300 hover:text-white hover:bg-purple-700/30"
                  }`}
                >
                  {activeLink === item.name && (
                    <span className="text-cyan-400 mr-2">•</span>
                  )}
                  {item.label}
                </button>
              ))}

              <button
                onClick={toggleLanguage}
                className="block w-full text-left px-3 py-2 text-base font-medium rounded-md text-gray-300 hover:text-white hover:bg-purple-700/30 transition-all duration-300"
              >
                <Globe className="w-4 h-4 inline mr-2" />
                {i18n.language === "es" ? "Español" : "English"}
              </button>

              <div className="flex items-center justify-center space-x-4 pt-4 pb-2">
                {social.map((social, index) => {
                  const IconComponent = iconMap[social.icon];
                  return (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mobile-social-btn p-2 rounded-full border border-gray-400 hover:border-purple-400 transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>

              <div className="px-3 py-2">
                <Button
                  className="mobile-contact-btn w-full border-gray-400 text-white transition-all duration-300"
                  onClick={() => scrollToSection("contact")}
                >
                  {t("buttons.contact")}
                </Button>
              </div>

              <div className="px-3 py-2">
                <Button
                  className="mobile-cv-btn w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-300 mb-2"
                  onClick={() => {
                    downloadCV();
                    setIsMenuOpen(false);
                  }}
                >
                  {t("buttons.downloadCV")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
