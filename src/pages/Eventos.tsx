import LongFormStub from "@/components/LongFormStub";
import { themedImage } from "@/lib/images";

const Eventos = () => (
  <LongFormStub
    title="Eventos em Ilha Grande"
    seoTitle="Eventos em Ilha Grande — Festas, festivais e agenda cultural"
    seoDescription="Agenda de eventos em Ilha Grande: festas tradicionais, shows, festivais gastronômicos e eventos culturais. Programe sua viagem."
    keywords="eventos ilha grande, festas ilha grande, festival ilha grande, agenda cultural ilha grande"
    path="/eventos-ilha-grande"
    heroImage={themedImage("nightlife", "eventos-hero")}
    intro="Festas tradicionais caiçaras, festivais gastronômicos, shows ao vivo e celebrações religiosas — descubra a vida cultural de Ilha Grande."
    sections={[
      { h2: "Principais eventos do ano", paragraphs: ["A Festa de São Pedro Pescador (junho), o Réveillon na Praia do Abraão e a Procissão de São Sebastião (janeiro) são as celebrações mais tradicionais. Há ainda festivais gastronômicos no inverno e shows ao vivo durante o verão."] },
      { h2: "Eventos da semana", paragraphs: ["A agenda semanal varia por estação. Em breve, organizadores e produtores poderão publicar diretamente na Estação Ilha Grande."] },
    ]}
    faqs={[
      { question: "Como saber dos eventos da semana?", answer: "Acompanhe esta página e nossas redes — em breve teremos calendário dinâmico atualizado." },
      { question: "Tem festivais gastronômicos?", answer: "Sim, geralmente no inverno (junho a setembro), com pratos típicos caiçaras." },
    ]}
    related={[
      { to: "/vida-noturna", label: "Vida noturna em Ilha Grande" },
      { to: "/onde-comer-em-ilha-grande", label: "Onde comer em Ilha Grande" },
    ]}
    cta={{ label: "Cadastrar um evento", to: "/cadastro-empresa" }}
  />
);

export default Eventos;
