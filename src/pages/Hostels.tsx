import LongFormStub from "@/components/LongFormStub";
import { themedImage } from "@/lib/images";

const Hostels = () => (
  <LongFormStub
    title="Hostels em Ilha Grande"
    seoTitle="Hostels em Ilha Grande — Os melhores hostels da Vila do Abraão"
    seoDescription="Guia completo dos hostels em Ilha Grande: preços, localização, café da manhã, ambiente e dicas para mochileiros. Reserve com segurança pela Estação Ilha Grande."
    keywords="hostels em ilha grande, hostel abraão, ilha grande mochileiro, hospedagem barata ilha grande, dormitório ilha grande"
    path="/hostels-ilha-grande"
    heroImage={themedImage("lodging", "hostels-hero")}
    intro="Os melhores hostels de Ilha Grande para mochileiros, viajantes solo e quem busca economia sem abrir mão da experiência."
    sections={[
      {
        h2: "Por que escolher um hostel em Ilha Grande",
        paragraphs: [
          "Os hostels da Vila do Abraão concentram boa parte dos viajantes jovens que chegam a Ilha Grande. Eles oferecem o melhor custo-benefício, ambiente social e proximidade do cais — facilitando o acesso a passeios de barco, trilhas e restaurantes.",
          "A maioria dos hostels conta com café da manhã, cozinha compartilhada, wi-fi e organiza grupos para Lopes Mendes, Lagoa Azul, Aventureiro e a famosa volta à ilha de barco.",
        ],
      },
      {
        h2: "O que considerar na hora de reservar",
        bullets: [
          "Distância do cais (idealmente menos de 10 minutos a pé)",
          "Avaliação dos hóspedes em quartos compartilhados",
          "Café da manhã incluso e cozinha disponível",
          "Tomadas e armários individuais",
          "Programação de passeios em grupo",
        ],
        paragraphs: [],
      },
      {
        h2: "Bairros e regiões",
        paragraphs: [
          "Vila do Abraão concentra a maioria dos hostels. Algumas opções estão em comunidades como Provetá e Aventureiro, voltadas para uma experiência mais isolada e contato com famílias caiçaras.",
        ],
      },
    ]}
    faqs={[
      { question: "Hostel em Ilha Grande tem café da manhã?", answer: "A maioria dos hostels da Vila do Abraão inclui café da manhã simples (pães, frutas, café, suco)." },
      { question: "Quanto custa em média um hostel em Ilha Grande?", answer: "Cama em dormitório varia de R$ 80 a R$ 180 em baixa temporada e R$ 150 a R$ 280 em alta temporada." },
      { question: "Precisa reservar com antecedência?", answer: "Sim, principalmente em feriados, dezembro e janeiro. Recomenda-se reservar com 2 a 4 semanas." },
    ]}
    related={[
      { to: "/onde-ficar-em-ilha-grande", label: "Onde ficar em Ilha Grande" },
      { to: "/camping-ilha-grande", label: "Camping em Ilha Grande" },
      { to: "/pousadas-em-ilha-grande", label: "Pousadas em Ilha Grande" },
      { to: "/como-chegar-em-ilha-grande", label: "Como chegar em Ilha Grande" },
    ]}
    cta={{ label: "Ver hostels disponíveis", to: "/hospedagem" }}
  />
);

export default Hostels;
