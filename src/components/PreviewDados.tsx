// PreviewDados.tsx
// Componente para preview dos dados antes da geração do PDF
// Mostra resumo organizado de todas as informações coletadas

import React from 'react';
import { Eye, Building2, User, TrendingUp, Package, FileText, DollarSign } from 'lucide-react';
import type { SolarProposalData } from '../proposta-solar-pdf';

interface PreviewDadosProps {
  data: SolarProposalData;
}

/**
 * Formata valor monetário para exibição
 * Aplica formatação brasileira (R$ 1.234,56)
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata data para exibição em português
 */
function formatDate(dateISO: string): string {
  return new Date(dateISO).toLocaleDateString('pt-BR');
}

/**
 * Componente para preview completo dos dados
 * Organiza informações em seções visuais antes da geração do PDF
 */
export function PreviewDados({ data }: PreviewDadosProps) {
  const subtotal = data.itens.reduce((sum, item) => sum + (item.qtd * item.precoUnit), 0);
  const geracaoAnual = data.kpis.energiaMensalKWh * 12;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Preview da Proposta</h3>
      </div>

      {/* Cabeçalho da Proposta */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-2">{data.titulo}</h4>
        <p className="text-gray-600">Data: {formatDate(data.dataISO)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados da Empresa */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h5 className="text-md font-semibold text-gray-900">Empresa</h5>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">Nome:</span>
              <p className="text-gray-900">{data.company.nome || 'Não informado'}</p>
            </div>
            
            {data.company.cnpj && (
              <div>
                <span className="text-sm font-medium text-gray-700">CNPJ:</span>
                <p className="text-gray-900">{data.company.cnpj}</p>
              </div>
            )}
            
            {data.company.contato && (
              <div>
                <span className="text-sm font-medium text-gray-700">Contato:</span>
                <p className="text-gray-900">{data.company.contato}</p>
              </div>
            )}
            
            {data.company.endereco && (
              <div>
                <span className="text-sm font-medium text-gray-700">Endereço:</span>
                <p className="text-gray-900 whitespace-pre-line">{data.company.endereco}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h5 className="text-md font-semibold text-gray-900">Cliente</h5>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">Nome:</span>
              <p className="text-gray-900">{data.client.nome || 'Não informado'}</p>
            </div>
            
            {data.client.documento && (
              <div>
                <span className="text-sm font-medium text-gray-700">Documento:</span>
                <p className="text-gray-900">{data.client.documento}</p>
              </div>
            )}
            
            {data.client.endereco && (
              <div>
                <span className="text-sm font-medium text-gray-700">Endereço da Instalação:</span>
                <p className="text-gray-900 whitespace-pre-line">{data.client.endereco}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPIs e Indicadores */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h5 className="text-md font-semibold text-gray-900">Indicadores do Sistema</h5>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Potência */}
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {data.kpis.potenciaKWp.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mt-1">kWp</div>
            <div className="text-xs text-gray-500">Potência</div>
          </div>
          
          {/* Geração Mensal */}
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {data.kpis.energiaMensalKWh.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600 mt-1">kWh/mês</div>
            <div className="text-xs text-gray-500">Geração</div>
          </div>
          
          {/* Economia Anual */}
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">
              {formatCurrency(data.kpis.economiaAnualBRL)}
            </div>
            <div className="text-sm text-gray-600 mt-1">por ano</div>
            <div className="text-xs text-gray-500">Economia</div>
          </div>
          
          {/* Payback */}
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {data.kpis.paybackAnos.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mt-1">anos</div>
            <div className="text-xs text-gray-500">Payback</div>
          </div>
        </div>
        
        {/* Dados Financeiros Adicionais */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Investimento Total:</span>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(data.finance.capexBRL)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tarifa de Energia:</span>
              <p className="text-gray-900">{formatCurrency(data.finance.tarifaBRLkWh)}/kWh</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Geração Anual:</span>
              <p className="text-gray-900">{geracaoAnual.toLocaleString()} kWh</p>
            </div>
            {data.kpis.tirPercent && (
              <div>
                <span className="font-medium text-gray-700">TIR Estimada:</span>
                <p className="text-gray-900">{data.kpis.tirPercent.toFixed(1)}%</p>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700">Degradação Anual:</span>
              <p className="text-gray-900">{((data.finance.degradacaoAnual || 0.006) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Itens do Sistema */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-blue-600" />
            <h5 className="text-md font-semibold text-gray-900">Itens do Sistema</h5>
          </div>
          <div className="text-sm text-gray-600">
            {data.itens.length} {data.itens.length === 1 ? 'item' : 'itens'}
          </div>
        </div>
        
        {data.itens.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum item adicionado</p>
        ) : (
          <>
            <div className="space-y-3">
              {data.itens.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.descricao}</p>
                    <p className="text-xs text-gray-600">
                      Qtd: {item.qtd} × {formatCurrency(item.precoUnit)}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.qtd * item.precoUnit)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-md font-semibold text-gray-900">Total:</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Observações e Premissas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Observações */}
        {data.observacoes && data.observacoes.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h5 className="text-md font-semibold text-gray-900">Observações Comerciais</h5>
            </div>
            
            <ul className="space-y-2">
              {data.observacoes.map((obs, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Premissas Técnicas */}
        {data.premissasTecnicas && data.premissasTecnicas.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h5 className="text-md font-semibold text-gray-900">Premissas Técnicas</h5>
            </div>
            
            <ul className="space-y-2">
              {data.premissasTecnicas.map((premissa, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{premissa}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Resumo Final */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h5 className="text-md font-semibold text-gray-900 mb-4">Resumo da Proposta</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-700">
              Sistema fotovoltaico de <strong>{data.kpis.potenciaKWp.toFixed(1)} kWp</strong> para{' '}
              <strong>{data.client.nome}</strong>, com geração estimada de{' '}
              <strong>{data.kpis.energiaMensalKWh} kWh/mês</strong>.
            </p>
          </div>
          <div>
            <p className="text-gray-700">
              Investimento de <strong>{formatCurrency(data.finance.capexBRL)}</strong> com{' '}
              economia anual de <strong>{formatCurrency(data.kpis.economiaAnualBRL)}</strong> e{' '}
              payback de <strong>{data.kpis.paybackAnos.toFixed(1)} anos</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Aviso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">📄 Pronto para Gerar PDF</h4>
        <p className="text-sm text-blue-700">
          Revise todas as informações acima. Ao clicar em "Gerar PDF", será criado um documento
          profissional com gráficos automáticos de payback e geração anual.
        </p>
      </div>
    </div>
  );
}