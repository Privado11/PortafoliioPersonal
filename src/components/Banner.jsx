import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import bannersvg from "../assets/banner.svg";
import background from "../assets/banner-bg.png";
import "../styles/Banner.css";

const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation("banner");

  const toRotate = t("banner.roles", { returnObjects: true });
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);
    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  useEffect(() => {
    setText("");
    setLoopNum(0);
    setIsDeleting(false);
    setDelta(300 - Math.random() * 100);
  }, [i18n.language]);

  useEffect(() => {
    const section = document.getElementById("home");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, []);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(200);
    }
  };

  const scrollToProjects = () => {
    const element = document.getElementById("projects");
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

  return (
    <section
      id="home"
      className="min-h-screen flex items-center px-5 overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: "top center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30 sm:py-60 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <div
            className={`banner-content space-y-8 w-full overflow-hidden ${
              isVisible ? "slide-in-left animate" : ""
            }`}
          >
            <div className="inline-block">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-bold text-lg px-4 py-2 border border-purple-400/30 rounded-full backdrop-blur-sm">
                {t("banner.welcome")}
              </span>
            </div>

            <div className="space-y-4 w-full overflow-hidden">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight break-words word-wrap overflow-wrap-break-word hyphens-auto w-full">
                {t("banner.greeting")}{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {t("banner.name")}
                </span>
              </h1>
              <div className="text-2xl lg:text-3xl text-gray-300 break-words overflow-hidden w-full min-h-[1.5em]">
                <span
                  className="animate-pulse inline-block w-full break-words word-wrap overflow-wrap-break-word hyphens-auto"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                  }}
                >
                  {text}
                </span>
              </div>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl break-words word-wrap overflow-wrap-break-word hyphens-auto w-full">
              {t("banner.description")}
            </p>

            <Button
              onClick={scrollToProjects}
              className="group cursor-pointer flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
            >
              <span>{t("banner.cta")}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="flex justify-center lg:justify-end w-full overflow-hidden">
            <div className="relative w-100 h-100 max-w-full">
              <div
                className={`banner-image ${
                  isVisible ? "scale-in animate" : ""
                }`}
              >
                <img
                  src={bannersvg}
                  alt={t("banner.imageAlt")}
                  className={`max-w-full h-auto ${isVisible ? "updown" : ""}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
