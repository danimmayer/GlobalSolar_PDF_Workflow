// test-pdf-generation.ts
// Script de teste completo para demonstrar a funcionalidade de geração de PDF
// Executa todos os cenários e valida o sistema

import { gerarPropostaCompleta, testarCenarios, criarAssetsExemplo } from './exemplo-uso.js';
import { generatePaybackChart, generateGeracaoAnualChart } from './chart-generator.js';
import { buildSolarProposalPDF, type SolarProposalData } from './proposta-solar-pdf.js';
import { writeFileSync } from 'fs';

/**
 * Teste básico de geração de gráficos
 * Valida se o Chart.js está funcionando corretamente
 */
async function testeGeracaoGraficos(): Promise<boolean> {
  console.log('\n🧪 Teste 1: Geração de Gráficos');
  console.log('================================');
  
  try {
    // Teste do gráfico de payback
    console.log('📊 Testando gráfico de payback...');
    const paybackChart = await generatePaybackChart(30000, 6000, 20, 400, 300);
    
    if (paybackChart.length === 0) {
      throw new Error('Gráfico de payback vazio');
    }
    
    console.log(`✅ Payback chart gerado: ${paybackChart.length} bytes`);
    
    // Teste do gráfico de geração
    console.log('📊 Testando gráfico de geração...');
    const geracaoChart = await generateGeracaoAnualChart(500, 0.005, 25, 400, 300);
    
    if (geracaoChart.length === 0) {
      throw new Error('Gráfico de geração vazio');
    }
    
    console.log(`✅ Geração chart gerado: ${geracaoChart.length} bytes`);
    
    // Salvar para inspeção visual
    writeFileSync('test-payback.png', paybackChart);
    writeFileSync('test-geracao.png', geracaoChart);
    
    console.log('✅ Teste de gráficos: PASSOU');
    return true;
    
  } catch (error) {
    console.error('❌ Teste de gráficos: FALHOU', error);
    return false;
  }
}

/**
 * Teste básico de geração de PDF
 * Valida se o PDF-lib está funcionando corretamente
 */
async function testeGeracaoPDF(): Promise<boolean> {
  console.log('\n🧪 Teste 2: Geração de PDF Básico');
  console.log('==================================');
  
  try {
    // Dados mínimos para teste
    const dadosTeste: SolarProposalData = {
      titulo: "Teste de Geração de PDF",
      dataISO: "2025-01-31",
      company: {
        nome: "Empresa Teste Ltda",
        cnpj: "00.000.000/0001-00",
        contato: "teste@exemplo.com"
      },
      client: {
        nome: "Cliente Teste",
        documento: "000.000.000-00"
      },
      kpis: {
        potenciaKWp: 3.0,
        energiaMensalKWh: 400,
        economiaAnualBRL: 4800,
        paybackAnos: 5.0
      },
      finance: {
        capexBRL: 24000,
        tarifaBRLkWh: 1.00
      },
      itens: [
        {
          descricao: "Item de Teste 1",
          qtd: 1,
          precoUnit: 1000
        },
        {
          descricao: "Item de Teste 2",
          qtd: 2,
          precoUnit: 500
        }
      ],
      observacoes: [
        "Esta é uma observação de teste",
        "Segunda observação para validar formatação"
      ],
      premissasTecnicas: [
        "Premissa técnica de teste",
        "Segunda premissa para validar layout"
      ]
    };
    
    console.log('📄 Gerando PDF de teste...');
    const pdfBytes = await buildSolarProposalPDF(dadosTeste);
    
    if (pdfBytes.length === 0) {
      throw new Error('PDF vazio gerado');
    }
    
    // Salvar PDF de teste
    writeFileSync('test-basico.pdf', pdfBytes);
    
    console.log(`✅ PDF básico gerado: ${(pdfBytes.length / 1024).toFixed(2)} KB`);
    console.log('✅ Teste de PDF básico: PASSOU');
    return true;
    
  } catch (error) {
    console.error('❌ Teste de PDF básico: FALHOU', error);
    return false;
  }
}

/**
 * Teste de integração completa
 * Combina gráficos e PDF em um documento final
 */
async function testeIntegracaoCompleta(): Promise<boolean> {
  console.log('\n🧪 Teste 3: Integração Completa');
  console.log('=================================');
  
  try {
    console.log('🔄 Executando geração completa...');
    await gerarPropostaCompleta();
    
    console.log('✅ Teste de integração completa: PASSOU');
    return true;
    
  } catch (error) {
    console.error('❌ Teste de integração completa: FALHOU', error);
    return false;
  }
}

/**
 * Teste de múltiplos cenários
 * Valida robustez com diferentes dados
 */
async function testeMultiplosCenarios(): Promise<boolean> {
  console.log('\n🧪 Teste 4: Múltiplos Cenários');
  console.log('===============================');
  
  try {
    console.log('🔄 Testando diferentes cenários...');
    await testarCenarios();
    
    console.log('✅ Teste de múltiplos cenários: PASSOU');
    return true;
    
  } catch (error) {
    console.error('❌ Teste de múltiplos cenários: FALHOU', error);
    return false;
  }
}

/**
 * Teste de performance
 * Mede tempo de execução e uso de memória
 */
async function testePerformance(): Promise<boolean> {
  console.log('\n🧪 Teste 5: Performance');
  console.log('========================');
  
  try {
    const inicioMemoria = process.memoryUsage();
    const inicioTempo = Date.now();
    
    // Gerar múltiplos PDFs para teste de performance
    for (let i = 0; i < 3; i++) {
      console.log(`📄 Gerando PDF ${i + 1}/3...`);
      
      const payback = await generatePaybackChart(30000 + (i * 5000), 6000 + (i * 1000));
      const geracao = await generateGeracaoAnualChart(500 + (i * 100));
      
      const dadosTeste: SolarProposalData = {
        titulo: `Teste Performance ${i + 1}`,
        dataISO: "2025-01-31",
        company: {
          nome: "Empresa Performance",
          cnpj: "00.000.000/0001-00"
        },
        client: {
          nome: `Cliente ${i + 1}`
        },
        kpis: {
          potenciaKWp: 3.0 + i,
          energiaMensalKWh: 400 + (i * 100),
          economiaAnualBRL: 4800 + (i * 1000),
          paybackAnos: 5.0 - (i * 0.5)
        },
        finance: {
          capexBRL: 24000 + (i * 5000),
          tarifaBRLkWh: 1.00
        },
        itens: [
          {
            descricao: `Item Performance ${i + 1}`,
            qtd: 1 + i,
            precoUnit: 1000 + (i * 200)
          }
        ]
      };
      
      const pdfBytes = await buildSolarProposalPDF(dadosTeste, {
        charts: {
          paybackChart: payback,
          geracaoAnualChart: geracao
        }
      });
      
      writeFileSync(`test-performance-${i + 1}.pdf`, pdfBytes);
    }
    
    const fimTempo = Date.now();
    const fimMemoria = process.memoryUsage();
    
    const tempoTotal = fimTempo - inicioTempo;
    const memoriaUsada = (fimMemoria.heapUsed - inicioMemoria.heapUsed) / 1024 / 1024;
    
    console.log(`⏱️  Tempo total: ${tempoTotal}ms`);
    console.log(`🧠 Memória adicional usada: ${memoriaUsada.toFixed(2)}MB`);
    console.log(`📊 Média por PDF: ${(tempoTotal / 3).toFixed(0)}ms`);
    
    if (tempoTotal > 30000) { // Mais de 30 segundos
      console.warn('⚠️  Performance abaixo do esperado');
    }
    
    console.log('✅ Teste de performance: PASSOU');
    return true;
    
  } catch (error) {
    console.error('❌ Teste de performance: FALHOU', error);
    return false;
  }
}

/**
 * Função principal que executa todos os testes
 */
export async function executarTodosTestes(): Promise<void> {
  console.log('🚀 Iniciando Suite de Testes Completa');
  console.log('=====================================');
  console.log('Este teste validará todo o sistema de geração de PDF');
  console.log('com inserção posicionada de informações e gráficos.\n');
  
  const resultados: { nome: string; passou: boolean }[] = [];
  
  // Executar todos os testes
  const testes = [
    { nome: 'Geração de Gráficos', funcao: testeGeracaoGraficos },
    { nome: 'Geração de PDF Básico', funcao: testeGeracaoPDF },
    { nome: 'Integração Completa', funcao: testeIntegracaoCompleta },
    { nome: 'Múltiplos Cenários', funcao: testeMultiplosCenarios },
    { nome: 'Performance', funcao: testePerformance }
  ];
  
  for (const teste of testes) {
    try {
      const resultado = await teste.funcao();
      resultados.push({ nome: teste.nome, passou: resultado });
    } catch (error) {
      console.error(`💥 Erro inesperado no teste ${teste.nome}:`, error);
      resultados.push({ nome: teste.nome, passou: false });
    }
  }
  
  // Relatório final
  console.log('\n📋 RELATÓRIO FINAL DOS TESTES');
  console.log('==============================');
  
  let testesPassaram = 0;
  for (const resultado of resultados) {
    const status = resultado.passou ? '✅ PASSOU' : '❌ FALHOU';
    console.log(`${status} - ${resultado.nome}`);
    if (resultado.passou) testesPassaram++;
  }
  
  console.log(`\n📊 Resumo: ${testesPassaram}/${resultados.length} testes passaram`);
  
  if (testesPassaram === resultados.length) {
    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ Sistema de geração de PDF está funcionando corretamente.');
    console.log('📄 Arquivos de teste gerados para inspeção manual.');
  } else {
    console.log('⚠️  ALGUNS TESTES FALHARAM!');
    console.log('❌ Verifique os erros acima e corrija antes de usar em produção.');
    process.exit(1);
  }
}

// Executar testes se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  executarTodosTestes()
    .then(() => {
      console.log('\n🏁 Suite de testes concluída!');
    })
    .catch(error => {
      console.error('💥 Erro fatal na suite de testes:', error);
      process.exit(1);
    });
}