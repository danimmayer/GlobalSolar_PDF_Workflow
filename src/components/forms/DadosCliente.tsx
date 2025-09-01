import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Building } from 'lucide-react';
import { buscarEstados, buscarCidadesPorEstado, type Estado, type CidadeSimplificada } from '../../services/locationService';

/**
 * Interface para os dados do cliente
 * Define a estrutura dos dados coletados nesta seção
 */
interface DadosClienteData {
  tipoCliente: 'fisica' | 'juridica';
  tipoInstalacao: 'comum' | 'usina';
  kitsPremiun: boolean;
  complementacao: boolean;
  telefone: string;
  // Pessoa Física
  cpf: string;
  nome: string;
  // Pessoa Jurídica
  cnpj: string;
  razaoSocial: string;
  email: string;
  uf: string;
  cidade: string;
  nomeProjeto: string;
  origem: string;
}

/**
 * Props do componente de dados do cliente
 */
interface DadosClienteProps {
  data?: Partial<DadosClienteData>;
  onChange: (data: Partial<DadosClienteData>) => void;
}

/**
 * Componente para coleta dos dados do cliente
 * Baseado no segundo print fornecido pelo usuário
 * 
 * @param data - Dados atuais do formulário
 * @param onChange - Callback para atualizar os dados
 */
const DadosCliente: React.FC<DadosClienteProps> = ({ data = {}, onChange }) => {
  // Estados para gerenciar dados da API do IBGE
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<CidadeSimplificada[]>([]);
  const [carregandoEstados, setCarregandoEstados] = useState(true);
  const [carregandoCidades, setCarregandoCidades] = useState(false);

  // Valores padrão para os campos
  const defaultData = {
    tipoCliente: 'fisica' as const,
    tipoInstalacao: 'comum' as const,
    kitsPremiun: false,
    complementacao: true,
    ...data
  };

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
      if (!defaultData.uf) {
        setCidades([]);
        return;
      }

      try {
        setCarregandoCidades(true);
        const cidadesData = await buscarCidadesPorEstado(defaultData.uf);
        setCidades(cidadesData);
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        setCidades([]);
      } finally {
        setCarregandoCidades(false);
      }
    };

    carregarCidades();
  }, [defaultData.uf]);

  /**
   * Atualiza um campo específico dos dados
   * Mantém os dados existentes e atualiza apenas o campo modificado
   */
  const updateField = (field: keyof DadosClienteData, value: any) => {
    // Se mudou o estado, limpa a cidade selecionada
    if (field === 'uf') {
      onChange({ ...defaultData, [field]: value, cidade: '' });
    } else {
      onChange({ ...defaultData, [field]: value });
    }
  };

  return (
    <div className="space-y-2">
      <div className="space-y-3">
        {/* Primeira linha - Tipo de Cliente, Tipo de Instalação, Kits Premium, Complementação */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tipo de cliente
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipoCliente"
                  value="fisica"
                  checked={defaultData.tipoCliente === 'fisica'}
                  onChange={(e) => updateField('tipoCliente', e.target.value as 'fisica' | 'juridica')}
                  className="w-3 h-3 text-amber-600 border-gray-300 focus:ring-amber-500"
                />
                <span className="ml-1 text-xs text-gray-700">Pessoa Física</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipoCliente"
                  value="juridica"
                  checked={defaultData.tipoCliente === 'juridica'}
                  onChange={(e) => updateField('tipoCliente', e.target.value as 'fisica' | 'juridica')}
                  className="w-3 h-3 text-amber-600 border-gray-300 focus:ring-amber-500"
                />
                <span className="ml-1 text-xs text-gray-700">Pessoa Jurídica</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tipo de instalação
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipoInstalacao"
                  value="comum"
                  checked={defaultData.tipoInstalacao === 'comum'}
                  onChange={(e) => updateField('tipoInstalacao', e.target.value as 'comum' | 'usina')}
                  className="w-3 h-3 text-amber-600 border-gray-300 focus:ring-amber-500"
                />
                <span className="ml-1 text-xs text-gray-700">Instalação comum</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipoInstalacao"
                  value="usina"
                  checked={defaultData.tipoInstalacao === 'usina'}
                  onChange={(e) => updateField('tipoInstalacao', e.target.value as 'comum' | 'usina')}
                  className="w-3 h-3 text-amber-600 border-gray-300 focus:ring-amber-500"
                />
                <span className="ml-1 text-xs text-gray-700">Instalação de usina</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Somente kits premium?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="kitsPremiun"
                  value="true"
                  checked={defaultData.kitsPremiun === true}
                  onChange={() => updateField('kitsPremiun', true)}
                  className="w-3 h-3 text-amber-600 border-gray-300 focus:ring-amber-500"
                />
                <span className="ml-1 text-xs text-gray-700">Sim</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="kitsPremiun"
                  value="false"
                  checked={defaultData.kitsPremiun === false}
                  onChange={() => updateField('kitsPremiun', false)}
                  className="w-3 h-3 text-amber-600 border-gray-300 focus:ring-amber-500"
                />
                <span className="ml-1 text-xs text-gray-700">Não</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Complementação
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="complementacao"
                  value="true"
                  checked={defaultData.complementacao === true}
                  onChange={() => updateField('complementacao', true)}
                  className="w-3 h-3 text-amber-600 border-gray-300 focus:ring-amber-500"
                />
                <span className="ml-1 text-xs text-gray-700">Sim</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="complementacao"
                  value="false"
                  checked={defaultData.complementacao === false}
                  onChange={() => updateField('complementacao', false)}
                  className="w-3 h-3 text-amber-600 border-gray-300 focus:ring-amber-500"
                />
                <span className="ml-1 text-xs text-gray-700">Não</span>
              </label>
            </div>
          </div>
        </div>

        {/* Segunda linha - Telefone, CPF, Nome, Email */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Telefone <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  placeholder="(47) 99999-9999"
                  value={defaultData.telefone || ''}
              onChange={(e) => updateField('telefone', e.target.value)}
                  className="w-full pl-8 pr-4 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              {/* Ícone do WhatsApp */}
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                <span className="text-white text-xs font-bold">W</span>
              </div>
            </div>
          </div>

          {/* Campos condicionais baseados no tipo de cliente */}
          {defaultData.tipoCliente === 'fisica' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  placeholder="123.456.789-00"
                  value={defaultData.cpf || ''}
              onChange={(e) => updateField('cpf', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="João da Silva"
                  value={defaultData.nome || ''}
              onChange={(e) => updateField('nome', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  CNPJ
                </label>
                <input
                  type="text"
                  placeholder="12.345.678/0001-90"
                  value={defaultData.cnpj || ''}
                  onChange={(e) => updateField('cnpj', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Razão social
                </label>
                <input
                  type="text"
                  placeholder="Empresa Solar Energia LTDA"
                  value={defaultData.razaoSocial || ''}
                  onChange={(e) => updateField('razaoSocial', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="contato@empresa.com.br"
              value={defaultData.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Terceira linha - UF, Cidade, Nome do Projeto, Origem */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              UF <span className="text-red-500">*</span>
            </label>
            <select
              value={defaultData.uf || ''}
              onChange={(e) => updateField('uf', e.target.value)}
              disabled={carregandoEstados}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {carregandoEstados ? 'Carregando...' : 'Selecione o estado'}
              </option>
              {estados.map((estado) => (
                <option key={estado.sigla} value={estado.sigla}>
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
              value={defaultData.cidade || ''}
              onChange={(e) => updateField('cidade', e.target.value)}
              disabled={!defaultData.uf || carregandoCidades}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!defaultData.uf 
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

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nome do projeto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Sistema Solar Residencial - Silva"
              value={defaultData.nomeProjeto || ''}
              onChange={(e) => updateField('nomeProjeto', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Origem
            </label>
            <select
              value={defaultData.origem || ''}
              onChange={(e) => updateField('origem', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Selecione</option>
              <option value="Sistema">Sistema</option>
              <option value="Indicação">Indicação</option>
              <option value="Site">Site</option>
              <option value="Redes Sociais">Redes Sociais</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DadosCliente;