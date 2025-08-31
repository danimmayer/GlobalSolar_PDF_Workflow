// exemplo-uso.ts
// Exemplo prático de uso do sistema de geração de PDF
// Demonstra como integrar Chart.js com PDF-lib para criar propostas completas

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { buildSolarProposalPDF, type SolarProposalData, type Assets } from './proposta-solar-pdf.js';
import { 
  generatePaybackChart, 
  generateGeracaoAnualChart,
  generateCostComparisonChart 
} from './chart-generator.js';

/**
 * Dados de exemplo para uma proposta solar real
 * Baseado em um sistema residencial típico de 5.5 kWp
 */
const dadosExemplo: SolarProposalData = {
  titulo: "Proposta Comercial – Sistema Fotovoltaico",
  dataISO: "2025-01-31",
  company: {
    nome: "MAYER Design Co.",
    cnpj: "49.136.647/0001-34",
    endereco: "Centro, São Miguel do Oeste - SC",
    contato: "(49) 99133-6328 • daniel@mayerdesign.co"
  },
  client: {
    nome: "Cliente Exemplo S/A",
    documento: "12.345.678/0001-90",
    endereco: "Rua das Flores, 123 - Centro, Cidade - UF"
  },
  kpis: {
    potenciaKWp: 5.5,
    energiaMensalKWh: 720,
    economiaAnualBRL: 8200,
    paybackAnos: 4.3,
    tirPercent: 23.1
  },
  finance: {
    capexBRL: 36500,
    tarifaBRLkWh: 1.05,
    degradacaoAnual: 0.006
  },
  itens: [
    {
      descricao: "10x Módulo Fotovoltaico 550 Wp – Monocristalino PERC",
      qtd: 10,
      precoUnit: 899
    },
    {
      descricao: "1x Inversor String 5 kW – Monofásico com Wi-Fi",
      qtd: 1,
      precoUnit: 5200
    },
    {
      descricao: "Estruturas de fixação para telha cerâmica – Kit completo",
      qtd: 1,
      precoUnit: 3100
    },
    {
      descricao: "Cabo solar 6 mm² – Rolo com 100 metros",
      qtd: 1,
      precoUnit: 590
    },
    {
      descricao: "String Box DC/AC – Proteção e seccionamento",
      qtd: 1,
      precoUnit: 850
    },
    {
      descricao: "Mão de obra especializada – Instalação e comissionamento",
      qtd: 1,
      precoUnit: 4800
    },
    {
      descricao: "Projeto elétrico e documentação técnica",
      qtd: 1,
      precoUnit: 1200
    }
  ],
  observacoes: [
    "Condições de pagamento: 50% na assinatura do contrato, 50% na entrega. Aceita PIX, transferência ou cartão.",
    "Proposta válida por 15 dias corridos a partir da data de emissão.",
    "Equipamentos disponíveis para retirada no Centro de São Miguel do Oeste – SC.",
    "Prazo de execução: 15 dias úteis após confirmação do pedido e liberação do local.",
    "Garantia: 25 anos para módulos, 10 anos para inversor, 5 anos para instalação."
  ],
  premissasTecnicas: [
    "Projeto elétrico elaborado conforme NBR 16690:2019 e Notas Técnicas da concessionária local.",
    "Performance ratio (PR) considerado: 80% - valor conservador para análise financeira.",
    "Degradação anual dos módulos: 0,6% ao ano conforme ficha técnica do fabricante.",
    "Irradiação solar média: 4,8 kWh/m²/dia (base histórica da região Sul do Brasil).",
    "Fator de simultaneidade: 100% (sistema dimensionado para consumo total).",
    "Não inclui adequações elétricas no quadro geral (se necessárias, orçamento à parte)."
  ]
};

/**
 * Função principal que demonstra o uso completo do sistema
 * Gera gráficos, carrega assets e cria o PDF final
 */
export async function gerarPropostaCompleta(): Promise<void> {
  console.log('🚀 Iniciando geração da proposta solar...');
  
  try {
    // 1. Gerar gráficos usando Chart.js
    console.log('📊 Gerando gráficos...');
    
    const paybackChart = await generatePaybackChart(
      dadosExemplo.finance.capexBRL,
      dadosExemplo.kpis.economiaAnualBRL,
      25, // 25 anos
      800, // largura
      500  // altura
    );
    
    const geracaoChart = await generateGeracaoAnualChart(
      dadosExemplo.kpis.energiaMensalKWh,
      dadosExemplo.finance.degradacaoAnual,
      25, // 25 anos
      800, // largura
      500  // altura
    );
    
    // Gráfico adicional de comparação de custos
    const custoSemSolar = dadosExemplo.kpis.economiaAnualBRL + (dadosExemplo.finance.capexBRL * 0.1); // Simula custo da energia
    const custoComSolar = dadosExemplo.finance.capexBRL * 0.02; // Custo de manutenção anual
    
    const comparisonChart = await generateCostComparisonChart(
      custoSemSolar,
      custoComSolar,
      dadosExemplo.kpis.economiaAnualBRL,
      800,
      500
    );
    
    console.log('✅ Gráficos gerados com sucesso!');
    
    // 2. Carregar logo (se existir)
    let logo: Uint8Array | undefined;
    const logoPath = './assets/logo.png';
    
    if (existsSync(logoPath)) {
      logo = new Uint8Array(readFileSync(logoPath));
      console.log('🖼️  Logo carregado!');
    } else {
      console.log('⚠️  Logo não encontrado, continuando sem logo...');
    }
    
    // 3. Preparar assets
    const assets: Assets = {
      logo,
      charts: {
        paybackChart,
        geracaoAnualChart: geracaoChart
      }
    };
    
    // 4. Gerar PDF
    console.log('📄 Gerando PDF...');
    const pdfBytes = await buildSolarProposalPDF(dadosExemplo, assets);
    
    // 5. Salvar arquivo
    const nomeArquivo = `Proposta-Solar-${new Date().toISOString().split('T')[0]}.pdf`;
    writeFileSync(nomeArquivo, pdfBytes);
    
    console.log(`✅ PDF gerado com sucesso: ${nomeArquivo}`);
    console.log(`📊 Tamanho do arquivo: ${(pdfBytes.length / 1024 / 1024).toFixed(2)} MB`);
    
    // 6. Salvar gráficos individuais para referência
    writeFileSync('payback-chart.png', paybackChart);
    writeFileSync('geracao-chart.png', geracaoChart);
    writeFileSync('comparison-chart.png', comparisonChart);
    
    console.log('📈 Gráficos individuais salvos para referência!');
    
  } catch (error) {
    console.error('❌ Erro ao gerar proposta:', error);
    throw error;
  }
}

/**
 * Função para testar diferentes cenários de propostas
 * Útil para validar o sistema com dados variados
 */
export async function testarCenarios(): Promise<void> {
  console.log('🧪 Testando diferentes cenários...');
  
  const cenarios = [
    {
      nome: 'Sistema Pequeno (3kWp)',
      dados: {
        ...dadosExemplo,
        kpis: {
          ...dadosExemplo.kpis,
          potenciaKWp: 3.0,
          energiaMensalKWh: 400,
          economiaAnualBRL: 4800,
          paybackAnos: 5.2
        },
        finance: {
          ...dadosExemplo.finance,
          capexBRL: 22000
        }
      }
    },
    {
      nome: 'Sistema Grande (10kWp)',
      dados: {
        ...dadosExemplo,
        kpis: {
          ...dadosExemplo.kpis,
          potenciaKWp: 10.0,
          energiaMensalKWh: 1300,
          economiaAnualBRL: 15600,
          paybackAnos: 3.8
        },
        finance: {
          ...dadosExemplo.finance,
          capexBRL: 65000
        }
      }
    }
  ];
  
  for (const cenario of cenarios) {
    console.log(`📋 Gerando cenário: ${cenario.nome}`);
    
    const paybackChart = await generatePaybackChart(
      cenario.dados.finance.capexBRL,
      cenario.dados.kpis.economiaAnualBRL
    );
    
    const geracaoChart = await generateGeracaoAnualChart(
      cenario.dados.kpis.energiaMensalKWh
    );
    
    const assets: Assets = {
      charts: {
        paybackChart,
        geracaoAnualChart: geracaoChart
      }
    };
    
    const pdfBytes = await buildSolarProposalPDF(cenario.dados, assets);
    const nomeArquivo = `Proposta-${cenario.nome.replace(/\s+/g, '-')}.pdf`;
    
    writeFileSync(nomeArquivo, pdfBytes);
    console.log(`✅ ${cenario.nome} gerado: ${nomeArquivo}`);
  }
}

/**
 * Função utilitária para criar assets de exemplo
 * Gera imagens e dados de teste quando necessário
 */
export async function criarAssetsExemplo(): Promise<void> {
  console.log('🎨 Criando assets de exemplo...');
  
  // Criar diretório de assets se não existir
  const fs = await import('fs');
  if (!fs.existsSync('./assets')) {
    fs.mkdirSync('./assets');
  }
  
  // Gerar gráficos de exemplo
  const payback = await generatePaybackChart(36500, 8200);
  const geracao = await generateGeracaoAnualChart(720);
  const comparacao = await generateCostComparisonChart(12000, 800, 8200);
  
  // Salvar como arquivos de referência
  writeFileSync('./assets/exemplo-payback.png', payback);
  writeFileSync('./assets/exemplo-geracao.png', geracao);
  writeFileSync('./assets/exemplo-comparacao.png', comparacao);
  
  console.log('✅ Assets de exemplo criados em ./assets/');
}

// Executar exemplo se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  gerarPropostaCompleta()
    .then(() => console.log('🎉 Processo concluído com sucesso!'))
    .catch(error => {
      console.error('💥 Erro no processo:', error);
      process.exit(1);
    });
}