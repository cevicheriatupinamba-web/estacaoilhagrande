import LongFormStub from "@/components/LongFormStub";
import { themedImage } from "@/lib/images";

const MelhorEpoca = () => (
  <LongFormStub
    title="Melhor época para visitar Ilha Grande"
    seoTitle="Melhor época para visitar Ilha Grande — Clima e temporadas"
    seoDescription="Veja a melhor época para visitar Ilha Grande: clima por mês, alta e baixa temporada, preços e movimento."
    keywords="melhor época ilha grande, clima ilha grande, alta temporada ilha grande, baixa temporada ilha grande"
    path="/melhor-epoca-para-visitar-ilha-grande"
    heroImage={themedImage("beach", "epoca-hero")}
    intro="Clima, temporadas e o melhor momento do ano para visitar Ilha Grande conforme seu perfil de viagem."
    sections={[
      { h2: "Alta temporada (dezembro a fevereiro)", paragraphs: ["Calor intenso, dias longos e vida noturna agitada. Ilha cheia, preços mais altos e reservas com antecedência são essenciais."] },
      { h2: "Meia temporada (março, abril, outubro, novembro)", paragraphs: ["Clima ainda quente, mar estável e menos movimento. Considerada por muitos como a melhor época custo-benefício."] },
      { h2: "Baixa temporada (maio a setembro)", paragraphs: ["Temperaturas amenas, possibilidade de chuvas, mar mais frio. Ótimo para trilhas e quem busca tranquilidade. Preços mais baixos."] },
    ]}
    faqs={[
      { question: "Chove muito em Ilha Grande?", answer: "Sim, é mata atlântica preservada. Chuvas podem ocorrer em qualquer época, mais frequentes de dezembro a março." },
      { question: "Posso ir no inverno?", answer: "Sim. O mar fica mais frio, mas as trilhas estão excelentes e a ilha está vazia." },
    ]}
    related={[
      { to: "/como-chegar-em-ilha-grande", label: "Como chegar em Ilha Grande" },
      { to: "/onde-ficar-em-ilha-grande", label: "Onde ficar em Ilha Grande" },
      { to: "/o-que-fazer-em-ilha-grande", label: "O que fazer em Ilha Grande" },
    ]}
  />
);

export default MelhorEpoca;
