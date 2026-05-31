// Curadoria premium de imagens — Unsplash CDN
// Lifestyle, humanizadas, clima tropical, padrão editorial.

const U = "https://images.unsplash.com/photo-";
const P = "?auto=format&fit=crop&w=1400&q=80";
const u = (id: string) => `${U}${id}${P}`;

export const imagePools = {
  // Pousadas, hotéis boutique, varandas, piscinas, redes, café da manhã tropical
  lodging: [
    u("1566073771259-6a8506099945"), // boutique hotel room
    u("1582719508461-905c673771fd"), // tropical pool
    u("1540541338287-41700207dee6"), // poolside palm
    u("1571896349842-33c89424de2d"), // cozy bedroom
    u("1611892440504-42a792e24d32"), // hammock ocean
    u("1520250497591-112f2f40a3f4"), // pool deck
    u("1505691938895-1758d7feb511"), // boutique interior
    u("1551882547-ff40c63fe5fa"), // hotel veranda ocean
    u("1542314831-068cd1dbfeeb"), // bed natural light
    u("1444201983204-c43cbd584d93"), // tropical breakfast
    u("1535827841776-24afc1e255ac"), // resort pool palms
    u("1519449556851-5720b33024e7"), // beach bungalow
    u("1591088398332-8a7791972843"), // outdoor shower
    u("1564501049412-61c2a3083791"), // luxe bedroom
  ],
  // Restaurantes à beira-mar, frutos do mar, drinks tropicais, casais jantando
  restaurant: [
    u("1414235077428-338989a2e8c0"), // table candlelight
    u("1555396273-367ea4eb4db5"), // pasta
    u("1559339352-11d035aa65de"), // cocktail bar
    u("1551218808-94e220e084d2"), // pizza
    u("1559925393-8be0ec4767c8"), // tropical cocktail
    u("1467003909585-2f8a72700288"), // seafood paella
    u("1504674900247-0877df9cc836"), // gourmet plate
    u("1517248135467-4c7edcad34c4"), // couple dining sunset
    u("1572715376701-98568319fd0b"), // beach restaurant
    u("1559847844-5315695dadae"), // bar drinks
    u("1473093295043-cdd812d0e601"), // seafood platter
  ],
  // Praias paradisíacas, areia branca, pessoas relaxando, drone shots
  beach: [
    u("1507525428034-b723cf961d3e"), // turquoise beach
    u("1519046904884-53103b34b206"), // aerial beach
    u("1493558103817-58b2924bce98"), // aerial island
    u("1506929562872-bb421503ef21"), // crystal water
    u("1473116763249-2faaef81ccda"), // beach palms
    u("1439130490301-25e322d88054"), // tropical bay
    u("1510414842594-a61c69b5ae57"), // hidden beach
    u("1520454974749-611b7248ffdb"), // turquoise lagoon
    u("1535262971-45e1b9e8f5b6"), // beach footprints
    u("1505228395891-9a51e7e86bf6"), // couple beach walk
    u("1469854523086-cc02fe5d8800"), // top-down beach
  ],
  // Trilhas, mata atlântica, cachoeiras, mirantes
  hike: [
    u("1551632811-561732d1e306"), // hiker summit
    u("1464822759023-fed622ff2c3b"), // forest trail
    u("1533692328991-08159ff19fca"), // waterfall jungle
    u("1542202229-7d93c33f5d07"), // mountain view
    u("1448375240586-882707db888b"), // tropical forest path
    u("1469474968028-56623f02e42e"), // viewpoint sunrise
    u("1551632436-cbf8dd35adfa"), // hiker backpack
    u("1502780402662-acc01917a35b"), // jungle waterfall
    u("1518495973542-4542c06a5843"), // forest light
  ],
  // Vida noturna, bares, brindes, música ao vivo
  nightlife: [
    u("1514933651103-005eec06c04b"), // bar bartender
    u("1572116469696-31de0f17cc34"), // cheers night
    u("1470225620780-dba8ba36b745"), // live music
    u("1543007630-9710e4a00a20"), // night cocktail
    u("1551024709-8f23befc6f87"), // bar lights
    u("1571266028243-d220bc62b85f"), // beach bonfire
    u("1517457373958-b7bdd4587205"), // sunset drinks
    u("1533219346-d7b1ec8088b6"), // festival night
    u("1530103862676-de8c9debad1d"), // bar atmosphere
  ],
  // Passeios de barco, escunas, lanchas, snorkel
  boat: [
    u("1502602898657-3e91760cbb34"), // boat tropical
    u("1544551763-46a013bb70d5"), // schooner aerial
    u("1530631673369-bc20fdb32288"), // snorkel
    u("1473186578172-c141e6798cf4"), // marina sunset
    u("1564415637254-92c66292cf25"), // friends boat
    u("1505761671935-60b3a7427bad"), // boat anchored bay
    u("1567899378494-47b22a2ae96a"), // people swimming boat
    u("1520975916090-3105956dac38"), // yacht ocean
  ],
  // O que fazer — aventura, esportes aquáticos, exploração
  activity: [
    u("1530631673369-bc20fdb32288"), // snorkel
    u("1551632811-561732d1e306"), // hike summit
    u("1502602898657-3e91760cbb34"), // boat ride
    u("1502933691298-84fc14542831"), // kayak
    u("1571687949921-1306bfb24b72"), // SUP paddleboard
    u("1517457373958-b7bdd4587205"), // sunset
    u("1533692328991-08159ff19fca"), // waterfall
    u("1520454974749-611b7248ffdb"), // lagoon
    u("1559339352-11d035aa65de"), // gastronomy
  ],
  // Transporte — ferries, lanchas, marinas
  transport: [
    u("1527431016-3ba47543e90c"), // ferry boat
    u("1473186578172-c141e6798cf4"), // marina
    u("1502602898657-3e91760cbb34"), // boat tropical
    u("1520450202524-87afe6dc6312"), // speedboat ocean
    u("1507525428034-b723cf961d3e"), // turquoise water
    u("1449965408869-eaa3f722e40d"), // boat at pier
  ],
  // Guias locais — pessoas guiando, mapas, mergulho, trilhas
  guide: [
    u("1464822759023-fed622ff2c3b"), // trail guide forest
    u("1469854523086-cc02fe5d8800"), // map planning
    u("1502602898657-3e91760cbb34"), // captain boat
    u("1530538987395-032d1800fdd4"), // diver underwater
    u("1488646953014-85cb44e25828"), // tourist exploring
    u("1551632436-cbf8dd35adfa"), // hiker backpack
  ],
  // Dicas — turistas, mapas, planejamento
  tips: [
    u("1469854523086-cc02fe5d8800"), // map travel
    u("1521295121783-8a321d551ad2"), // travel phone
    u("1488646953014-85cb44e25828"), // tourist exploring
    u("1452421822248-d4c2b47f0c81"), // backpack travel
  ],
  // Hero / banners principais
  hero: [
    u("1544551763-46a013bb70d5"), // schooner aerial
    u("1502160462350-7b66a4fcc0a8"), // tropical island aerial
    u("1519046904884-53103b34b206"), // beach aerial
    u("1505228395891-9a51e7e86bf6"), // couple beach
  ],
} as const;

export type ImageCategory = keyof typeof imagePools;

// Picker determinístico por seed — mesma seed sempre devolve a mesma imagem
export const themedImage = (category: ImageCategory, seed: string | number = ""): string => {
  const pool = imagePools[category];
  const s = String(seed);
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length];
};
