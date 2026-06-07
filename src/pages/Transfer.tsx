import LongFormStub from "@/components/LongFormStub";
import { themedImage } from "@/lib/images";

const Transfer = () => (
  <LongFormStub
    title="Transfer para Ilha Grande"
    seoTitle="Transfer para Ilha Grande — Rio, SP, Angra, Conceição"
    seoDescription="Transfer porta a porta para Ilha Grande saindo do Rio, SP, Angra dos Reis e Conceição de Jacareí. Vans, barcos e horários."
    keywords="transfer ilha grande, transfer rio ilha grande, transfer sp ilha grande, conceição de jacareí, angra ilha grande"
    path="/transfer-ilha-grande"
    heroImage={themedImage("transport", "transfer-hero")}
    intro="Todas as opções de transfer porta a porta para Ilha Grande: saídas do Rio, São Paulo, Angra dos Reis e Conceição de Jacareí."
    sections={[
      { h2: "Saídas do Rio de Janeiro", paragraphs: ["Vans saem de pontos centrais (Zona Sul, Aeroporto Galeão e Santos Dumont) com destino a Angra dos Reis ou Conceição de Jacareí, conectando ao barco para Ilha Grande. A viagem total leva de 3h30 a 4h30."] },
      { h2: "Saídas de São Paulo", paragraphs: ["Ônibus rodoviários saem do Tietê para Angra dos Reis. De lá, segue-se de barco até Abraão. Vans de turismo também fazem o trajeto direto."] },
      { h2: "De Angra dos Reis e Conceição de Jacareí", paragraphs: ["São os portos mais próximos. De Conceição de Jacareí o barco rápido leva cerca de 25 minutos até Abraão. De Angra, a barca leva 1h30."] },
    ]}
    faqs={[
      { question: "Quanto custa um transfer do Rio para Ilha Grande?", answer: "Em média R$ 180 a R$ 280 por pessoa, incluindo van e barco." },
      { question: "Tem transfer direto da Rodoviária Novo Rio?", answer: "Sim, várias empresas operam saídas diárias." },
    ]}
    related={[
      { to: "/como-chegar-em-ilha-grande", label: "Como chegar em Ilha Grande" },
      { to: "/onde-ficar-em-ilha-grande", label: "Onde ficar em Ilha Grande" },
    ]}
    cta={{ label: "Falar com um transfer parceiro", to: "/explorar?categoria=transporte" }}
  />
);

export default Transfer;
