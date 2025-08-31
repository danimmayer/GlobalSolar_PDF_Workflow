// PropostaSolarModal.tsx
// Modal principal para coleta de dados da proposta solar
// Organizado em abas com validação e integração direta com geração de PDF

import React, { useState, useCallback } from 'react';
import { X, FileText, Download, Eye, AlertCircle } from 'lucide-react';
import { buildSolarProposalPDF, type SolarProposalData } from '../proposta-solar-pdf';
import { generatePaybackChart, generateGeracaoAnualChart } from '../chart-generator';
import { EmpresaForm } from './forms/EmpresaForm';
import { ClienteForm } from './forms/ClienteForm';
import { KpisForm } from './forms/KpisForm';
import { ItensForm } from './forms/ItensForm';
import { ObservacoesForm } from './forms/ObservacoesForm';
import { PreviewDados } from './PreviewDados';

interface PropostaSolarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'empresa' | 'cliente' | 'kpis' | 'itens' | 'observacoes' | 'preview';

interface FormErrors {
  [key: string]: string[];
}

/**
 * Modal principal para coleta de dados da proposta solar
 * Implementa navegação por abas, validação de formulário e geração automática de PDF
 * Segue padrões WCAG 2.2 AA para acessibilidade
 */
export function PropostaSolarModal({ isOpen, onClose }: PropostaSolarModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('empresa');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Estado do formulário organizado por seções
  const [formData, setFormData] = useState<SolarProposalData>({
    titulo: 'Proposta de Sistema Fotovoltaico',
    dataISO: new Date().toISOString().split('T')[0],
    company: {
      nome: '',
      cnpj: '',
      endereco: '',
      contato: ''
    },
    client: {
      nome: '',
      documento: '',
      endereco: ''
    },
    kpis: {
      potenciaKWp: 0,
      energiaMensalKWh: 0,
      economiaAnualBRL: 0,
      paybackAnos: 0,
      tirPercent: undefined
    },
    finance: {
      capexBRL: 0,
      tarifaBRLkWh: 0,
      degradacaoAnual: 0.006
    },
    itens: [],
    observacoes: [],
    premissasTecnicas: []
  });

  const tabs = [
    { id: 'empresa' as TabType, label: 'Empresa', icon: '🏢' },
    { id: 'cliente' as TabType, label: 'Cliente', icon: '👤' },
    { id: 'kpis' as TabType, label: 'KPIs & Financeiro', icon: '📊' },
    { id: 'itens' as TabType, label: 'Itens do Sistema', icon: '⚡' },
    { id: 'observacoes' as TabType, label: 'Observações', icon: '📝' },
    { id: 'preview' as TabType, label: 'Preview', icon: '👁️' }
  ];

  /**
   * Valida os dados do formulário por seção
   * Retorna objeto com erros encontrados para feedback visual
   */
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    // Validação da empresa
    if (!formData.company.nome.trim()) {
      newErrors.empresa = [...(newErrors.empresa || []), 'Nome da empresa é obrigatório'];
    }

    // Validação do cliente
    if (!formData.client.nome.trim()) {
      newErrors.cliente = [...(newErrors.cliente || []), 'Nome do cliente é obrigatório'];
    }

    // Validação dos KPIs
    if (formData.kpis.potenciaKWp <= 0) {
      newErrors.kpis = [...(newErrors.kpis || []), 'Potência deve ser maior que zero'];
    }
    if (formData.kpis.energiaMensalKWh <= 0) {
      newErrors.kpis = [...(newErrors.kpis || []), 'Energia mensal deve ser maior que zero'];
    }
    if (formData.finance.capexBRL <= 0) {
      newErrors.kpis = [...(newErrors.kpis || []), 'Investimento deve ser maior que zero'];
    }

    // Validação dos itens
    if (formData.itens.length === 0) {
      newErrors.itens = ['Pelo menos um item deve ser adicionado'];
    }

    return newErrors;
  }, [formData]);

  /**
   * Navega para a próxima aba se a atual estiver válida
   * Implementa fluxo guiado de preenchimento
   */
  const handleNextTab = useCallback(() => {
    const currentErrors = validateForm();
    setErrors(currentErrors);

    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const hasCurrentErrors = currentErrors[activeTab]?.length > 0;

    if (!hasCurrentErrors && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  }, [activeTab, tabs, validateForm]);

  /**
   * Gera o PDF da proposta solar com gráficos automáticos
   * Integra Chart.js e PDF-lib para documento completo
   */
  const handleGeneratePDF = useCallback(async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    const hasErrors = Object.values(formErrors).some(errors => errors.length > 0);
    if (hasErrors) {
      alert('Por favor, corrija os erros antes de gerar o PDF.');
      return;
    }

    setIsGenerating(true);

    try {
      console.log('Iniciando geração de PDF...');
      console.log('Dados do formulário:', formData);

      // Validar dados críticos antes da geração
      if (!formData.client.nome || formData.client.nome.trim() === '') {
        throw new Error('Nome do cliente é obrigatório');
      }
      
      if (formData.finance.capexBRL <= 0) {
        throw new Error('Valor do investimento deve ser maior que zero');
      }
      
      if (formData.kpis.economiaAnualBRL <= 0) {
        throw new Error('Economia anual deve ser maior que zero');
      }
      
      if (formData.kpis.energiaMensalKWh <= 0) {
        throw new Error('Energia mensal deve ser maior que zero');
      }

      console.log('Gerando gráfico de payback...');
      // Gerar gráficos automaticamente
      const paybackChart = await generatePaybackChart(
        formData.finance.capexBRL,
        formData.kpis.economiaAnualBRL,
        25,
        800,
        500
      );
      console.log('Gráfico de payback gerado com sucesso');

      console.log('Gerando gráfico de geração anual...');
      const geracaoChart = await generateGeracaoAnualChart(
        formData.kpis.energiaMensalKWh,
        formData.finance.degradacaoAnual || 0.005,
        25,
        800,
        500
      );
      console.log('Gráfico de geração anual gerado com sucesso');

      console.log('Gerando PDF...');
      // Gerar PDF
      const pdfBytes = await buildSolarProposalPDF(formData, {
        charts: {
          paybackChart,
          geracaoAnualChart: geracaoChart
        }
      });
      console.log('PDF gerado com sucesso');

      // Download automático
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Sanitizar nome do arquivo
      const clienteNome = formData.client.nome.trim().replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
      link.download = `Proposta-Solar-${clienteNome}-${formData.dataISO}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Download iniciado com sucesso');
      // Fechar modal após sucesso
      onClose();
    } catch (error) {
      console.error('Erro detalhado ao gerar PDF:', error);
      
      let errorMessage = 'Erro ao gerar PDF. ';
      
      if (error instanceof Error) {
        errorMessage += error.message;
      } else if (typeof error === 'string') {
        errorMessage += error;
      } else {
        errorMessage += 'Verifique os dados e tente novamente.';
      }
      
      // Verificar se é erro específico do Chart.js ou Canvas
      if (error instanceof Error && error.message.includes('canvas')) {
        errorMessage = 'Erro na geração de gráficos. Verifique se todos os valores numéricos estão corretos.';
      }
      
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [formData, validateForm, onClose]);

  /**
   * Atualiza dados do formulário de forma type-safe
   * Mantém imutabilidade do estado
   */
  const updateFormData = useCallback((updates: Partial<SolarProposalData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              Nova Proposta Solar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8" aria-label="Seções do formulário">
            {tabs.map((tab) => {
              const hasErrors = errors[tab.id]?.length > 0;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                    ${isActive 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    ${hasErrors ? 'text-red-600' : ''}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {hasErrors && (
                    <AlertCircle className="w-4 h-4 text-red-500" aria-label="Erros nesta seção" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'empresa' && (
            <EmpresaForm 
              data={formData.company} 
              onChange={(company) => updateFormData({ company })}
              errors={errors.empresa || []}
            />
          )}
          
          {activeTab === 'cliente' && (
            <ClienteForm 
              data={formData.client} 
              onChange={(client) => updateFormData({ client })}
              errors={errors.cliente || []}
            />
          )}
          
          {activeTab === 'kpis' && (
            <KpisForm 
              kpis={formData.kpis}
              finance={formData.finance}
              onChange={(kpis, finance) => updateFormData({ kpis, finance })}
              errors={errors.kpis || []}
            />
          )}
          
          {activeTab === 'itens' && (
            <ItensForm 
              itens={formData.itens}
              onChange={(itens) => updateFormData({ itens })}
              errors={errors.itens || []}
            />
          )}
          
          {activeTab === 'observacoes' && (
            <ObservacoesForm 
              observacoes={formData.observacoes || []}
              premissasTecnicas={formData.premissasTecnicas || []}
              onChange={(observacoes, premissasTecnicas) => 
                updateFormData({ observacoes, premissasTecnicas })
              }
            />
          )}
          
          {activeTab === 'preview' && (
            <PreviewDados data={formData} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {Object.keys(errors).length > 0 && (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>Corrija os erros antes de continuar</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {activeTab !== 'preview' && (
              <button
                onClick={handleNextTab}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Próximo
              </button>
            )}
            
            {activeTab === 'preview' && (
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating || Object.keys(errors).length > 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Gerar PDF
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}