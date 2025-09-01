import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Zap, DollarSign, Trash2 } from 'lucide-react';
import { buscarEstados, buscarCidadesPorEstado, type Estado, type CidadeSimplificada } from '../../services/locationService';

/**
 * Interface para os dados da unidade geradora
 * Define a estrutura dos dados coletados nesta seção
 */
interface DadosUnidadeGeradoraData {
  codigoUC: string;
  uf: string;
  cidade: string;
  fases: string;
  tensao: string;
  grupoConsumidor: string;
  concessionaria: string;
  taxaConsumoInstantaneo: string;
  taxaIluminacao: string;
  impostoRenda: string;
  custoKwh: string;
  consumoAnual: string;
  // Campos específicos para usina
  potenciaUsina?: string;
  areaDisponivel?: string;
  distanciaRede?: string;
  tipoTerreno?: string;
  acessoLocal?: string;
}

/**
 * Interface para múltiplas unidades beneficiárias
 */
interface UnidadesBeneficiariasData {
  unidades: Partial<DadosUnidadeGeradoraData>[];
}

/**
 * Props do componente de dados da unidade geradora
 */
interface DadosUnidadeGeradoraProps {
  data?: Partial<UnidadesBeneficiariasData>;
  onChange: (data: Partial<UnidadesBeneficiariasData>) => void;
  tipoInstalacao?: 'comum' | 'usina';
}

/**
 * Componente para uma única unidade geradora
 */
interface UnidadeGeradoraItemProps {
  data: Partial<DadosUnidadeGeradoraData>;
  onChange: (data: Partial<DadosUnidadeGeradoraData>) => void;
  tipoInstalacao: 'comum' | 'usina';
  numero: number;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export const UnidadeGeradoraItem: React.FC<UnidadeGeradoraItemProps> = ({ 
  data, 
  onChange, 
  tipoInstalacao, 
  numero, 
  onRemove, 
  showRemoveButton = false 
}) => {
  // Estados para gerenciar dados da API do IBGE
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<CidadeSimplificada[]>([]);
  const [carregandoEstados, setCarregandoEstados] = useState(true);
  const [carregandoCidades, setCarregandoCidades] = useState(false);

  /**
   * Carrega a lista de estados na inicialização do componente
   */
  useEffect(() => {
    const carregarEstados = async () => {
      try {
        setCarregandoEstados(true);
        const estadosData = await buscarEstados();
        setEstados(estadosData);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      } finally {
        setCarregandoEstados(false);
      }
    };

    carregarEstados();
  }, []);

  /**
   * Carrega cidades quando o estado é alterado
   */
  useEffect(() => {
    const carregarCidades = async () => {
      if (!data.uf) {
        setCidades([]);
        return;
      }

      try {
        setCarregandoCidades(true);
        const cidadesData = await buscarCidadesPorEstado(data.uf);
        setCidades(cidadesData);
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        setCidades([]);
      } finally {
        setCarregandoCidades(false);
      }
    };

    carregarCidades();
  }, [data.uf]);

  /**
   * Atualiza um campo específico dos dados
   * Mantém os dados existentes e atualiza apenas o campo modificado
   */
  const updateField = (field: keyof DadosUnidadeGeradoraData, value: string) => {
    // Se mudou o estado, limpa a cidade selecionada
    if (field === 'uf') {
      onChange({ ...data, [field]: value, cidade: '' });
    } else {
      onChange({ ...data, [field]: value });
    }
  };

  return (
    <div className="space-y-2">
      {showRemoveButton && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
          >
            <Trash2 size={14} />
            Remover
          </button>
        </div>
      )}
      <div className="space-y-3">
        {/* Primeira linha - Código UC, UF, Cidade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Código da UC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="123456"
              value={data.codigoUC || ''}
              onChange={(e) => updateField('codigoUC', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              UF <span className="text-red-500">*</span>
            </label>
            <select
              value={data.uf || ''}
              onChange={(e) => updateField('uf', e.target.value)}
              disabled={carregandoEstados}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {carregandoEstados ? 'Carregando...' : 'Selecione o estado'}
              </option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.sigla}>
                  {estado.sigla} - {estado.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Cidade <span className="text-red-500">*</span>
            </label>
            <select
              value={data.cidade || ''}
              onChange={(e) => updateField('cidade', e.target.value)}
              disabled={!data.uf || carregandoCidades}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!data.uf 
                  ? 'Selecione primeiro o estado' 
                  : carregandoCidades 
                    ? 'Carregando cidades...' 
                    : 'Selecione a cidade'
                }
              </option>
              {cidades.map((cidade) => (
                <option key={cidade.id} value={cidade.nome}>
                  {cidade.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Segunda linha - Fases, Tensão, Grupo Consumidor, Concessionária */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Fases <span className="text-red-500">*</span>
            </label>
            <select
              value={data.fases || ''}
              onChange={(e) => updateField('fases', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Selecione</option>
              {tipoInstalacao === 'comum' ? (
                <>
                  <option value="Monofásico">Monofásico</option>
                  <option value="Bifásico">Bifásico</option>
                  <option value="Trifásico">Trifásico</option>
                  <option value="Monofásico rural">Monofásico rural</option>
                </>
              ) : (
                <>
                  <option value="Trifásico">Trifásico</option>
                  <option value="Monofásico rural">Monofásico rural</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tensão <span className="text-red-500">*</span>
            </label>
            <select
              value={data.tensao || ''}
              onChange={(e) => updateField('tensao', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Selecione</option>
              <option value="127/220V">127/220V</option>
              <option value="220/380V">220/380V</option>
              <option value="220/440V">220/440V</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Grupo consumidor <span className="text-red-500">*</span>
            </label>
            <select
              value={data.grupoConsumidor || ''}
              onChange={(e) => updateField('grupoConsumidor', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Selecione</option>
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Rural">Rural</option>
            </select>
          </div>
        </div>

        {/* Terceira linha - Concessionária, Taxa Consumo, Taxa Iluminação, Imposto de Renda (apenas para usina) */}
        <div className={`grid grid-cols-1 gap-2 mb-2 ${tipoInstalacao === 'usina' ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Concessionária <span className="text-red-500">*</span>
            </label>
            <select
              value={data.concessionaria || ''}
              onChange={(e) => updateField('concessionaria', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Selecione</option>
              <option value="CELESC">01 - Celesc</option>
              <option value="COPEL">02 - Copel</option>
              <option value="CPFL-RGE">03 - CPFL-RGE</option>
              <option value="CEEE-D">04 - CEEE-D</option>
              <option value="COCEL">05 - COCEL</option>
              <option value="COOPERALIANÇA">06 - COOPERALIANÇA</option>
              <option value="DCELT">07 - DCELT</option>
              <option value="DEMEI">08 - DEMEI</option>
              <option value="EFLIC">09 - EFLIC</option>
              <option value="EFLUL">10 - EFLUL</option>
              <option value="ELETROCAR">11 - ELETROCAR</option>
              <option value="FORCEL">12 - FORCEL</option>
              <option value="HIDROPAN">13 - HIDROPAN</option>
              <option value="MUXENERGIA">14 - MUXENERGIA</option>
              <option value="UHENPAL">15 - UHENPAL</option>
              <option value="CASTRO-DIS">16 - CASTRO-DIS</option>
              <option value="CEGERO">17 - CEGERO</option>
              <option value="CEJAMA">18 - CEJAMA</option>
              <option value="CELETRO">19 - CELETRO</option>
              <option value="CEPRAG">20 - CEPRAG</option>
              <option value="CERACÁ">21 - CERACÁ</option>
              <option value="CERAL">22 - CERAL</option>
              <option value="CERAL-DIS">23 - CERAL-DIS</option>
              <option value="CERBRANORTE">24 - CERBRANORTE</option>
              <option value="CEREJ">25 - CEREJ</option>
              <option value="CERFOX">26 - CERFOX</option>
              <option value="CERGAL">27 - CERGAL</option>
              <option value="CERGAPA">28 - CERGAPA</option>
              <option value="CERGRAL">29 - CERGRAL</option>
              <option value="CERILUZ">30 - CERILUZ</option>
              <option value="CERMISSÕES">31 - CERMISSÕES</option>
              <option value="CERMOFUL">32 - CERMOFUL</option>
              <option value="CERPALO">33 - CERPALO</option>
              <option value="CERSAD">34 - CERSAD</option>
              <option value="CERSUL">35 - CERSUL</option>
              <option value="CERTAJA">36 - CERTAJA</option>
              <option value="CERTEL">37 - CERTEL</option>
              <option value="CERTHIL">38 - CERTHIL</option>
              <option value="CERTREL">39 - CERTREL</option>
              <option value="CODESAM">40 - CODESAM</option>
              <option value="COOPERA">41 - COOPERA</option>
              <option value="COOPERCOCAL">42 - COOPERCOCAL</option>
              <option value="COOPERLUZ">43 - COOPERLUZ</option>
              <option value="COOPERMILA">44 - COOPERMILA</option>
              <option value="COOPERNORTE">45 - COOPERNORTE</option>
              <option value="COOPERZEM">46 - COOPERZEM</option>
              <option value="COORSEL">47 - COORSEL</option>
              <option value="COPREL">48 - COPREL</option>
              <option value="CRELUZ-D">49 - CRELUZ-D</option>
              <option value="CERAL">50 - CERAL</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Taxa de consumo instantâneo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">%</span>
              <input
                type="number"
                placeholder="85"
                value={data.taxaConsumoInstantaneo || ''}
                onChange={(e) => updateField('taxaConsumoInstantaneo', e.target.value)}
                className="w-full pl-6 pr-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Taxa de iluminação <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">R$</span>
              <input
                type="number"
                step="0.01"
                placeholder="35,50"
                value={data.taxaIluminacao || ''}
                onChange={(e) => updateField('taxaIluminacao', e.target.value)}
                className="w-full pl-6 pr-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Campo Imposto de renda apenas para instalação de usina */}
          {tipoInstalacao === 'usina' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
              Imposto de renda <span className="text-red-500">*</span>
            </label>
              <input
                type="text"
                placeholder="27,5"
                value={data.impostoRenda || ''}
                onChange={(e) => updateField('impostoRenda', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Seção de Consumo - apenas para instalação comum e primeira unidade (unidade geradora) */}
        {tipoInstalacao === 'comum' && numero === 0 && (
          <div className="border-t border-gray-200 pt-2">
            <h3 className="text-xs font-semibold text-gray-800 mb-2">Consumo da unidade geradora</h3>
            {/* Tipo de consumo */}
            <div className="mb-2">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipoConsumo"
                    value="anual"
                    defaultChecked
                    className="w-3 h-3 text-amber-600 border-gray-300 focus:ring-amber-500"
                  />
                  <span className="ml-1 text-xs text-gray-700">Anual</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipoConsumo"
                    value="mensal"
                    className="w-3 h-3 text-amber-600 border-gray-300 focus:ring-amber-500"
                  />
                  <span className="ml-1 text-xs text-gray-700">Mensal</span>
                </label>
              </div>
            </div>

            {/* Campos de consumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
              Custo por kWh <span className="text-red-500">*</span>
            </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,85"
                    value={data.custoKwh || ''}
                    onChange={(e) => updateField('custoKwh', e.target.value)}
                    className="w-full pl-6 pr-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
              Consumo anual (kWh) <span className="text-red-500">*</span>
            </label>
                <input
                  type="number"
                  placeholder="12000"
                  value={data.consumoAnual || ''}
                  onChange={(e) => updateField('consumoAnual', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

/**
 * Componente principal para gerenciar múltiplas unidades beneficiárias
 */
const DadosUnidadeGeradora: React.FC<DadosUnidadeGeradoraProps> = ({ data = {}, onChange, tipoInstalacao = 'comum' }) => {
  // Inicializa com uma unidade se não houver dados
  const unidades = data.unidades || [{}];

  /**
   * Atualiza uma unidade específica
   */
  const updateUnidade = (index: number, unidadeData: Partial<DadosUnidadeGeradoraData>) => {
    const novasUnidades = [...unidades];
    novasUnidades[index] = unidadeData;
    onChange({ unidades: novasUnidades });
  };

  /**
   * Adiciona uma nova unidade beneficiária
   */
  const adicionarUnidade = () => {
    const novasUnidades = [...unidades, {}];
    onChange({ unidades: novasUnidades });
  };

  /**
   * Remove uma unidade beneficiária
   */
  const removerUnidade = (index: number) => {
    if (unidades.length > 1 && index > 0) {
      const novasUnidades = unidades.filter((_, i) => i !== index);
      onChange({ unidades: novasUnidades });
    }
  };

  return (
    <div className="space-y-6">
      {unidades.map((unidade, index) => (
        <UnidadeGeradoraItem
          key={index}
          data={unidade}
          onChange={(novosDados) => updateUnidade(index, novosDados)}
          tipoInstalacao={tipoInstalacao}
          numero={index}
          onRemove={() => removerUnidade(index)}
          showRemoveButton={unidades.length > 1 && index > 0}
        />
      ))}
    </div>
  );
};

/**
 * Componente do botão para adicionar unidade beneficiária
 * Separado para ser usado externamente no PaginaUm
 */
export const BotaoAdicionarUnidade: React.FC<{
  onClick: () => void;
  tipoInstalacao?: 'comum' | 'usina';
}> = ({ onClick, tipoInstalacao = 'comum' }) => {
  if (tipoInstalacao !== 'comum') return null;
  
  return (
    <div className="flex justify-start mt-4">
      <button
        type="button"
        onClick={onClick}
        className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors flex items-center gap-2"
      >
        <span>+</span>
        Adicionar unidade beneficiária
      </button>
    </div>
  );
};

export default DadosUnidadeGeradora;