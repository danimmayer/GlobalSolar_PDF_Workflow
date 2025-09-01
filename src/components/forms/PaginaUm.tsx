import React from 'react';
import DadosUnidadeGeradora, { BotaoAdicionarUnidade, UnidadeGeradoraItem } from './DadosUnidadeGeradora';
import DadosCliente from './DadosCliente';

/**
 * Interface para os dados combinados da primeira página
 * Inclui tanto dados da unidade geradora quanto dados do cliente
 */
interface PaginaUmData {
  unidadeGeradora?: any;
  cliente?: any;
}

/**
 * Props do componente da primeira página
 */
interface PaginaUmProps {
  data?: Partial<PaginaUmData>;
  onChange: (section: string, data: any) => void;
}

/**
 * Componente da primeira página do fluxo
 * Combina os formulários de dados da unidade geradora e dados do cliente
 * Baseado nos dois prints fornecidos pelo usuário
 * 
 * @param data - Dados atuais do formulário
 * @param onChange - Callback para atualizar os dados
 */
const PaginaUm: React.FC<PaginaUmProps> = ({ data = {}, onChange }) => {
  /**
   * Atualiza os dados da unidade geradora
   * Chama o callback onChange com a seção específica
   */
  const handleUnidadeGeradoraChange = (unidadeGeradoraData: any) => {
    onChange('unidadeGeradora', unidadeGeradoraData);
  };

  /**
   * Atualiza os dados do cliente
   * Chama o callback onChange com a seção específica
   */
  const handleClienteChange = (clienteData: any) => {
    onChange('cliente', clienteData);
  };

  /**
   * Adiciona uma nova unidade beneficiária
   */
  const handleAdicionarUnidade = () => {
    const unidadesAtuais = data.unidadeGeradora?.unidades || [{}];
    const novasUnidades = [...unidadesAtuais, {}];
    onChange('unidadeGeradora', { ...data.unidadeGeradora, unidades: novasUnidades });
  };

  /**
   * Atualiza uma unidade específica
   */
  const updateUnidade = (index: number, unidadeData: any) => {
    const unidadesAtuais = data.unidadeGeradora?.unidades || [{}];
    const novasUnidades = [...unidadesAtuais];
    novasUnidades[index] = unidadeData;
    onChange('unidadeGeradora', { ...data.unidadeGeradora, unidades: novasUnidades });
  };

  /**
   * Remove uma unidade beneficiária
   */
  const removerUnidade = (index: number) => {
    const unidadesAtuais = data.unidadeGeradora?.unidades || [{}];
    if (unidadesAtuais.length > 1 && index > 0) {
      const novasUnidades = unidadesAtuais.filter((_, i) => i !== index);
      onChange('unidadeGeradora', { ...data.unidadeGeradora, unidades: novasUnidades });
    }
  };

  // Obter as unidades para renderização
  const unidades = data.unidadeGeradora?.unidades || [{}];

  return (
    <div className="min-h-full bg-gray-50">
      <div className="p-2">
        {/* Layout compacto em duas seções */}
        <div className="space-y-3">
          {/* Dados do Cliente */}
          <div className="bg-white rounded border border-gray-300">
            <div className="bg-gray-100 px-2 py-1 border-b border-gray-300">
              <h2 className="text-xs font-semibold text-gray-800">Dados do cliente</h2>
            </div>
            <div className="p-2">
              <DadosCliente 
                data={data.cliente}
                onChange={handleClienteChange}
              />
            </div>
          </div>

          {/* Dados da Unidade Geradora - apenas a primeira unidade */}
          <div className="bg-white rounded border border-gray-300">
            <div className="bg-gray-100 px-2 py-1 border-b border-gray-300">
              <h2 className="text-xs font-semibold text-gray-800">Dados da Unidade Geradora</h2>
            </div>
            <div className="p-2">
              <DadosUnidadeGeradora 
                data={{ unidades: [unidades[0]] }}
                onChange={(dadosUnidade) => {
                  updateUnidade(0, dadosUnidade.unidades?.[0] || {});
                }}
                tipoInstalacao={data.cliente?.tipoInstalacao}
              />
            </div>
          </div>

          {/* Unidades Beneficiárias Adicionais - containers separados */}
          {unidades.slice(1).map((unidade, index) => {
            const numeroUnidade = index + 1;
            return (
              <div key={`beneficiaria-${numeroUnidade}`} className="bg-white rounded border border-gray-300">
                <div className="bg-gray-100 px-2 py-1 border-b border-gray-300">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs font-semibold text-gray-800">
                      Dados da Unidade Beneficiária {numeroUnidade}
                    </h2>
                    <button
                      type="button"
                      onClick={() => removerUnidade(index + 1)}
                      className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                    >
                      Remover
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  {/* Renderizar diretamente o UnidadeGeradoraItem com numero correto */}
                  <UnidadeGeradoraItem
                    data={unidade}
                    onChange={(dadosUnidade) => {
                      updateUnidade(index + 1, dadosUnidade);
                    }}
                    tipoInstalacao={data.cliente?.tipoInstalacao || 'comum'}
                    numero={index + 1}
                    showRemoveButton={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Botão para adicionar unidade beneficiária - ao final da página */}
        <BotaoAdicionarUnidade 
          onClick={handleAdicionarUnidade}
          tipoInstalacao={data.cliente?.tipoInstalacao}
        />
      </div>
    </div>
  );
};

export default PaginaUm;