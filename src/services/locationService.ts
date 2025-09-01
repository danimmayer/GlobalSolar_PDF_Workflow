/**
 * Serviço para integração com API do IBGE
 * Fornece dados de estados e cidades do Brasil
 */

/**
 * Interface para representar um estado brasileiro
 */
export interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

/**
 * Interface para representar uma cidade brasileira
 */
export interface Cidade {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        id: number;
        sigla: string;
        nome: string;
      };
    };
  };
}

/**
 * Interface simplificada para cidade usada nos componentes
 */
export interface CidadeSimplificada {
  id: number;
  nome: string;
}

/**
 * Cache para armazenar dados já buscados
 * Evita requisições desnecessárias à API
 */
const cache = {
  estados: null as Estado[] | null,
  cidades: new Map<string, CidadeSimplificada[]>()
};

/**
 * Busca todos os estados brasileiros da API do IBGE
 * Utiliza cache para evitar requisições repetidas
 */
export async function buscarEstados(): Promise<Estado[]> {
  if (cache.estados) {
    return cache.estados;
  }

  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar estados: ${response.status}`);
    }

    const estados: Estado[] = await response.json();
    cache.estados = estados;
    
    return estados;
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    // Retorna lista básica em caso de erro
    return [
      { id: 42, sigla: 'SC', nome: 'Santa Catarina' },
      { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul' },
      { id: 41, sigla: 'PR', nome: 'Paraná' },
      { id: 35, sigla: 'SP', nome: 'São Paulo' },
      { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' },
      { id: 31, sigla: 'MG', nome: 'Minas Gerais' }
    ];
  }
}

/**
 * Busca cidades de um estado específico da API do IBGE
 * Utiliza cache por estado para otimizar performance
 */
export async function buscarCidadesPorEstado(ufSigla: string): Promise<CidadeSimplificada[]> {
  if (cache.cidades.has(ufSigla)) {
    return cache.cidades.get(ufSigla)!;
  }

  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSigla}/municipios?orderBy=nome`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar cidades: ${response.status}`);
    }

    const cidadesCompletas: Cidade[] = await response.json();
    
    // Simplifica os dados para uso nos componentes
    const cidades: CidadeSimplificada[] = cidadesCompletas.map(cidade => ({
      id: cidade.id,
      nome: cidade.nome
    }));
    
    cache.cidades.set(ufSigla, cidades);
    
    return cidades;
  } catch (error) {
    console.error(`Erro ao buscar cidades para ${ufSigla}:`, error);
    
    // Retorna lista básica para SC em caso de erro
    if (ufSigla === 'SC') {
      return [
        { id: 4202404, nome: 'Apiúna' },
        { id: 4218707, nome: 'São Miguel do Oeste' },
        { id: 4204202, nome: 'Chapecó' },
        { id: 4202404, nome: 'Blumenau' },
        { id: 4209102, nome: 'Joinville' },
        { id: 4205407, nome: 'Florianópolis' }
      ];
    }
    
    return [];
  }
}

/**
 * Limpa o cache de localização
 * Útil para forçar atualização dos dados
 */
export function limparCache(): void {
  cache.estados = null;
  cache.cidades.clear();
}

/**
 * Busca uma cidade específica por nome em um estado
 * Útil para validação ou busca específica
 */
export async function buscarCidadePorNome(ufSigla: string, nomeCidade: string): Promise<CidadeSimplificada | null> {
  const cidades = await buscarCidadesPorEstado(ufSigla);
  return cidades.find(cidade => 
    cidade.nome.toLowerCase() === nomeCidade.toLowerCase()
  ) || null;
}