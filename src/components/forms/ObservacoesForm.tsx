// ObservacoesForm.tsx
// Formulário para observações comerciais e premissas técnicas
// Permite adicionar, editar e organizar informações complementares

import React, { useState } from 'react';
import { Plus, Trash2, Edit3, FileText, Settings, Lightbulb } from 'lucide-react';

interface ObservacoesFormProps {
  observacoes: string[];
  premissasTecnicas: string[];
  onChange: (observacoes: string[], premissasTecnicas: string[]) => void;
}

type SectionType = 'observacoes' | 'premissas';

/**
 * Templates de observações comerciais comuns
 * Facilita o preenchimento com textos padrão
 */
const OBSERVACOES_TEMPLATES = [
  "Condições de pagamento: 50% na assinatura do contrato, 50% na entrega. Aceita PIX, transferência ou cartão.",
  "Proposta válida por 15 dias corridos a partir da data de emissão.",
  "Equipamentos disponíveis para retirada no depósito da empresa.",
  "Prazo de execução: 15 dias úteis após confirmação do pedido e liberação do local.",
  "Garantia: 25 anos para módulos, 10 anos para inversor, 5 anos para instalação.",
  "Não inclui adequações elétricas no quadro geral (se necessárias, orçamento à parte).",
  "Cliente deve fornecer acesso ao local e ponto de energia para instalação.",
  "Frete incluso para entregas na região metropolitana."
];

/**
 * Templates de premissas técnicas comuns
 * Padroniza informações técnicas importantes
 */
const PREMISSAS_TEMPLATES = [
  "Projeto elétrico elaborado conforme NBR 16690:2019 e Notas Técnicas da concessionária local.",
  "Performance ratio (PR) considerado: 80% - valor conservador para análise financeira.",
  "Degradação anual dos módulos: 0,6% ao ano conforme ficha técnica do fabricante.",
  "Irradiação solar média: 4,8 kWh/m²/dia (base histórica da região Sul do Brasil).",
  "Fator de simultaneidade: 100% (sistema dimensionado para consumo total).",
  "Sistema conectado à rede elétrica (on-grid) sem armazenamento de energia.",
  "Orientação dos módulos: Sul com inclinação de 23° (otimizada para a latitude local).",
  "Estruturas dimensionadas para ventos de até 150 km/h conforme NBR 6123."
];

/**
 * Formulário para observações e premissas técnicas
 * Permite gerenciamento completo com templates pré-definidos
 */
export function ObservacoesForm({ observacoes, premissasTecnicas, onChange }: ObservacoesFormProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('observacoes');
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newText, setNewText] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const currentList = activeSection === 'observacoes' ? observacoes : premissasTecnicas;
  const currentTemplates = activeSection === 'observacoes' ? OBSERVACOES_TEMPLATES : PREMISSAS_TEMPLATES;

  /**
   * Atualiza as listas baseado na seção ativa
   */
  const updateList = (newList: string[]) => {
    if (activeSection === 'observacoes') {
      onChange(newList, premissasTecnicas);
    } else {
      onChange(observacoes, newList);
    }
  };

  /**
   * Reseta o formulário para estado inicial
   */
  const resetForm = () => {
    setNewText('');
    setIsAdding(false);
    setEditingIndex(null);
  };

  /**
   * Adiciona novo item à lista
   */
  const handleAddItem = () => {
    if (!newText.trim()) {
      alert('Digite o texto antes de adicionar');
      return;
    }

    updateList([...currentList, newText.trim()]);
    resetForm();
  };

  /**
   * Atualiza item existente
   */
  const handleUpdateItem = () => {
    if (editingIndex === null || !newText.trim()) return;

    const updatedList = [...currentList];
    updatedList[editingIndex] = newText.trim();
    updateList(updatedList);
    resetForm();
  };

  /**
   * Remove item da lista
   */
  const handleRemoveItem = (index: number) => {
    const updatedList = currentList.filter((_, i) => i !== index);
    updateList(updatedList);
  };

  /**
   * Inicia edição de um item
   */
  const handleEditItem = (index: number) => {
    setNewText(currentList[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  /**
   * Adiciona template à lista
   */
  const handleAddTemplate = (template: string) => {
    if (!currentList.includes(template)) {
      updateList([...currentList, template]);
    }
    setShowTemplates(false);
  };

  /**
   * Move item para cima na lista
   */
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...currentList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    updateList(newList);
  };

  /**
   * Move item para baixo na lista
   */
  const handleMoveDown = (index: number) => {
    if (index === currentList.length - 1) return;
    const newList = [...currentList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    updateList(newList);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Observações & Premissas</h3>
      </div>

      {/* Seletor de Seção */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveSection('observacoes')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeSection === 'observacoes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          Observações Comerciais
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
            {observacoes.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSection('premissas')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeSection === 'premissas'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          Premissas Técnicas
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
            {premissasTecnicas.length}
          </span>
        </button>
      </div>

      {/* Ações */}
      <div className="flex justify-between items-center">
        <h4 className="text-md font-semibold text-gray-900">
          {activeSection === 'observacoes' ? 'Observações Comerciais' : 'Premissas Técnicas'}
        </h4>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            📋 Templates
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </div>

      {/* Templates */}
      {showTemplates && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h5 className="text-sm font-semibold text-gray-900 mb-3">
            Templates - {activeSection === 'observacoes' ? 'Observações Comerciais' : 'Premissas Técnicas'}
          </h5>
          
          <div className="space-y-2">
            {currentTemplates.map((template, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="text-sm text-gray-700 mb-2">
                  {template}
                </div>
                <button
                  onClick={() => handleAddTemplate(template)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  disabled={currentList.includes(template)}
                >
                  {currentList.includes(template) ? 'Já adicionado' : 'Adicionar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário de Adição/Edição */}
      {isAdding && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h5 className="text-md font-semibold text-gray-900 mb-4">
            {editingIndex !== null ? 'Editar Item' : 'Novo Item'}
          </h5>
          
          <div className="space-y-4">
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder={`Digite ${activeSection === 'observacoes' ? 'a observação comercial' : 'a premissa técnica'}...`}
            />
            
            <div className="flex gap-2">
              <button
                onClick={editingIndex !== null ? handleUpdateItem : handleAddItem}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={!newText.trim()}
              >
                {editingIndex !== null ? 'Salvar' : 'Adicionar'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Itens */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {currentList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum item adicionado ainda</p>
            <p className="text-sm">
              {activeSection === 'observacoes' 
                ? 'Adicione observações comerciais como condições de pagamento, prazos e garantias'
                : 'Adicione premissas técnicas como normas, performance ratio e condições de projeto'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {currentList.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                    {item}
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center gap-1">
                    {/* Mover para cima */}
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Mover para cima"
                    >
                      ↑
                    </button>
                    
                    {/* Mover para baixo */}
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === currentList.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Mover para baixo"
                    >
                      ↓
                    </button>
                    
                    {/* Editar */}
                    <button
                      onClick={() => handleEditItem(index)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Editar item"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    {/* Remover */}
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dicas */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-amber-800 mb-2">💡 Dicas:</h4>
        <div className="text-sm text-amber-700 space-y-1">
          {activeSection === 'observacoes' ? (
            <>
              <p>• Inclua condições de pagamento, prazos de validade e garantias</p>
              <p>• Especifique o que está e o que não está incluído no orçamento</p>
              <p>• Mencione responsabilidades do cliente (acesso, energia, etc.)</p>
              <p>• Use linguagem clara e profissional</p>
            </>
          ) : (
            <>
              <p>• Referencie normas técnicas aplicáveis (NBR 16690, etc.)</p>
              <p>• Especifique premissas de cálculo (PR, irradiação, degradação)</p>
              <p>• Inclua informações sobre orientação e inclinação dos módulos</p>
              <p>• Mencione condições climáticas consideradas no projeto</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}