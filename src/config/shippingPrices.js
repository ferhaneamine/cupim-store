// src/config/shippingPrices.js
// Single source of truth for shipping prices (DA).
// domicile = Home Delivery, bureau = Post Office (stop-desk) delivery.

const SHIPPING_PRICES = {
  Adrar: { domicile: 1100, bureau: 750 },
  Chlef: { domicile: 700, bureau: 400 },
  Laghouat: { domicile: 900, bureau: 500 },
  'Oum El Bouaghi': { domicile: 850, bureau: 450 },
  Batna: { domicile: 850, bureau: 450 },
  'Béjaïa': { domicile: 800, bureau: 450 },
  Biskra: { domicile: 900, bureau: 550 },
  'Béchar': { domicile: 1000, bureau: 700 },
  Blida: { domicile: 600, bureau: 350 },
  Bouira: { domicile: 750, bureau: 450 },
  Tamanrasset: { domicile: 1550, bureau: 1100 },
  'Tébessa': { domicile: 850, bureau: 450 },
  Tlemcen: { domicile: 600, bureau: 400 },
  Tiaret: { domicile: 750, bureau: 400 },
  'Tizi Ouzou': { domicile: 700, bureau: 450 },
  Alger: { domicile: 500, bureau: 350 },
  Djelfa: { domicile: 900, bureau: 550 },
  Jijel: { domicile: 800, bureau: 450 },
  'Sétif': { domicile: 800, bureau: 450 },
  'Saïda': { domicile: 800, bureau: 400 },
  Skikda: { domicile: 750, bureau: 450 },
  'Sidi Bel Abbès': { domicile: 600, bureau: 400 },
  Annaba: { domicile: 800, bureau: 450 },
  Guelma: { domicile: 900, bureau: 450 },
  Constantine: { domicile: 800, bureau: 450 },
  'Médéa': { domicile: 700, bureau: 400 },
  Mostaganem: { domicile: 600, bureau: 400 },
  "M'Sila": { domicile: 900, bureau: 550 },
  Mascara: { domicile: 650, bureau: 400 },
  Ouargla: { domicile: 950, bureau: 550 },
  Oran: { domicile: 500, bureau: 300 },
  'El Bayadh': { domicile: 950, bureau: 700 },
  Illizi: { domicile: 1550, bureau: 1100 },
  'Bordj Bou Arréridj': { domicile: 800, bureau: 450 },
  'Boumerdès': { domicile: 700, bureau: 400 },
  'El Tarf': { domicile: 900, bureau: 450 },
  Tindouf: { domicile: 1300, bureau: 800 },
  Tissemsilt: { domicile: 800, bureau: 400 },
  'El Oued': { domicile: 1000, bureau: 600 },
  Khenchela: { domicile: 900, bureau: 500 },
  'Souk Ahras': { domicile: 900, bureau: 500 },
  Tipaza: { domicile: 700, bureau: 400 },
  Mila: { domicile: 750, bureau: 450 },
  'Aïn Defla': { domicile: 700, bureau: 400 },
  'Naâma': { domicile: 950, bureau: 550 },
  'Aïn Témouchent': { domicile: 600, bureau: 400 },
  'Ghardaïa': { domicile: 1000, bureau: 500 },
  Relizane: { domicile: 700, bureau: 400 },
  Timimoun: { domicile: 1100, bureau: 750 },
  'Ouled Djellal': { domicile: 900, bureau: 550 },
  'Béni Abbès': { domicile: 1100, bureau: 800 },
  'In Salah': { domicile: 1450, bureau: 1000 },
  Touggourt: { domicile: 1000, bureau: 550 },
  Djanet: { domicile: 2200, bureau: 1550 },
  "El M'Ghair": { domicile: 950, bureau: 650 },
  'El Meniaa': { domicile: 1000, bureau: 500 },
};

// Maps the DB / API delivery method names to the price field
const METHOD_FIELD = {
  'Home Delivery': 'domicile',
  'Post Office Delivery': 'bureau',
};

// Returns the price, or null if the wilaya / method is unknown
const getShippingCost = (wilaya, deliveryMethod) => {
  const field = METHOD_FIELD[deliveryMethod];
  const entry = SHIPPING_PRICES[wilaya];
  if (!field || !entry) return null;
  return entry[field];
};

module.exports = { SHIPPING_PRICES, getShippingCost };
