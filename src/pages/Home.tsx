import React, { useState } from 'react';
import { FileText, Zap, TrendingUp, Download, Plus } from 'lucide-react';
import { PropostaSolarModal } from '../components/PropostaSolarModal';

/**
 * Página principal da aplicação
 * Interface para geração de propostas solares com PDF automático
 */
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Propostas Profissionais",
      description: "Gere propostas solares completas com layout profissional e informações técnicas detalhadas."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Gráficos Automáticos",
      description: "Inclui automaticamente gráficos de payback e geração anual usando Chart.js."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Cálculos Inteligentes",
      description: "Calcula automaticamente KPIs, economia anual, payback e TIR baseado nos dados inseridos."
    },
    {
      icon: <Download className="w-8 h-8 text-purple-600" />,
      title: "Download Direto",
      description: "PDF gerado e baixado automaticamente, pronto para envio ao cliente."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Solar Proposal Generator</h1>
                <p className="text-sm text-gray-600">Gerador de Propostas Fotovoltaicas</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nova Proposta
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Crie Propostas Solares
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> Profissionais</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Sistema completo para geração de propostas comerciais de energia solar fotovoltaica.
            Interface intuitiva, cálculos automáticos e PDF profissional com gráficos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center gap-3 font-semibold text-lg shadow-xl transform hover:scale-105"
            >
              <FileText className="w-6 h-6" />
              Criar Proposta Agora
            </button>
            
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center gap-3 font-semibold text-lg">
              <TrendingUp className="w-6 h-6" />
              Ver Exemplo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Como Funciona
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Dados da Empresa</h4>
              <p className="text-sm text-gray-600">Informe os dados da sua empresa e do cliente</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">KPIs & Sistema</h4>
              <p className="text-sm text-gray-600">Configure potência, geração e dados financeiros</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Itens & Observações</h4>
              <p className="text-sm text-gray-600">Adicione equipamentos e condições comerciais</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">PDF Automático</h4>
              <p className="text-sm text-gray-600">Gere e baixe o PDF com gráficos inclusos</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Pronto para Criar sua Primeira Proposta?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Sistema completo com validação de dados, cálculos automáticos e geração de PDF profissional.
            Tudo que você precisa para impressionar seus clientes.
          </p>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
          >
            Começar Agora - É Grátis
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Solar Proposal Generator. Desenvolvido com React, TypeScript, PDF-lib e Chart.js.
          </p>
        </div>
      </footer>

      {/* Modal */}
      <PropostaSolarModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}