// KpisForm.tsx
// Formulário para KPIs e dados financeiros do sistema solar
// Inclui cálculos automáticos e validação de valores

import React, { useEffect } from 'react';
import { TrendingUp, DollarSign, Zap, Calculator, Info } from 'lucide-react';
import type { Kpis, Finance } from '../../proposta-solar-pdf';

interface KpisFormProps {
  kpis: Kpis;
  finance: Finance;
  onChange: (kpis: Kpis, finance: Finance) => void;
  errors: string[];
}

/**
 * Calcula o payback simples baseado no investimento e economia anual
 * Fórmula: Investimento Total / Economia Anual
 */
function calculatePayback(capex: number, economiaAnual: number): number {
  if (economiaAnual <= 0) return 0;
  return capex / economiaAnual;
}

/**
 * Calcula a economia anual baseada na geração e tarifa
 * Fórmula: Geração Anual (kWh) × Tarifa (R$/kWh)
 */
function calculateEconomiaAnual(energiaMensal: number, tarifa: number): number {
  return energiaMensal * 12 * tarifa;
}

/**
 * Calcula TIR aproximada para sistema solar
 * Simplificação: considera fluxo constante por 25 anos
 */
function calculateTIR(capex: number, economiaAnual: number, anos: number = 25): number {
  if (capex <= 0 || economiaAnual <= 0) return 0;
  
  // Aproximação simples da TIR
  const fluxoTotal = economiaAnual * anos;
  const retornoTotal = (fluxoTotal - capex) / capex;
  const tirAnual = Math.pow(1 + retornoTotal, 1/anos) - 1;
  
  return tirAnual * 100; // Retorna em percentual
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
 * Formulário para KPIs e dados financeiros
 * Implementa cálculos automáticos e validação em tempo real
 */
export function KpisForm({ kpis, finance, onChange, errors }: KpisFormProps) {
  
  // Recalcula valores automaticamente quando dados base mudam
  useEffect(() => {
    const economiaCalculada = calculateEconomiaAnual(kpis.energiaMensalKWh, finance.tarifaBRLkWh);
    const paybackCalculado = calculatePayback(finance.capexBRL, economiaCalculada);
    const tirCalculada = calculateTIR(finance.capexBRL, economiaCalculada);
    
    // Atualiza apenas se os valores calculados mudaram significativamente
    if (Math.abs(kpis.economiaAnualBRL - economiaCalculada) > 1 ||
        Math.abs(kpis.paybackAnos - paybackCalculado) > 0.1 ||
        Math.abs((kpis.tirPercent || 0) - tirCalculada) > 0.1) {
      
      onChange(
        {
          ...kpis,
          economiaAnualBRL: economiaCalculada,
          paybackAnos: paybackCalculado,
          tirPercent: tirCalculada
        },
        finance
      );
    }
  }, [kpis.energiaMensalKWh, finance.tarifaBRLkWh, finance.capexBRL]);

  const handleKpiChange = (field: keyof Kpis, value: number) => {
    onChange({ ...kpis, [field]: value }, finance);
  };

  const handleFinanceChange = (field: keyof Finance, value: number) => {
    onChange(kpis, { ...finance, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">KPIs & Dados Financeiros</h3>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Erros encontrados:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Dados Técnicos do Sistema */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Especificações Técnicas
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Potência do Sistema */}
          <div>
            <label 
              htmlFor="potencia-kwp" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Potência do Sistema (kWp) *
            </label>
            <input
              id="potencia-kwp"
              type="number"
              step="0.1"
              min="0"
              value={kpis.potenciaKWp || ''}
              onChange={(e) => handleKpiChange('potenciaKWp', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Ex: 5.5"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Potência total dos módulos fotovoltaicos
            </p>
          </div>

          {/* Geração Mensal */}
          <div>
            <label 
              htmlFor="energia-mensal" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Geração Mensal Estimada (kWh) *
            </label>
            <input
              id="energia-mensal"
              type="number"
              step="1"
              min="0"
              value={kpis.energiaMensalKWh || ''}
              onChange={(e) => handleKpiChange('energiaMensalKWh', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Ex: 720"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Energia gerada por mês pelo sistema
            </p>
          </div>

          {/* Degradação Anual */}
          <div>
            <label 
              htmlFor="degradacao-anual" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Degradação Anual (%)
            </label>
            <input
              id="degradacao-anual"
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={(finance.degradacaoAnual || 0.006) * 100}
              onChange={(e) => handleFinanceChange('degradacaoAnual', (parseFloat(e.target.value) || 0.6) / 100)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="0.6"
            />
            <p className="mt-1 text-xs text-gray-500">
              Perda de eficiência anual dos módulos (padrão: 0.6%)
            </p>
          </div>
        </div>
      </div>

      {/* Dados Financeiros */}
      <div className="bg-green-50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Dados Financeiros
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Investimento Total */}
          <div>
            <label 
              htmlFor="capex" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Investimento Total (R$) *
            </label>
            <input
              id="capex"
              type="number"
              step="100"
              min="0"
              value={finance.capexBRL || ''}
              onChange={(e) => handleFinanceChange('capexBRL', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Ex: 36500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Valor total do sistema (equipamentos + instalação)
            </p>
          </div>

          {/* Tarifa de Energia */}
          <div>
            <label 
              htmlFor="tarifa" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tarifa de Energia (R$/kWh) *
            </label>
            <input
              id="tarifa"
              type="number"
              step="0.01"
              min="0"
              value={finance.tarifaBRLkWh || ''}
              onChange={(e) => handleFinanceChange('tarifaBRLkWh', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Ex: 1.05"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Tarifa atual da concessionária (com impostos)
            </p>
          </div>
        </div>
      </div>

      {/* KPIs Calculados */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Indicadores Calculados
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Economia Anual */}
          <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(kpis.economiaAnualBRL)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Economia Anual</div>
            <div className="text-xs text-gray-500 mt-1">
              {kpis.energiaMensalKWh * 12} kWh/ano
            </div>
          </div>

          {/* Payback */}
          <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {kpis.paybackAnos.toFixed(1)} anos
            </div>
            <div className="text-sm text-gray-600 mt-1">Payback Simples</div>
            <div className="text-xs text-gray-500 mt-1">
              Retorno do investimento
            </div>
          </div>

          {/* TIR */}
          <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-purple-600">
              {(kpis.tirPercent || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">TIR Estimada</div>
            <div className="text-xs text-gray-500 mt-1">
              Taxa Interna de Retorno
            </div>
          </div>
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-medium text-blue-800">Dicas para Preenchimento:</h4>
          </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use dados reais da conta de energia do cliente para maior precisão</li>
          <li>• A potência deve considerar o espaço disponível e consumo</li>
          <li>• Geração mensal varia conforme região e orientação dos módulos</li>
          <li>• TIR acima de 15% é considerada excelente para energia solar</li>
          <li>• Payback típico no Brasil: 3-6 anos</li>
        </ul>
      </div>
    </div>
  );
}