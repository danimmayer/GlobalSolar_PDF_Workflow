// ItensForm.tsx
// Formulário para gerenciamento de itens do sistema solar
// Permite adicionar, editar e remover itens com cálculo automático de totais

import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Package, DollarSign, Search } from 'lucide-react';
import { PRODUCT_CATALOG, getProductsByCategory, getProductById, type Product } from '../../data/product-catalog';

// Tipo para itens de equipamento
export type EquipItem = {
  descricao: string;
  qtd: number;
  precoUnit: number; // BRL
};

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
 * Categorias de produtos disponíveis no catálogo
 */
const PRODUCT_CATEGORIES = [
  { value: 'placas', label: 'Placas Solares' },
  { value: 'inversor', label: 'Inversores' },
  { value: 'estrutura', label: 'Estruturas' },
  { value: 'servicos', label: 'Serviços' }
] as const;

/**
 * Formata valor monetário em BRL
 */
function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Componente principal do formulário de itens
 */
export function ItensForm({ itens, onChange, errors }: ItensFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Product['category'] | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({
    descricao: '',
    qtd: 1,
    precoUnit: 0
  });

  /**
   * Calcula o valor total de todos os itens
   */
  const totalValue = itens.reduce((sum, item) => sum + (item.qtd * item.precoUnit), 0);

  /**
   * Reseta o formulário para estado inicial
   */
  const resetForm = () => {
    setFormData({ descricao: '', qtd: 1, precoUnit: 0 });
    setEditingIndex(null);
    setShowForm(false);
  };

  /**
   * Adiciona ou edita um item
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao.trim() || formData.qtd <= 0 || formData.precoUnit < 0) {
      return;
    }

    const newItem: EquipItem = {
      descricao: formData.descricao.trim(),
      qtd: formData.qtd,
      precoUnit: formData.precoUnit
    };

    if (editingIndex !== null) {
      // Editando item existente
      const updatedItens = [...itens];
      updatedItens[editingIndex] = newItem;
      onChange(updatedItens);
    } else {
      // Adicionando novo item
      onChange([...itens, newItem]);
    }

    resetForm();
  };

  /**
   * Remove um item da lista
   */
  const handleRemove = (index: number) => {
    const updatedItens = itens.filter((_, i) => i !== index);
    onChange(updatedItens);
  };

  /**
   * Inicia edição de um item
   */
  const handleEdit = (index: number) => {
    const item = itens[index];
    setFormData({
      descricao: item.descricao,
      qtd: item.qtd,
      precoUnit: item.precoUnit
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  /**
   * Adiciona produto do catálogo à lista
   */
  const handleAddProduct = (product: Product) => {
    const newItem: EquipItem = {
      descricao: product.description,
      qtd: 1,
      precoUnit: product.unitPrice
    };
    onChange([...itens, newItem]);
    setShowCatalog(false);
  };

  /**
   * Filtra produtos baseado na categoria e termo de busca
   */
  const getFilteredProducts = () => {
    let products = selectedCategory ? getProductsByCategory(selectedCategory) : PRODUCT_CATALOG;
    
    if (searchTerm) {
      products = products.filter(product => 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return products;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Itens do Sistema</h3>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowCatalog(!showCatalog)}
            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1.5 min-w-[100px] justify-center"
          >
            <Search className="w-3.5 h-3.5" />
            Catálogo
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5 min-w-[120px] justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar Item
          </button>
        </div>
      </div>

      {/* Catálogo de Produtos */}
      {showCatalog && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900">Catálogo de Produtos</h4>
            <button
              onClick={() => setShowCatalog(false)}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Product['category'] | '')}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todas as categorias</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Buscar produto
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite para buscar..."
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Lista de Produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
            {getFilteredProducts().map((product) => (
              <div key={product.id} className="bg-white p-2 rounded border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                  {product.description}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {formatCurrency(product.unitPrice)}
                </div>
                <button
                  onClick={() => handleAddProduct(product)}
                  className="w-full text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
          
          {getFilteredProducts().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      )}

      {/* Formulário de Adição/Edição */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            {editingIndex !== null ? 'Editar Item' : 'Adicionar Novo Item'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
              Descrição <span className="text-red-500">*</span>
            </label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: Placa Solar Monocristalina 550W Jinko Solar"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
              Quantidade <span className="text-red-500">*</span>
            </label>
                <input
                  type="number"
                  min="1"
                  value={formData.qtd}
                  onChange={(e) => setFormData({ ...formData, qtd: parseInt(e.target.value) || 1 })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
              Preço Unitário (R$) <span className="text-red-500">*</span>
            </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.precoUnit}
                  onChange={(e) => setFormData({ ...formData, precoUnit: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-w-[80px]"
              >
                {editingIndex !== null ? 'Atualizar' : 'Adicionar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors min-w-[80px]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Itens */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-700">
            <div className="col-span-5">Descrição</div>
            <div className="col-span-2 text-center">Qtde</div>
            <div className="col-span-2 text-right">Preço Unit.</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1 text-center">Ações</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {itens.length === 0 ? (
            <div className="px-3 py-6 text-center text-gray-500 text-sm">
              Nenhum item adicionado. Use o catálogo ou adicione manualmente.
            </div>
          ) : (
            itens.map((item, index) => (
              <div key={index} className="px-3 py-2 hover:bg-gray-50">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <div className="text-xs font-medium text-gray-900 line-clamp-2">
                      {item.descricao}
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-xs text-gray-600">
                    {item.qtd}
                  </div>
                  <div className="col-span-2 text-right text-xs text-gray-600">
                    {formatCurrency(item.precoUnit)}
                  </div>
                  <div className="col-span-2 text-right text-xs font-medium text-gray-900">
                    {formatCurrency(item.qtd * item.precoUnit)}
                  </div>
                  <div className="col-span-1 flex justify-center gap-0.5">
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemove(index)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Total */}
        {itens.length > 0 && (
          <div className="bg-gray-50 px-3 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Total Geral:</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Erros */}
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
    </div>
  );
}