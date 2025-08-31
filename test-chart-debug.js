// Teste de debug para identificar problema na geração de gráficos
import { generatePaybackChart, generateGeracaoAnualChart } from './src/chart-generator';

async function testChartGeneration() {
  console.log('Iniciando teste de geração de gráficos...');
  
  try {
    console.log('Testando gráfico de payback...');
    const paybackChart = await generatePaybackChart(
      100000, // capexBRL
      12000,  // economiaAnualBRL
      25,     // anos
      800,    // width
      500     // height
    );
    console.log('✅ Gráfico de payback gerado com sucesso');
    console.log('Tamanho do buffer:', paybackChart.length, 'bytes');
    
    console.log('Testando gráfico de geração anual...');
    const geracaoChart = await generateGeracaoAnualChart(
      1000,   // energiaMensalKWh
      0.005,  // degradacaoAnual
      25,     // anos
      800,    // width
      500     // height
    );
    console.log('✅ Gráfico de geração anual gerado com sucesso');
    console.log('Tamanho do buffer:', geracaoChart.length, 'bytes');
    
  } catch (error) {
    console.error('❌ Erro na geração de gráficos:', error);
    console.error('Stack trace:', error.stack);
  }
}

testChartGeneration();