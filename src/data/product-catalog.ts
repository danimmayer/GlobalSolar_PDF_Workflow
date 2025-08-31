/**
 * Catálogo de produtos para sistema solar fotovoltaico
 * Baseado na planilha de produtos e serviços fornecida
 * Organizado por categorias para facilitar seleção no formulário
 */

export interface Product {
  id: string;
  description: string;
  unitPrice: number;
  category: 'placas' | 'inversor' | 'estrutura' | 'servicos';
  unit?: string;
}

export interface ServiceTier {
  minPlates: number;
  maxPlates: number;
  pricePerPlate: number;
}

/**
 * Catálogo completo de produtos para sistema solar
 * Preços em BRL conforme planilha fornecida
 */
export const PRODUCT_CATALOG: Product[] = [
  // PLACAS SOLARES
  {
    id: 'placa-590w-4mm',
    description: 'KIT PLACA 590W 4MM',
    unitPrice: 630.00,
    category: 'placas',
    unit: 'un'
  },
  {
    id: 'placa-590w-6mm',
    description: 'KIT PLACA 590W 6MM',
    unitPrice: 650.00,
    category: 'placas',
    unit: 'un'
  },
  {
    id: 'placa-555w-nacional-4mm',
    description: 'KIT PLACA 555W - Nacional 4MM',
    unitPrice: 850.00,
    category: 'placas',
    unit: 'un'
  },
  {
    id: 'placa-555w-nacional-6mm',
    description: 'KIT PLACA 555W - Nacional 6MM',
    unitPrice: 880.00,
    category: 'placas',
    unit: 'un'
  },
  {
    id: 'placa-610w-4mm',
    description: 'KIT PLACA 610W 4MM',
    unitPrice: 930.00,
    category: 'placas',
    unit: 'un'
  },
  {
    id: 'placa-610w-6mm',
    description: 'KIT PLACA 610W 6MM',
    unitPrice: 950.00,
    category: 'placas',
    unit: 'un'
  },

  // INVERSORES
  {
    id: 'inversor-3kw-mono',
    description: 'KIT INVERSOR 3KW (S) - MONO',
    unitPrice: 1500.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-3kw-c-mono',
    description: 'KIT INVERSOR 3KW ( C ) - MONO',
    unitPrice: 1900.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-5kw-mono',
    description: 'KIT INVERSOR 5KW (S) - MONO',
    unitPrice: 2300.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-5kw-c-mono',
    description: 'KIT INVERSOR 5KW( C ) - MONO',
    unitPrice: 2500.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-7-5kw-mono',
    description: 'KIT INVERSOR 7,5KW (S) - MONO',
    unitPrice: 3100.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-7-5kw-c-mono',
    description: 'KIT INVERSOR 7,5KW ( C ) - MONO',
    unitPrice: 3500.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-10kw-mono',
    description: 'KIT INVERSOR 10KW (S) - MONO',
    unitPrice: 5300.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-10kw-c-mono',
    description: 'KIT INVERSOR 10KW ( C ) - MONO',
    unitPrice: 5800.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-12kw-s',
    description: 'KIT INVERSOR 12KW (S)',
    unitPrice: 6300.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-12kw-c',
    description: 'KIT INVERSOR 12KW (C)',
    unitPrice: 6800.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-15kw-s',
    description: 'KIT INVERSOR 15KW (S)',
    unitPrice: 7200.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-15kw-c',
    description: 'KIT INVERSOR 15KW (C)',
    unitPrice: 7600.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-25kw-s',
    description: 'KIT INVERSOR 25KW (S)',
    unitPrice: 8400.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-25kw-c',
    description: 'KIT INVERSOR 25KW (C)',
    unitPrice: 8900.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-36kw-s',
    description: 'KIT INVERSOR 36KW (S)',
    unitPrice: 9500.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-36kw-c',
    description: 'KIT INVERSOR 36KW (C)',
    unitPrice: 9950.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-40kw-s',
    description: 'KIT INVERSOR 40KW (S)',
    unitPrice: 10750.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-40kw-c',
    description: 'KIT INVERSOR 40KW (C)',
    unitPrice: 11800.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-75kw-s',
    description: 'KIT INVERSOR 75KW (S)',
    unitPrice: 25800.00,
    category: 'inversor',
    unit: 'un'
  },
  {
    id: 'inversor-75kw-c',
    description: 'KIT INVERSOR 75KW (C)',
    unitPrice: 27600.00,
    category: 'inversor',
    unit: 'un'
  },

  // ESTRUTURAS
  {
    id: 'estrutura-4m-fibrocimento',
    description: 'KIT ESTRUTURA 4M FIBROCIMENTO',
    unitPrice: 230.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'estrutura-2m-fibrocimento',
    description: 'KIT ESTRUTURA 2M FIBROCIMENTO',
    unitPrice: 130.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'estrutura-4m-mini-trilho',
    description: 'KIT ESTRUTURA 4M MINI TRILHO',
    unitPrice: 180.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'estrutura-2m-mini-trilho',
    description: 'KIT ESTRUTURA 2M MINI TRILHO',
    unitPrice: 99.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'estrutura-4m-colonial',
    description: 'KIT ESTRUTURA 4M COLONIAL',
    unitPrice: 260.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'estrutura-2m-colonial',
    description: 'KIT ESTRUTURA 2M COLONIAL',
    unitPrice: 160.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'estrutura-4m-cimento',
    description: 'KIT ESTRUTURA 4M CIMENTO',
    unitPrice: 240.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'estrutura-2m-cimento',
    description: 'KIT ESTRUTURA 2M CIMENTO',
    unitPrice: 150.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'estrutura-4m-laje',
    description: 'KIT ESTRUTURA 4M LAJE',
    unitPrice: 310.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'estrutura-2m-laje',
    description: 'KIT ESTRUTURA 2M LAJE',
    unitPrice: 180.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'kit-4-placas-solo-aco',
    description: 'KIT 4 PLACAS SOLO AÇO',
    unitPrice: 1450.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'kit-8-placas-solo-aco',
    description: 'KIT 8 PLACAS SOLO AÇO',
    unitPrice: 2300.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'kit-1-placa-solo-fibra',
    description: 'KIT 1 PLACAS SOLO FIBRA',
    unitPrice: 145.00,
    category: 'estrutura',
    unit: 'un'
  },
  {
    id: 'kit-1-placa-solo-cimento',
    description: 'KIT 1 PLACA SOLO CIMENTO',
    unitPrice: 145.00,
    category: 'estrutura',
    unit: 'un'
  }
];

/**
 * Tabela de preços para serviços de lavação por quantidade de placas
 * Baseada na planilha fornecida
 */
export const WASHING_SERVICE_TIERS: ServiceTier[] = [
  { minPlates: 1, maxPlates: 20, pricePerPlate: 15.00 },
  { minPlates: 21, maxPlates: 40, pricePerPlate: 12.00 },
  { minPlates: 41, maxPlates: 60, pricePerPlate: 10.00 },
  { minPlates: 61, maxPlates: 100, pricePerPlate: 9.00 },
  { minPlates: 101, maxPlates: 224, pricePerPlate: 8.00 },
  { minPlates: 225, maxPlates: 350, pricePerPlate: 6.00 },
  { minPlates: 351, maxPlates: 500, pricePerPlate: 5.00 },
  { minPlates: 501, maxPlates: 1000, pricePerPlate: 4.00 },
  { minPlates: 1001, maxPlates: Infinity, pricePerPlate: 3.00 }
];

/**
 * Calcula o preço do serviço de lavação baseado na quantidade de placas
 */
export function calculateWashingServicePrice(plateCount: number): number {
  const tier = WASHING_SERVICE_TIERS.find(
    t => plateCount >= t.minPlates && plateCount <= t.maxPlates
  );
  
  return tier ? tier.pricePerPlate * plateCount : 0;
}

/**
 * Filtra produtos por categoria
 */
export function getProductsByCategory(category: Product['category']): Product[] {
  return PRODUCT_CATALOG.filter(product => product.category === category);
}

/**
 * Busca produto por ID
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCT_CATALOG.find(product => product.id === id);
}

/**
 * Calcula valor total de uma lista de itens
 */
export function calculateTotalValue(items: Array<{ productId: string; quantity: number }>): number {
  return items.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product ? product.unitPrice * item.quantity : 0);
  }, 0);
}