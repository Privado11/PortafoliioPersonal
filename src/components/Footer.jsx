import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useTranslation("common");

  const social = t("socialList", { returnObjects: true });

   const iconMap = {
     Linkedin: FaLinkedin,
     Github: FaGithub,
   };

  const scrollToHome = () => {
    const element = document.getElementById("home");
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
    <footer className="bg-gray-900 py-12 px-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Button
              onClick={scrollToHome}
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-400 transition-all duration-300 cursor-pointer"
            >
              {t("brand.fullName")}
            </Button>
          </div>

          <div className="flex justify-center md:justify-end items-center space-x-6">
            <div className="flex space-x-4">
              {social.map((social, index) => {
                const IconComponent = iconMap[social.icon];
                return (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-800 hover:bg-purple-600 transition-colors group"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {year} {t("brand.fullName")}. {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
