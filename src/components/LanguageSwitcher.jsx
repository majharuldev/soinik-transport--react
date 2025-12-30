
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("bn");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") ;
    if (savedLang && savedLang !== lang) {
      i18n.changeLanguage(savedLang);
      setLang(savedLang);
    }else if (!savedLang) {
      i18n.changeLanguage("bn"); // default Bangla
      localStorage.setItem("lang", "bn");
      setLang("bn");
    }
  }, [i18n]);

  const toggleLanguage = () => {
    const newLang = lang === "bn" ? "en" : "bn";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    setLang(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 border rounded-md text-sm font-medium hover:bg-primary hover:text-white transition flex gap-2 items-center"
    >
     {/* Flag Icon */}
      
        {lang === "bn" ? <img width={20} src="https://i.ibb.co.com/8gt0hPd9/united-states.png" alt="GB"/> : <img width={20} src="https://i.ibb.co.com/WNBt536S/bangladesh.png" alt="bd"/>}
    
      {lang === "bn" ? "EN" : "বাংলা"}
    </button>
  );
}

