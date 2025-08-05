import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

import Banner from "./components/Banner";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

function App() {
  const [errors, setErrors] = useState({});
  return (
    <>
      <NavBar setErrors={setErrors} />
      <Banner />
      <Skills />
      <Projects />
      <Contact errors={errors} setErrors={setErrors} />
      <Footer />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            color: "white",
            backdropFilter: "blur(10px)",
          },
        }}
      />
    </>
  );
}

export default App;
