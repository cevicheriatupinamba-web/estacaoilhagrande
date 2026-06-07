import LongFormStub from "@/components/LongFormStub";
import { themedImage } from "@/lib/images";

const Experiencias = () => (
  <LongFormStub
    title="Experiências em Ilha Grande"
    seoTitle="Experiências em Ilha Grande — Mergulho, SUP, vivências caiçaras"
    seoDescription="Experiências autênticas em Ilha Grande: mergulho, stand-up paddle, observação de baleias, vivências caiçaras e expedições privadas."
    keywords="experiências ilha grande, mergulho ilha grande, stand up paddle ilha grande, vivência caiçara"
    path="/experiencias-ilha-grande"
    heroImage={themedImage("activity", "experiencias-hero")}
    intro="Experiências que vão além do roteiro turístico: mergulho, SUP, expedições privadas, vivências caiçaras e tours culturais."
    sections={[
      { h2: "Mergulho e snorkel", paragraphs: ["Ilha Grande é destino top para mergulho na costa fluminense. Operadoras credenciadas oferecem batismo, cursos e mergulhos guiados em pontos como Lagoa Azul, Lagoa Verde, Naufrágio do Pinguino e Saco do Céu."] },
      { h2: "Stand-up paddle e caiaque", paragraphs: ["Saídas de Abraão e Praia Preta com vista para a Pedra do Macaco. Ideal para iniciantes."] },
      { h2: "Vivências caiçaras", paragraphs: ["Visitas às comunidades de Provetá, Aventureiro e Praia do Sul para conhecer a cultura tradicional, pescaria artesanal e gastronomia local."] },
    ]}
    faqs={[
      { question: "Precisa saber nadar para mergulhar?", answer: "Para snorkel basta saber boiar. Para mergulho com cilindro, o instrutor avalia o conforto na água." },
      { question: "Tem passeio para observação de baleias?", answer: "Em algumas épocas do ano (junho a outubro), há passeios para avistamento." },
    ]}
    related={[
      { to: "/passeios-em-ilha-grande", label: "Passeios em Ilha Grande" },
      { to: "/o-que-fazer-em-ilha-grande", label: "O que fazer em Ilha Grande" },
      { to: "/trilhas-em-ilha-grande", label: "Trilhas em Ilha Grande" },
    ]}
    cta={{ label: "Ver experiências disponíveis", to: "/explorar?categoria=passeios" }}
  />
);

export default Experiencias;
