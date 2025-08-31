// ItensForm.tsx
// Formulário para gerenciamento de itens do sistema solar
// Permite adicionar, editar e remover itens com cálculo automático de totais

import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Package, DollarSign } from 'lucide-react';
import type { EquipItem } from '../../proposta-solar-pdf';

interface ItensFormProps {
  itens: EquipItem[];
  onChange: (itens: EquipItem[]) => void;
  errors: string[];
}

interface ItemFormData {
  descricao: string;
  qtd: number;
  precoUnit: number;
}

/**
 * Itens pré-definidos comuns em sistemas solares
 * Facilita o preenchimento rápido de propostas
 */
const ITENS_PREDEFINIDOS: ItemFormData[] = [
  {
    descricao: "Módulo Fotovoltaico 550 Wp - Monocristalino PERC",
    qtd: 10,
    precoUnit: 899
  },
  {
    descricao: "Inversor String 5 kW - Monofásico com Wi-Fi",
    qtd: 1,
    precoUnit: 5200
  },
  {
    descricao: "Estruturas de fixação para telha cerâmica - Kit completo",
    qtd: 1,
    precoUnit: 3100
  },
  {
    descricao: "Cabo solar 6 mm² - Rolo com 100 metros",
    qtd: 1,
    precoUnit: 590
  },
  {
    descricao: "String Box DC/AC - Proteção e seccionamento",
    qtd: 1,
    precoUnit: 850
  },
  {
    descricao: "Mão de obra especializada - Instalação e comissionamento",
    qtd: 1,
    precoUnit: 4800
  },
  {
    descricao: "Projeto elétrico e documentação técnica",
    qtd: 1,
    precoUnit: 1200
  }
];

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
 * Formulário para gerenciamento de itens do sistema
 * Permite CRUD completo com templates pré-definidos
 */
export function ItensForm({ itens, onChange, errors }: ItensFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showPredefinidos, setShowPredefinidos] = useState(false);
  
  const [formData, setFormData] = useState<ItemFormData>({
    descricao: '',
    qtd: 1,
    precoUnit: 0
  });

  const subtotal = itens.reduce((sum, item) => sum + (item.qtd * item.precoUnit), 0);

  /**
   * Reseta o formulário para estado inicial
   */
  const resetForm = () => {
    setFormData({ descricao: '', qtd: 1, precoUnit: 0 });
    setIsAdding(false);
    setEditingIndex(null);
  };

  /**
   * Adiciona novo item à lista
   */
  const handleAddItem = () => {
    if (!formData.descricao.trim() || formData.qtd <= 0 || formData.precoUnit <= 0) {
      alert('Preencha todos os campos corretamente');
      return;
    }

    const newItem: EquipItem = {
      descricao: formData.descricao.trim(),
      qtd: formData.qtd,
      precoUnit: formData.precoUnit
    };

    onChange([...itens, newItem]);
    resetForm();
  };

  /**
   * Atualiza item existente
   */
  const handleUpdateItem = () => {
    if (editingIndex === null) return;
    
    if (!formData.descricao.trim() || formData.qtd <= 0 || formData.precoUnit <= 0) {
      alert('Preencha todos os campos corretamente');
      return;
    }

    const updatedItens = [...itens];
    updatedItens[editingIndex] = {
      descricao: formData.descricao.trim(),
      qtd: formData.qtd,
      precoUnit: formData.precoUnit
    };

    onChange(updatedItens);
    resetForm();
  };

  /**
   * Remove item da lista
   */
  const handleRemoveItem = (index: number) => {
    const updatedItens = itens.filter((_, i) => i !== index);
    onChange(updatedItens);
  };

  /**
   * Inicia edição de um item
   */
  const handleEditItem = (index: number) => {
    const item = itens[index];
    setFormData({
      descricao: item.descricao,
      qtd: item.qtd,
      precoUnit: item.precoUnit
    });
    setEditingIndex(index);
    setIsAdding(true);
  };

  /**
   * Adiciona item pré-definido
   */
  const handleAddPredefinido = (item: ItemFormData) => {
    const newItem: EquipItem = {
      descricao: item.descricao,
      qtd: item.qtd,
      precoUnit: item.precoUnit
    };
    onChange([...itens, newItem]);
    setShowPredefinidos(false);
  };

  /**
   * Carrega todos os itens pré-definidos
   */
  const handleLoadTemplate = () => {
    onChange(ITENS_PREDEFINIDOS);
    setShowPredefinidos(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Itens do Sistema</h3>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowPredefinidos(!showPredefinidos)}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            📋 Templates
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Item
          </button>
        </div>
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

      {/* Templates Pré-definidos */}
      {showPredefinidos && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900">Templates de Itens</h4>
            <button
              onClick={handleLoadTemplate}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Carregar Todos
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ITENS_PREDEFINIDOS.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {item.descricao}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Qtd: {item.qtd} • {formatCurrency(item.precoUnit)}
                </div>
                <button
                  onClick={() => handleAddPredefinido(item)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário de Adição/Edição */}
      {isAdding && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {editingIndex !== null ? 'Editar Item' : 'Novo Item'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Descrição */}
            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ex: Módulo Fotovoltaico 550 Wp"
              />
            </div>

            {/* Quantidade */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qtd *
              </label>
              <input
                type="number"
                min="1"
                value={formData.qtd || ''}
                onChange={(e) => setFormData({ ...formData, qtd: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Preço Unitário */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Unit. (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.precoUnit || ''}
                onChange={(e) => setFormData({ ...formData, precoUnit: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Ações */}
            <div className="md:col-span-2 flex items-end gap-2">
              <button
                onClick={editingIndex !== null ? handleUpdateItem : handleAddItem}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1"
              >
                {editingIndex !== null ? 'Salvar' : 'Adicionar'}
              </button>
              <button
                onClick={resetForm}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Itens */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {itens.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum item adicionado ainda</p>
            <p className="text-sm">Clique em "Adicionar Item" ou use os templates</p>
          </div>
        ) : (
          <>
            {/* Cabeçalho da Tabela */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-6">Descrição</div>
                <div className="col-span-2 text-center">Qtd</div>
                <div className="col-span-2 text-right">Preço Unit.</div>
                <div className="col-span-1 text-right">Total</div>
                <div className="col-span-1 text-center">Ações</div>
              </div>
            </div>

            {/* Itens */}
            <div className="divide-y divide-gray-200">
              {itens.map((item, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <div className="text-sm font-medium text-gray-900">
                        {item.descricao}
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-sm text-gray-600">
                      {item.qtd}
                    </div>
                    <div className="col-span-2 text-right text-sm text-gray-600">
                      {formatCurrency(item.precoUnit)}
                    </div>
                    <div className="col-span-1 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(item.qtd * item.precoUnit)}
                    </div>
                    <div className="col-span-1 flex justify-center gap-1">
                      <button
                        onClick={() => handleEditItem(index)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Editar item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
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

            {/* Total */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {itens.length} {itens.length === 1 ? 'item' : 'itens'}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dicas */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-amber-800 mb-2">💡 Dicas:</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Use os templates para agilizar o preenchimento</li>
          <li>• Inclua todos os componentes: módulos, inversor, estruturas, cabos</li>
          <li>• Não esqueça da mão de obra e projeto elétrico</li>
          <li>• Preços devem incluir impostos quando aplicável</li>
        </ul>
      </div>
    </div>
  );
}