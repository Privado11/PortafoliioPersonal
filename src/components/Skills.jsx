import { useEffect, useRef, useState } from "react";
import { Code, Cpu, Database, Globe } from "lucide-react";
import { SiShadcnui, SiSupabase, SiVite, SiDotnet } from "react-icons/si";
import { FaGitAlt } from "react-icons/fa";
import {
  BiLogoJava,
  BiLogoSpringBoot,
  BiLogoPostgresql,
  BiLogoReact,
  BiLogoHtml5,
  BiLogoTailwindCss,
} from "react-icons/bi";
import { useTranslation } from "react-i18next";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import "../styles/Skills.css";

const Skills = () => {
  const { t } = useTranslation("skills");
  const [animatedLevels, setAnimatedLevels] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const skills = t("skillsList", { returnObjects: true });
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));

  const iconMap = {
    Java: BiLogoJava,
    "Spring Boot": BiLogoSpringBoot,
    ".NET": SiDotnet,
    PostgreSQL: BiLogoPostgresql,
    React: BiLogoReact,
    "HTML, CSS, JS": BiLogoHtml5,
    "Tailwind CSS": BiLogoTailwindCss,
    "ShadCN UI": SiShadcnui,
    Supabase: SiSupabase,
    Vite: SiVite,
    Git: FaGitAlt,
  };

  useEffect(() => {
    const section = document.getElementById("skills");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          skills.forEach((skill, index) => {
            setTimeout(() => {
              setAnimatedLevels((prev) => ({
                ...prev,
                [skill.name]: skill.level,
              }));
            }, 800 + index * 200);
          });
        } else {
          setIsVisible(false);
          setAnimatedLevels({});
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, [skills]);

  const getCategoryColor = (category) => {
    const colors = {
      frontend: "from-blue-500 to-cyan-500",
      backend: "from-green-500 to-emerald-500",
      database: "from-orange-500 to-red-500",
      tools: "from-purple-500 to-pink-500",
    };
    return colors[category] || "from-purple-500 to-pink-500";
  };

  return (
    <section id="skills" className="py-20 px-5 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl lg:text-5xl font-bold mb-6 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {t("title")}
          </h2>
          <p
            className={`text-xl text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {t("subtitle")}
          </p>
        </div>

        <div
          className={`px-4 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.play}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {skills.map((skill, index) => {
                const IconComponent = iconMap[skill.name];
                return (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="bg-gray-800 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 hover:bg-gray-700 group shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 h-full">
                      <div className="mb-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getCategoryColor(
                            skill.category
                          )} text-white transform group-hover:scale-105 transition-transform duration-300`}
                        >
                          {t(`categories.${skill.category}`)}
                        </span>
                      </div>

                      <div className="flex justify-center mb-4">
                        <div
                          className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center 
                  text-purple-400 group-hover:text-purple-300 
                  transition-all duration-300 transform 
                  group-hover:scale-110 group-hover:rotate-3"
                        >
                          <IconComponent className="w-10 h-10 text-gray-300" />
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors duration-300">
                        {skill.name}
                      </h3>

                      <p className="text-sm text-gray-400 group-hover:text-gray-300 mb-4 h-12 flex items-center justify-center transition-colors duration-300">
                        {skill.description}
                      </p>

                      <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${getCategoryColor(
                            skill.category
                          )} h-3 rounded-full transition-all duration-1000 ease-out relative`}
                          style={{
                            width: `${animatedLevels[skill.name] || 0}%`,
                            boxShadow: animatedLevels[skill.name]
                              ? "0 0 10px rgba(147, 51, 234, 0.5)"
                              : "none",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          Nivel
                        </span>
                        <span className="text-sm font-semibold text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
                          {animatedLevels[skill.name] || 0}%
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious className="hidden sm:flex bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 via-yellow-500 via-red-500 to-purple-500 bg-[length:300%_300%] animate-gradient-shift hover:scale-110 transition-transform border-0 text-white shadow-lg animate-rainbow-glow" />
            <CarouselNext className="hidden sm:flex bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 via-yellow-500 via-red-500 to-purple-500 bg-[length:300%_300%] animate-gradient-shift hover:scale-110 transition-transform border-0 text-white shadow-lg animate-rainbow-glow" />
          </Carousel>
        </div>

        <div
          className={`mt-12 flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {Object.entries(t("categories", { returnObjects: true })).map(
            ([key, value]) => (
              <div key={key} className="flex items-center space-x-2 group">
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(
                    key
                  )} transform group-hover:scale-125 transition-transform duration-300`}
                ></div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {value}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
