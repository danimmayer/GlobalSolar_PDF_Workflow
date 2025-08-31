// ClienteForm.tsx
// Formulário para coleta de dados do cliente
// Suporta tanto CPF quanto CNPJ com validação automática

import React from 'react';
import { User, MapPin, CreditCard, Building2, Info } from 'lucide-react';
import type { Client } from '../../proposta-solar-pdf';

interface ClienteFormProps {
  data: Client;
  onChange: (data: Client) => void;
  errors: string[];
}

/**
 * Detecta se o documento é CPF ou CNPJ baseado no comprimento
 * CPF: 11 dígitos, CNPJ: 14 dígitos
 */
function detectDocumentType(doc: string): 'cpf' | 'cnpj' | 'unknown' {
  const cleaned = doc.replace(/\D/g, '');
  if (cleaned.length === 11) return 'cpf';
  if (cleaned.length === 14) return 'cnpj';
  return 'unknown';
}

/**
 * Formata CPF com máscara visual
 * Aplica formato XXX.XXX.XXX-XX
 */
function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cleaned;
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
 * Formata documento automaticamente baseado no tipo detectado
 * Aplica máscara de CPF ou CNPJ conforme apropriado
 */
function formatDocument(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const type = detectDocumentType(cleaned);
  
  if (type === 'cpf') return formatCPF(cleaned);
  if (type === 'cnpj') return formatCNPJ(cleaned);
  return cleaned;
}

/**
 * Valida formato básico de CPF
 * Verifica se tem 11 dígitos (validação completa seria mais complexa)
 */
function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11;
}

/**
 * Valida formato básico de CNPJ
 * Verifica se tem 14 dígitos (validação completa seria mais complexa)
 */
function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.length === 14;
}

/**
 * Formulário para dados do cliente
 * Detecta automaticamente CPF/CNPJ e aplica formatação apropriada
 */
export function ClienteForm({ data, onChange, errors }: ClienteFormProps) {
  const handleInputChange = (field: keyof Client, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value);
    onChange({ ...data, documento: formatted });
  };

  const documentType = data.documento ? detectDocumentType(data.documento) : 'unknown';
  const isDocumentValid = data.documento ? 
    (documentType === 'cpf' ? isValidCPF(data.documento) : 
     documentType === 'cnpj' ? isValidCNPJ(data.documento) : false) : true;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Dados do Cliente</h3>
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
        {/* Nome do Cliente */}
        <div className="md:col-span-2">
          <label 
            htmlFor="cliente-nome" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nome do Cliente *
          </label>
          <input
            id="cliente-nome"
            type="text"
            value={data.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Ex: João Silva ou Empresa Cliente Ltda"
            required
            aria-describedby={errors.some(e => e.includes('Nome')) ? 'cliente-nome-error' : undefined}
          />
          {errors.some(e => e.includes('Nome')) && (
            <p id="cliente-nome-error" className="mt-1 text-sm text-red-600">
              Nome do cliente é obrigatório
            </p>
          )}
        </div>

        {/* CPF/CNPJ */}
        <div>
          <label 
            htmlFor="cliente-documento" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <CreditCard className="w-4 h-4 inline mr-1" />
            CPF/CNPJ
          </label>
          <input
            id="cliente-documento"
            type="text"
            value={data.documento || ''}
            onChange={(e) => handleDocumentChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            maxLength={18}
          />
          {data.documento && (
            <div className="mt-1 text-xs">
              {documentType === 'cpf' && (
                <span className={`${isDocumentValid ? 'text-green-600' : 'text-amber-600'}`}>
                  {isDocumentValid ? '✓ CPF válido' : '⚠ Formato de CPF inválido'}
                </span>
              )}
              {documentType === 'cnpj' && (
                <span className={`${isDocumentValid ? 'text-green-600' : 'text-amber-600'}`}>
                  {isDocumentValid ? '✓ CNPJ válido' : '⚠ Formato de CNPJ inválido'}
                </span>
              )}
              {documentType === 'unknown' && (
                <span className="text-gray-500">
                  Digite CPF (11 dígitos) ou CNPJ (14 dígitos)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tipo de Cliente (baseado no documento) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Cliente
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 flex items-center gap-2">
            {documentType === 'cpf' && (
              <>
                <User className="w-4 h-4" />
                Pessoa Física
              </>
            )}
            {documentType === 'cnpj' && (
              <>
                <Building2 className="w-4 h-4" />
                Pessoa Jurídica
              </>
            )}
            {documentType === 'unknown' && 'Não identificado'}
          </div>
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
          <label 
            htmlFor="cliente-endereco" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            Endereço da Instalação
          </label>
          <textarea
            id="cliente-endereco"
            value={data.endereco || ''}
            onChange={(e) => handleInputChange('endereco', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Endereço onde o sistema solar será instalado\nRua, número, bairro, cidade - UF, CEP"
          />
          <p className="mt-1 text-xs text-gray-500">
            Informe o endereço onde o sistema fotovoltaico será instalado
          </p>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-blue-800">Informações Importantes:</h4>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• O sistema detecta automaticamente se é CPF ou CNPJ</li>
          <li>• CPF/CNPJ é opcional, mas recomendado para contratos formais</li>
          <li>• O endereço deve ser o local da instalação do sistema solar</li>
          <li>• Para empresas, use a razão social no nome do cliente</li>
        </ul>
      </div>
    </div>
  );
}