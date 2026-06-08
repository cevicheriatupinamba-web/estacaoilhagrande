// Mapa curado de imagens específicas para itens conhecidos do portal.
// Garante coerência visual em praias, passeios, lagoas e transportes.

const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Imagens específicas de Ilha Grande / passeios / praias
export const TOUR_IMAGES: Record<string, string> = {
  "lopes-mendes": U("1589394815804-964ed0be2eb5"), // praia paradisíaca areia branca
  "praia-de-lopes-mendes": U("1589394815804-964ed0be2eb5"),
  "aventureiro": U("1602002418082-a4443e081dd1"), // coqueiro inclinado
  "praia-do-aventureiro": U("1602002418082-a4443e081dd1"),
  "parnaioca": U("1507525428034-b723cf961d3e"), // praia selvagem
  "saco-do-ceu": U("1505228395891-9a51e7e86bf6"), // enseada calma
  "vip-lancha": U("1520450202524-87afe6dc6312"), // lancha
  "passeio-vip-de-lancha": U("1520450202524-87afe6dc6312"),
  "meia-volta": U("1502602898657-3e91760cbb34"),
  "meia-volta-a-ilha": U("1502602898657-3e91760cbb34"),
  "volta-ilha": U("1544551763-46a013bb70d5"), // escuna aerea
  "volta-a-ilha": U("1544551763-46a013bb70d5"),
  "ilhas-angra": U("1493558103817-58b2924bce98"),
  "ilhas-paradisiacas": U("1473116763249-2faaef81ccda"),
  "super-sul": U("1519046904884-53103b34b206"),
  "lagoa-azul": U("1530631673369-bc20fdb32288"), // snorkel águas cristalinas
  "lagoa-azul-tour": U("1530631673369-bc20fdb32288"),
  "lagoa-verde": U("1520454974749-611b7248ffdb"),
  "gruta-acaia": U("1582979512210-99b6a53386f9"),
  "gruta-do-acaia": U("1582979512210-99b6a53386f9"),
  "escuna-classica": U("1544551763-46a013bb70d5"),
  "passeio-de-escuna": U("1544551763-46a013bb70d5"),
  "praia-da-feiticeira": U("1473116763249-2faaef81ccda"),
  "dois-rios": U("1507525428034-b723cf961d3e"),
  "praia-preta": U("1510414842594-a61c69b5ae57"),
  "abraaozinho": U("1506929562872-bb421503ef21"),
  "praia-de-palmas": U("1439130490301-25e322d88054"),
  "praia-do-caxadaco": U("1469854523086-cc02fe5d8800"),
  "praia-do-sul": U("1519046904884-53103b34b206"),
};

export const TRANSPORT_IMAGES = {
  ferry: U("1527431016-3ba47543e90c"),
  catamara: U("1473186578172-c141e6798cf4"),
  flexboat: U("1520450202524-87afe6dc6312"),
  taxiboat: U("1502602898657-3e91760cbb34"),
  escuna: U("1544551763-46a013bb70d5"),
  vanTransfer: U("1494976388531-d1058494cdd8"), // van/transfer terrestre
  conceicao: U("1449965408869-eaa3f722e40d"), // cais
  angra: U("1473186578172-c141e6798cf4"),
  mangaratiba: U("1527431016-3ba47543e90c"),
  hero: U("1502160462350-7b66a4fcc0a8"),
};

export const curatedTourImage = (slug: string, fallback: string): string =>
  TOUR_IMAGES[slug] || fallback;
