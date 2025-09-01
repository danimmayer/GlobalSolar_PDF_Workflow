// EmpresaForm.tsx
// Formulário para coleta de dados da empresa
// Inclui validação de CNPJ e campos obrigatórios

import React from 'react';
import { Building2, Mail, MapPin, Phone, Info } from 'lucide-react';
import type { Company } from '../../proposta-solar-pdf';

interface EmpresaFormProps {
  data: Company;
  onChange: (data: Company) => void;
  errors: string[];
}

/**
 * Valida formato básico de CNPJ
 * Remove caracteres especiais e verifica se tem 14 dígitos
 */
function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.length === 14;
}

/**
 * Formata CNPJ com máscara visual
 * Aplica formato XX.XXX.XXX/XXXX-XX
 */
function formatCNPJ(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
  }
  return cleaned;
}

/**
 * Formulário para dados da empresa
 * Implementa validação em tempo real e formatação automática
 */
export function EmpresaForm({ data, onChange, errors }: EmpresaFormProps) {
  const handleInputChange = (field: keyof Company, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    onChange({ ...data, cnpj: formatted });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Dados da Empresa</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome da Empresa */}
        <div className="md:col-span-2">
          <label 
            htmlFor="empresa-nome" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nome da Empresa <span className="text-red-500">*</span>
          </label>
          <input
            id="empresa-nome"
            type="text"
            value={data.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Ex: Solar Tech Ltda"
            required
            aria-describedby={errors.some(e => e.includes('Nome')) ? 'nome-error' : undefined}
          />
          {errors.some(e => e.includes('Nome')) && (
            <p id="nome-error" className="mt-1 text-sm text-red-600">
              Nome da empresa é obrigatório
            </p>
          )}
        </div>

        {/* CNPJ */}
        <div>
          <label 
            htmlFor="empresa-cnpj" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            CNPJ
          </label>
          <input
            id="empresa-cnpj"
            type="text"
            value={data.cnpj || ''}
            onChange={(e) => handleCNPJChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="00.000.000/0000-00"
            maxLength={18}
          />
          {data.cnpj && !isValidCNPJ(data.cnpj) && (
            <p className="mt-1 text-sm text-amber-600">
              Formato de CNPJ inválido
            </p>
          )}
        </div>

        {/* Contato */}
        <div>
          <label 
            htmlFor="empresa-contato" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <Phone className="w-4 h-4 inline mr-1" />
            Contato
          </label>
          <input
            id="empresa-contato"
            type="text"
            value={data.contato || ''}
            onChange={(e) => handleInputChange('contato', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="(00) 00000-0000 • email@empresa.com"
          />
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
          <label 
            htmlFor="empresa-endereco" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            Endereço
          </label>
          <textarea
            id="empresa-endereco"
            value={data.endereco || ''}
            onChange={(e) => handleInputChange('endereco', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Rua, número, bairro, cidade - UF, CEP"
          />
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-medium text-blue-800">Dicas Importantes:</h4>
          </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• O nome da empresa aparecerá no cabeçalho da proposta</li>
          <li>• CNPJ é opcional, mas recomendado para propostas comerciais</li>
          <li>• Inclua telefone e email no campo contato para facilitar comunicação</li>
          <li>• Endereço completo transmite mais credibilidade</li>
        </ul>
      </div>
    </div>
  );
}