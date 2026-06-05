import { useLanguage, Lang } from "@/context/LanguageContext";

const options: { code: Lang; flag: string; label: string }[] = [
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
];

const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { lang, setLang } = useLanguage();
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {options.map((o) => (
        <button
          key={o.code}
          onClick={() => setLang(o.code)}
          aria-label={o.label}
          title={o.label}
          className={`text-lg leading-none p-1.5 rounded-md transition-smooth hover:bg-muted ${
            lang === o.code ? "ring-2 ring-primary bg-primary/10" : "opacity-70 hover:opacity-100"
          }`}
        >
          <span aria-hidden>{o.flag}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
