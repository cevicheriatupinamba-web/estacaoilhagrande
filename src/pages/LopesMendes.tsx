import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Sparkles, Sun, Backpack, AlertTriangle, Footprints, Ship } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import LocationMap from "@/components/LocationMap";
import { articleLd, touristAttractionLd } from "@/lib/jsonld";
import { TOUR_IMAGES } from "@/lib/curatedImages";

const HERO = TOUR_IMAGES["lopes-mendes"];
const PATH = "/praias/lopes-mendes";

const FAQS = [
  {
    question: "Como chegar à Praia de Lopes Mendes?",
    answer:
      "Saindo da Vila do Abraão, pegue um barco-táxi ou escuna até a Praia do Pouso (cerca de 40 minutos). De lá são 20 a 25 minutos de trilha leve pela mata atlântica até Lopes Mendes. A alternativa é a trilha T02, que sai do Abraão e leva de 2h30 a 3h.",
  },
  {
    question: "Quanto custa o passeio para Lopes Mendes?",
    answer:
      "O barco até o Pouso custa em média R$ 40 a R$ 60 ida e volta. Em escunas que incluem outras paradas (Lagoa Azul, Lagoa Verde, Lopes Mendes), o valor fica entre R$ 80 e R$ 120 por pessoa.",
  },
  {
    question: "Qual a melhor época para visitar Lopes Mendes?",
    answer:
      "De abril a setembro o mar fica mais transparente e há menos chuva. Dezembro a março é alta temporada — praia mais cheia, mas com águas quentes e dias longos.",
  },
  {
    question: "Lopes Mendes tem estrutura, quiosques e banheiros?",
    answer:
      "Não. Lopes Mendes é uma praia preservada, dentro do Parque Estadual da Ilha Grande, sem quiosques, banheiros ou vendedores ambulantes. Leve água, lanche e protetor solar do Abraão.",
  },
  {
    question: "Vale a pena fazer a trilha T02 para Lopes Mendes?",
    answer:
      "Sim, para quem gosta de trekking. A trilha T02 tem cerca de 6 km, dificuldade moderada, passa pela Praia do Mangues e oferece vistas espetaculares. A maioria dos turistas prefere ir de barco e voltar pela trilha.",
  },
  {
    question: "Posso acampar em Lopes Mendes?",
    answer:
      "Não é permitido acampar na praia — é área protegida. O camping mais próximo fica no Pouso ou no Abraão.",
  },
];

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <section className="scroll-mt-24">
    <h2 className="font-display font-black text-2xl md:text-3xl mb-4 flex items-center gap-2">
      <Icon className="w-6 h-6 text-primary" /> {title}
    </h2>
    <div className="prose prose-slate max-w-none text-foreground/90 leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

const LopesMendes = () => {
  const description =
    "Guia completo da Praia de Lopes Mendes em Ilha Grande (RJ): como chegar de barco e pela trilha, melhor época, o que levar, dicas de turistas, mapa interativo em visão de satélite e FAQ.";

  const jsonLd = [
    articleLd({
      headline: "Praia de Lopes Mendes em Ilha Grande: guia completo (2026)",
      description,
      path: PATH,
      image: HERO,
    }),
    touristAttractionLd({
      name: "Praia de Lopes Mendes",
      description:
        "Praia paradisíaca de areia branca fininha e mar azul-turquesa, considerada uma das mais bonitas do Brasil. Localizada no lado oceânico da Ilha Grande, dentro do Parque Estadual.",
      path: PATH,
      image: HERO,
      lat: -23.1858,
      lng: -44.1394,
    }),
  ];

  return (
    <>
      <SEO
        title="Lopes Mendes: guia da praia mais famosa de Ilha Grande"
        description={description}
        path={PATH}
        image={HERO}
        keywords="praia de lopes mendes, lopes mendes ilha grande, como chegar lopes mendes, trilha lopes mendes, passeio lopes mendes, melhor época lopes mendes, dicas lopes mendes"
        breadcrumbs={[
          { name: "Praias de Ilha Grande", path: "/praias-de-ilha-grande" },
          { name: "Lopes Mendes", path: PATH },
        ]}
        faqs={FAQS}
        jsonLd={jsonLd}
      />
      <Breadcrumbs
        items={[
          { name: "Praias", path: "/praias-de-ilha-grande" },
          { name: "Lopes Mendes", path: PATH },
        ]}
      />

      {/* HERO */}
      <section className="relative h-[58vh] min-h-[420px] overflow-hidden">
        <img
          src={HERO}
          alt="Praia de Lopes Mendes em Ilha Grande, areia branca e mar azul-turquesa"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
        <div className="container relative z-10 h-full flex flex-col justify-end pb-10 text-primary-foreground">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-sun mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Guia oficial · Estação Ilha Grande
          </span>
          <h1 className="font-display font-black text-4xl md:text-6xl leading-tight drop-shadow-lg max-w-3xl">
            Praia de Lopes Mendes
          </h1>
          <p className="text-base md:text-lg mt-2 max-w-2xl opacity-95">
            A praia mais famosa da Ilha Grande — areia branca fininha, mar azul-turquesa e 3 km de paraíso preservado.
          </p>
        </div>
      </section>

      {/* INTRO + TOC */}
      <div className="container py-10 grid lg:grid-cols-[1fr_280px] gap-10">
        <article className="space-y-10">
          <Section icon={Sparkles} title="Por que Lopes Mendes é especial">
            <p>
              Eleita várias vezes como uma das praias mais bonitas do mundo pela revista Vogue e pelo
              Travel + Leisure, <strong>Lopes Mendes</strong> fica no lado oceânico da Ilha Grande,
              em Angra dos Reis (RJ). São quase 3 km de areia branca tão fina que range ao caminhar,
              cercados por mata atlântica preservada e ondas perfeitas para surfar.
            </p>
            <p>
              Por estar dentro do <strong>Parque Estadual da Ilha Grande</strong>, a praia não tem
              quiosques, vendedores ou construções — o que mantém o cenário praticamente intocado.
            </p>
          </Section>

          <Section icon={Ship} title="Como chegar a Lopes Mendes">
            <p>Existem três formas de chegar:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Barco-táxi até Pouso + trilha (mais popular):</strong> saindo do cais do
                Abraão, o barco leva cerca de 40 minutos até a Praia do Pouso (R$ 40 a R$ 60 ida e
                volta). De lá são 20 a 25 minutos de trilha leve pela mata até Lopes Mendes.
              </li>
              <li>
                <strong>Passeio de escuna com paradas (recomendado para quem tem 1 dia):</strong>
                escunas saem do Abraão de manhã e incluem Lagoa Azul, Lagoa Verde e Lopes Mendes,
                voltando no fim da tarde. Custo médio: R$ 80 a R$ 120 por pessoa.
              </li>
              <li>
                <strong>Trilha T02 desde o Abraão (para aventureiros):</strong> trilha de 6 km e
                cerca de 2h30 a 3h, com dificuldade moderada, passando pela Praia dos Mangues. O
                ideal é ir pela trilha e voltar de barco.
              </li>
            </ol>
            <p className="text-sm text-muted-foreground">
              <strong>Dica local:</strong> compre a passagem de barco direto no cais do Abraão na
              véspera ou logo cedo. Os primeiros barcos saem às 9h.
            </p>
          </Section>

          <Section icon={Footprints} title="Trilha de Lopes Mendes">
            <p>
              A trilha de Pouso a Lopes Mendes é tranquila — 1,8 km de subida e descida suave por
              dentro da mata atlântica, sombreada na maior parte do percurso. É possível fazer com
              chinelo, mas tênis leve é mais confortável.
            </p>
            <p>
              Já a trilha <strong>T02</strong>, que conecta o Abraão diretamente a Lopes Mendes,
              tem cerca de 6 km e exige preparo físico moderado. O percurso começa pela praia
              vermelha (Praia Preta), passa pela Praia dos Mangues e chega à ponta sul de Lopes
              Mendes. Leve 2 L de água por pessoa.
            </p>
          </Section>

          <Section icon={Sun} title="Melhor época para visitar">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Abril a setembro:</strong> mar mais transparente, menos chuva e
                temperatura agradável (20–28&nbsp;°C). Melhor janela para fotos.
              </li>
              <li>
                <strong>Dezembro a março:</strong> alta temporada — praia mais cheia, mas água
                quente (24–28&nbsp;°C) e dias longos até as 19h.
              </li>
              <li>
                <strong>Junho e julho:</strong> mar pode ficar agitado por frentes frias; ótimo
                para surf.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Evite ir em dias de previsão de chuva forte — a trilha fica escorregadia e o mar
              perde a cor turquesa.
            </p>
          </Section>

          <Section icon={Backpack} title="O que levar para Lopes Mendes">
            <ul className="grid sm:grid-cols-2 gap-2 list-disc pl-5">
              <li>Água (mínimo 1,5 L por pessoa)</li>
              <li>Protetor solar biodegradável (FPS 50+)</li>
              <li>Repelente de insetos</li>
              <li>Chapéu, óculos e camiseta UV</li>
              <li>Lanche / frutas / barras de cereal</li>
              <li>Toalha leve e canga</li>
              <li>Tênis ou chinelo de borracha</li>
              <li>Saco para trazer o lixo de volta</li>
              <li>Dinheiro em espécie (não há sinal nem maquininha)</li>
              <li>Câmera ou celular com bateria extra</li>
            </ul>
          </Section>

          <Section icon={AlertTriangle} title="Dicas práticas para turistas">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Não há lixeiras na praia.</strong> Traga seu lixo de volta — a área é
                Parque Estadual.
              </li>
              <li>
                <strong>Atenção ao último barco</strong> de retorno do Pouso ao Abraão: geralmente
                às 17h. Confirme o horário com o barqueiro na hora de embarcar.
              </li>
              <li>
                Lopes Mendes tem <strong>ondas e correnteza</strong>. Crianças e nadadores
                inexperientes devem ficar próximos da areia.
              </li>
              <li>
                Não existe sinal de celular. Combine ponto de encontro com seu grupo antes de
                descer da trilha.
              </li>
              <li>
                Em alta temporada, chegue cedo (até 10h) para curtir a praia menos lotada.
              </li>
            </ul>
          </Section>

          <Section icon={MapPin} title="Localização e mapa interativo">
            <LocationMap
              name="Praia de Lopes Mendes"
              location="Ilha Grande, Angra dos Reis, RJ"
              lat={-23.1858}
              lng={-44.1394}
              showTitle={false}
            />
            <p className="text-sm text-muted-foreground">
              Coordenadas aproximadas: -23.1858, -44.1394. Lopes Mendes fica no lado oceânico
              (sudeste) da Ilha Grande, a aproximadamente 6 km da Vila do Abraão.
            </p>
          </Section>

          <Section icon={Clock} title="Roteiro sugerido de 1 dia">
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>8h30 — café da manhã no Abraão</li>
              <li>9h00 — embarque no barco ou escuna</li>
              <li>9h45 — desembarque no Pouso</li>
              <li>10h00 — trilha leve até Lopes Mendes (25 min)</li>
              <li>10h30 às 15h30 — praia, banho de mar e fotos</li>
              <li>15h45 — trilha de volta ao Pouso</li>
              <li>16h30 — embarque para o Abraão</li>
              <li>17h15 — chegada ao Abraão</li>
            </ol>
          </Section>

          <Section icon={Sparkles} title="Perguntas frequentes">
            <div className="space-y-3 not-prose">
              {FAQS.map((f) => (
                <details key={f.question} className="rounded-xl border border-border bg-card p-4">
                  <summary className="font-semibold cursor-pointer">{f.question}</summary>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </Section>

          {/* CTA final */}
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-secondary to-background p-8 border border-border">
            <h3 className="font-display font-black text-2xl mb-2">
              Reserve seu passeio para Lopes Mendes
            </h3>
            <p className="text-muted-foreground mb-4">
              Compare escunas, lanchas privativas e barcos-táxi de agências verificadas no portal.
            </p>
            <Link
              to="/passeios-para-lopes-mendes"
              aria-label="Ver passeios e agências que levam para Lopes Mendes"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              Ver passeios para Lopes Mendes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </article>

        {/* TOC sidebar */}
        <aside className="hidden lg:block sticky top-24 self-start space-y-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h4 className="font-display font-bold mb-3">Resumo do guia</h4>
            <ul className="space-y-1.5 text-sm">
              <li>• Como chegar (barco + trilha)</li>
              <li>• Trilhas disponíveis</li>
              <li>• Melhor época</li>
              <li>• O que levar</li>
              <li>• Dicas práticas</li>
              <li>• Mapa em satélite</li>
              <li>• Roteiro de 1 dia</li>
              <li>• Perguntas frequentes</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Distância do Abraão:</strong> ~6 km
            </p>
            <p>
              <strong className="text-foreground">Tempo de barco:</strong> 40 min
            </p>
            <p>
              <strong className="text-foreground">Trilha do Pouso:</strong> 25 min (1,8 km)
            </p>
            <p>
              <strong className="text-foreground">Estrutura:</strong> nenhuma (área protegida)
            </p>
          </div>
        </aside>
      </div>
    </>
  );
};

export default LopesMendes;
