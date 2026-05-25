import { Info } from "lucide-react";

const Disclaimer = () => (
  <div className="container pb-10">
    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/60 border border-border rounded-2xl p-4">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
      <p>
        Informações baseadas em guias públicos de turismo; confirme horários, preços e disponibilidade
        diretamente com o estabelecimento.
      </p>
    </div>
  </div>
);

export default Disclaimer;
