import axios from "axios";
import { Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const Contact = ({ errors, setErrors }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation("contact");

  useEffect(() => {
    const section = document.getElementById("contact");
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
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("form.validation.required");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("form.validation.required");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("form.validation.required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("form.validation.invalidEmail");
    }
    if (!formData.message.trim()) {
      newErrors.message = t("form.validation.required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const pingServerEndpoint = async () => {
      try {
        await axios.get("https://servidor-web-correos.onrender.com/ping");
      } catch (error) {}
    };

    pingServerEndpoint();

    const pingServer = setInterval(pingServerEndpoint, 300000);

    return () => clearInterval(pingServer);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await axios.post(
        "https://servidor-web-correos.onrender.com/enviar-correo",
        formData
      );

      setFormData({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });

      setIsSubmitting(false);

      toast.success(t("form.status.success"));
    } catch (error) {
      toast.error(t("form.status.error"));
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <section
      id="contact"
      className="py-20 px-5 bg-gradient-to-r from-purple-900/50 to-pink-900/50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div
            className={`contact-form transition-all duration-500 relative z-20 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-16"
            }`}
          >
            <div className="text-center lg:text-left mb-12">
              <h2
                className={`text-4xl lg:text-5xl font-bold mb-6 transition-all duration-500 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {t("title")}
              </h2>
              <p
                className={`text-xl text-gray-300 transition-all duration-500 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {t("subtitle")}
              </p>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-6 relative z-30"
            >
              <div
                className={`grid md:grid-cols-2 gap-6 transition-all duration-500 delay-400 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div>
                  <input
                    type="text"
                    placeholder={t("form.placeholders.name")}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-colors ${
                      errors.name ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder={t("form.placeholders.lastName")}
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-colors ${
                      errors.lastName ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`grid md:grid-cols-2 gap-6 transition-all duration-500 delay-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div>
                  <input
                    type="email"
                    placeholder={t("form.placeholders.email")}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-colors ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder={t("form.placeholders.phone")}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
              </div>

              <div
                className={`transition-all duration-500 delay-600 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <textarea
                  rows="6"
                  placeholder={t("form.placeholders.message")}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-colors ${
                    errors.message ? "border-red-500" : "border-gray-700"
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <div
                className={`transition-all duration-500 delay-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 px-8 py-4 rounded-lg font-medium transition-all duration-500 transform hover:scale-105 disabled:transform-none relative z-40 ${
                    isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {isSubmitting
                    ? t("form.buttons.sending")
                    : t("form.buttons.send")}
                </button>
              </div>
            </form>
          </div>


          <div
            className={`hidden lg:flex justify-center transition-all duration-500 delay-300 relative z-10 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-16"
            }`}
          >
            <div className="relative">
              <div
                className={`w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-500 ${
                  isVisible ? "animate-pulse" : ""
                }`}
              >
                <Mail
                  className={`w-24 h-24 text-purple-400 transition-all duration-500 ${
                    isVisible ? "animate-bounce" : "scale-75 opacity-50"
                  }`}
                />
              </div>

              <div
                className={`absolute inset-0 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full transition-all duration-500 ${
                  isVisible ? "animate-ping opacity-75" : "opacity-0 scale-0"
                }`}
              ></div>

              <div
                className={`absolute inset-4 w-72 h-72 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full transition-all duration-500 delay-500 ${
                  isVisible ? "animate-ping opacity-50" : "opacity-0 scale-0"
                }`}
              ></div>
            </div>
          </div>


          <div className="lg:hidden flex justify-center py-8">
            <div className="relative z-10">
              <Mail
                className={`w-16 h-16 text-purple-400 transition-all duration-500 ${
                  isVisible ? "animate-pulse" : "opacity-50"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
