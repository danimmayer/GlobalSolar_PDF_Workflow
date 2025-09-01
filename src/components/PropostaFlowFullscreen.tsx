import React, { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SolarProposalData } from '../proposta-solar-pdf';
import PaginaUm from './forms/PaginaUm';

/**
 * Interface para definir as props do componente de fluxo fullscreen
 * Permite controle externo do estado de abertura e callback para geração
 */
interface PropostaFlowFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: SolarProposalData) => void;
}

/**
 * Interface para definir a estrutura de cada página do fluxo
 * Facilita a manutenção e extensão das páginas
 */
interface FlowPage {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

/**
 * Componente principal do fluxo de coleta de dados em tela cheia
 * Substitui o modal anterior por uma experiência mais espaçosa e organizada
 * 
 * @param isOpen - Controla a visibilidade do fluxo
 * @param onClose - Callback executado ao fechar o fluxo
 * @param onGenerate - Callback executado ao finalizar a coleta de dados
 */
const PropostaFlowFullscreen: React.FC<PropostaFlowFullscreenProps> = ({ 
  isOpen, 
  onClose, 
  onGenerate 
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState<Partial<SolarProposalData>>({});

  /**
   * Controla o scroll do body para evitar que a página de fundo seja rolada
   * quando o modal estiver aberto
   */
  useEffect(() => {
    if (isOpen) {
      // Bloqueia o scroll do body quando o modal está aberto
      document.body.classList.add('overflow-hidden');
    } else {
      // Restaura o scroll do body quando o modal é fechado
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup: garante que o scroll seja restaurado quando o componente for desmontado
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  /**
   * Atualiza os dados do formulário de forma imutável
   * Utiliza useCallback para otimizar performance em re-renders
   */
  const updateFormData = useCallback((section: string, data: any) => {
    setFormData(prev => ({ ...prev, [section]: data }));
  }, []);

  /**
   * Navega para a próxima página do fluxo
   * Inclui validação para não ultrapassar o limite
   */
  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage]);

  /**
   * Navega para a página anterior do fluxo
   * Inclui validação para não ir abaixo de zero
   */
  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  /**
   * Finaliza o fluxo e gera a proposta
   * Valida se todos os dados obrigatórios foram preenchidos
   */
  const handleFinish = useCallback(() => {
    if (formData.client && formData.company && formData.items && formData.kpis) {
      onGenerate(formData as SolarProposalData);
      onClose();
      setCurrentPage(0);
      setFormData({});
    }
  }, [formData, onGenerate, onClose]);

  /**
   * Fecha o fluxo e reseta o estado
   * Garante que o estado seja limpo ao fechar
   */
  const handleClose = useCallback(() => {
    onClose();
    setCurrentPage(0);
    setFormData({});
  }, [onClose]);

  // Componente temporário para cada página (será substituído por componentes específicos)
  const PagePlaceholder: React.FC<{ pageNumber: number; title: string }> = ({ pageNumber, title }) => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <span className="text-4xl font-bold text-amber-600">{pageNumber}</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 text-lg">
          Esta é a página {pageNumber} do fluxo de coleta de dados.
          <br />
          Aqui será implementado o formulário específico para {title.toLowerCase()}.
        </p>
      </div>
    </div>
  );

  // Definição das 9 páginas do fluxo
  const pages: FlowPage[] = [
    {
      id: 'dados-iniciais',
      title: 'Dados Iniciais',
      description: 'Dados da unidade geradora e do cliente',
      component: (props: any) => <PaginaUm {...props} />,
    },
    {
      id: 'client-basic',
      title: 'Dados do Cliente',
      description: 'Informações básicas do cliente',
      component: () => <PagePlaceholder pageNumber={2} title="Dados do Cliente" />
    },
    {
      id: 'client-address',
      title: 'Endereço',
      description: 'Localização e endereço completo',
      component: () => <PagePlaceholder pageNumber={3} title="Endereço" />
    },
    {
      id: 'energy-consumption',
      title: 'Consumo Energético',
      description: 'Histórico e padrão de consumo',
      component: () => <PagePlaceholder pageNumber={4} title="Consumo Energético" />
    },
    {
      id: 'roof-analysis',
      title: 'Análise do Telhado',
      description: 'Características e viabilidade técnica',
      component: () => <PagePlaceholder pageNumber={5} title="Análise do Telhado" />
    },
    {
      id: 'equipment-selection',
      title: 'Seleção de Equipamentos',
      description: 'Escolha de painéis e inversores',
      component: () => <PagePlaceholder pageNumber={6} title="Seleção de Equipamentos" />
    },
    {
      id: 'financial-analysis',
      title: 'Análise Financeira',
      description: 'Investimento e retorno financeiro',
      component: () => <PagePlaceholder pageNumber={7} title="Análise Financeira" />
    },
    {
      id: 'additional-info',
      title: 'Informações Adicionais',
      description: 'Observações e detalhes extras',
      component: () => <PagePlaceholder pageNumber={8} title="Informações Adicionais" />
    },
    {
      id: 'review',
      title: 'Revisão Final',
      description: 'Confirmação dos dados antes da geração',
      component: () => <PagePlaceholder pageNumber={9} title="Revisão Final" />
    }
  ];

  const currentPageData = pages[currentPage];
  const CurrentPageComponent = currentPageData.component;
  const isLastPage = currentPage === pages.length - 1;
  const isFirstPage = currentPage === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/LOGO COMPLETA.png" 
              alt="Global Solar" 
              className="h-8"
            />
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentPageData.title}
              </h1>
              <p className="text-sm text-gray-600">
                {currentPageData.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {currentPage + 1} de {pages.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
                />
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col">
          {/* Page Content */}
          <div className="flex-1 p-8">
            <CurrentPageComponent 
              data={formData}
              onChange={updateFormData}
            />
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={prevPage}
            disabled={isFirstPage}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Anterior</span>
          </button>

          <div className="flex space-x-2">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentPage
                    ? 'bg-amber-600'
                    : index < currentPage
                    ? 'bg-amber-300'
                    : 'bg-gray-300'
                }`}
                aria-label={`Ir para página ${index + 1}`}
              />
            ))}
          </div>

          {isLastPage ? (
            <button
              onClick={handleFinish}
              className="flex items-center space-x-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              <span>Gerar Proposta</span>
            </button>
          ) : (
            <button
              onClick={nextPage}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Próximo</span>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default PropostaFlowFullscreen;