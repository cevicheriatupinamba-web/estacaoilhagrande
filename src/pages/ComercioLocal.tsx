import LongFormStub from "@/components/LongFormStub";
import { themedImage } from "@/lib/images";

const ComercioLocal = () => (
  <LongFormStub
    title="Comércio local em Ilha Grande"
    seoTitle="Comércio local em Ilha Grande — Lojas, artesanato e serviços"
    seoDescription="Conheça o comércio local de Ilha Grande: lojas de artesanato, mercados, farmácias, lavanderias e serviços essenciais."
    keywords="comércio local ilha grande, lojas abraão, artesanato ilha grande, mercado ilha grande"
    path="/comercio-local-ilha-grande"
    heroImage={themedImage("guide", "comercio-hero")}
    intro="Apoiar o comércio local fortalece a comunidade caiçara. Veja onde encontrar mercados, farmácias, artesanato e serviços em Ilha Grande."
    sections={[
      { h2: "Mercados e farmácias", paragraphs: ["A Vila do Abraão concentra os principais mercados, farmácia e caixa eletrônico. Os preços são naturalmente mais altos por causa do frete pela balsa — leve o essencial do continente."] },
      { h2: "Artesanato e moda praia", paragraphs: ["Lojas de artesanato local com peças em fibras naturais, biojoias e ilustrações da ilha. Apoie produtores locais."] },
      { h2: "Serviços úteis", bullets: ["Lavanderias", "Aluguel de equipamentos (snorkel, caiaque)", "Bicicletaria", "Internet e coworking"], paragraphs: [] },
    ]}
    faqs={[
      { question: "Tem caixa eletrônico em Ilha Grande?", answer: "Sim, na Vila do Abraão. Mas é recomendável levar dinheiro do continente." },
      { question: "Aceitam cartão?", answer: "A maioria aceita cartão e PIX, mas algumas comunidades remotas só aceitam dinheiro." },
    ]}
    related={[
      { to: "/onde-comer-em-ilha-grande", label: "Onde comer em Ilha Grande" },
      { to: "/dicas", label: "Dicas para sua viagem" },
    ]}
    cta={{ label: "Cadastrar meu negócio", to: "/cadastro-empresa" }}
  />
);

export default ComercioLocal;
