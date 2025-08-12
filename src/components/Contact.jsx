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

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PHONE_REGEX = /^\+?[1-9]\d{0,14}$/;
  const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/; 
  const PHONE_INPUT_REGEX = /^[+]?[0-9]*$/; 

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
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("form.validation.minLength") || "Mínimo 2 caracteres";
    } else if (!NAME_REGEX.test(formData.name.trim())) {
      newErrors.name =
        t("form.validation.invalidName") || "Solo letras y espacios permitidos";
    }

  
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("form.validation.required");
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName =
        t("form.validation.minLength") || "Mínimo 2 caracteres";
    } else if (!NAME_REGEX.test(formData.lastName.trim())) {
      newErrors.lastName =
        t("form.validation.invalidLastName") ||
        "Solo letras y espacios permitidos";
    }


    if (!formData.email.trim()) {
      newErrors.email = t("form.validation.required");
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = t("form.validation.invalidEmail");
    }


    if (formData.phone.trim() && !PHONE_REGEX.test(formData.phone.trim())) {
      newErrors.phone =
        t("form.validation.invalidPhone") || "Formato de teléfono inválido";
    }


    if (!formData.message.trim()) {
      newErrors.message = t("form.validation.required");
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        t("form.validation.messageMinLength") ||
        "El mensaje debe tener al menos 10 caracteres";
    } else if (formData.message.trim().length > 1000) {
      newErrors.message =
        t("form.validation.messageMaxLength") ||
        "El mensaje no puede exceder 1000 caracteres";
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
    let processedValue = value;


    switch (field) {
      case "name":
      case "lastName":
     
        if (value && !NAME_REGEX.test(value)) {
          return; 
        }

        processedValue = value
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");
        break;

      case "email":

        processedValue = value.toLowerCase().replace(/\s/g, "");
        break;

      case "phone":
 
        if (value && !PHONE_INPUT_REGEX.test(value)) {
          return; 
        }

        if (value.length > 16) {
          return;
        }
        break;

      case "message":

        if (value.length > 1000) {
          return;
        }
        break;

      default:
        break;
    }

    setFormData({ ...formData, [field]: processedValue });


    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handlePhonePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanedText = pastedText.replace(/[^\d+]/g, ""); 

    if (cleanedText.length <= 16 && PHONE_INPUT_REGEX.test(cleanedText)) {
      handleInputChange("phone", cleanedText);
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
                    maxLength="50"
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
                    maxLength="50"
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
                    maxLength="100"
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
                    onPaste={handlePhonePaste}
                    maxLength="16"
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-colors ${
                      errors.phone ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {t("form.hints.phone") ||
                      "Formato: +1234567890 o 1234567890"}
                  </p>
                </div>
              </div>

              <div
                className={`transition-all duration-500 delay-600 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="relative">
                  <textarea
                    rows="6"
                    placeholder={t("form.placeholders.message")}
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    maxLength="1000"
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-colors resize-none ${
                      errors.message ? "border-red-500" : "border-gray-700"
                    }`}
                  ></textarea>
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {formData.message.length}/1000
                  </div>
                </div>
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
