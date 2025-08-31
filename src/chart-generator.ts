// chart-generator.ts
// Utilitário para geração de gráficos com Chart.js e conversão para PNG
// Usado para criar gráficos que serão inseridos no PDF

import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { createCanvas } from 'canvas';

// Registra todos os componentes do Chart.js
Chart.register(...registerables);

/**
 * Configuração base para gráficos com estilo consistente
 * Define paleta de cores e tipografia padrão
 */
const baseChartOptions = {
  responsive: false,
  animation: false as const,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          family: 'Arial, sans-serif',
          size: 12
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        font: {
          size: 10
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        font: {
          size: 10
        }
      }
    }
  }
} as const;

/**
 * Gera gráfico de payback (fluxo de caixa acumulado)
 * Mostra o retorno do investimento ao longo dos anos
 */
export async function generatePaybackChart(
  capexBRL: number,
  economiaAnualBRL: number,
  anos: number = 25,
  width: number = 600,
  height: number = 400
): Promise<Uint8Array> {
  // Validação de entrada
  if (!capexBRL || capexBRL <= 0) {
    throw new Error('Valor do investimento (CAPEX) deve ser maior que zero');
  }
  
  if (!economiaAnualBRL || economiaAnualBRL <= 0) {
    throw new Error('Economia anual deve ser maior que zero');
  }
  
  if (!anos || anos <= 0 || anos > 50) {
    throw new Error('Período de análise deve estar entre 1 e 50 anos');
  }
  
  if (!width || width <= 0 || !height || height <= 0) {
    throw new Error('Dimensões do gráfico devem ser maiores que zero');
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Calcula fluxo de caixa acumulado
  const labels: string[] = [];
  const fluxoAcumulado: number[] = [];
  
  for (let ano = 0; ano <= anos; ano++) {
    labels.push(ano === 0 ? 'Inicial' : `Ano ${ano}`);
    const valor = ano === 0 ? -capexBRL : (economiaAnualBRL * ano) - capexBRL;
    fluxoAcumulado.push(valor);
  }

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Fluxo de Caixa Acumulado (R$)',
        data: fluxoAcumulado,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      ...baseChartOptions,
      plugins: {
        ...baseChartOptions.plugins,
        title: {
          display: true,
          text: 'Análise de Payback - Fluxo de Caixa',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        ...baseChartOptions.scales,
        y: {
          ...baseChartOptions.scales.y,
          ticks: {
            ...baseChartOptions.scales.y.ticks,
            callback: function(value) {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0
              }).format(value as number);
            }
          }
        }
      }
    }
  };

  let chart;
  try {
    chart = new Chart(ctx as any, config as any);
    
    // Aguarda renderização completa
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Converte canvas para PNG bytes
    const buffer = canvas.toBuffer('image/png');
    
    return new Uint8Array(buffer);
  } catch (error) {
    console.error('Erro na criação do gráfico de payback:', error);
    throw new Error(`Falha na geração do gráfico de payback: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  } finally {
    if (chart) {
      chart.destroy();
    }
  }
}

/**
 * Gera gráfico de geração anual de energia
 * Mostra a produção mensal estimada do sistema fotovoltaico
 */
export async function generateGeracaoAnualChart(
  energiaMensalKWh: number,
  degradacaoAnual: number = 0.005,
  anos: number = 25,
  width: number = 600,
  height: number = 400
): Promise<Uint8Array> {
  // Validação de entrada
  if (!energiaMensalKWh || energiaMensalKWh <= 0) {
    throw new Error('Energia mensal deve ser maior que zero');
  }
  
  if (degradacaoAnual < 0 || degradacaoAnual > 0.05) {
    throw new Error('Degradação anual deve estar entre 0% e 5%');
  }
  
  if (!anos || anos <= 0 || anos > 50) {
    throw new Error('Período de análise deve estar entre 1 e 50 anos');
  }
  
  if (!width || width <= 0 || !height || height <= 0) {
    throw new Error('Dimensões do gráfico devem ser maiores que zero');
  }
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Simula variação sazonal (verão mais alto, inverno mais baixo)
  const fatoresSazonais = [
    1.2, 1.1, 1.0, 0.9, 0.8, 0.7, // Jan-Jun
    0.8, 0.9, 1.0, 1.1, 1.2, 1.3  // Jul-Dez
  ];
  
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  // Calcula geração para ano 1, 10 e 25 (mostra degradação)
  const datasets = [
    {
      label: 'Ano 1',
      data: fatoresSazonais.map(fator => energiaMensalKWh * fator),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2
    },
    {
      label: 'Ano 10',
      data: fatoresSazonais.map(fator => 
        energiaMensalKWh * fator * Math.pow(1 - degradacaoAnual, 9)
      ),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderWidth: 2
    },
    {
      label: 'Ano 25',
      data: fatoresSazonais.map(fator => 
        energiaMensalKWh * fator * Math.pow(1 - degradacaoAnual, 24)
      ),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 2
    }
  ];

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels: meses,
      datasets
    },
    options: {
      ...baseChartOptions,
      plugins: {
        ...baseChartOptions.plugins,
        title: {
          display: true,
          text: 'Geração Mensal de Energia (kWh)',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        ...baseChartOptions.scales,
        y: {
          ...baseChartOptions.scales.y,
          beginAtZero: true,
          ticks: {
            ...baseChartOptions.scales.y.ticks,
            callback: function(value) {
              return `${value} kWh`;
            }
          }
        }
      }
    }
  };

  let chart;
  try {
    chart = new Chart(ctx as any, config as any);
    
    // Aguarda renderização completa
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Converte canvas para PNG bytes
    const buffer = canvas.toBuffer('image/png');
    
    return new Uint8Array(buffer);
  } catch (error) {
    console.error('Erro na criação do gráfico de geração anual:', error);
    throw new Error(`Falha na geração do gráfico de geração anual: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  } finally {
    if (chart) {
      chart.destroy();
    }
  }
}

/**
 * Gera gráfico de barras para comparação de custos
 * Útil para mostrar economia vs. conta de energia tradicional
 */
export async function generateCostComparisonChart(
  custoSemSolar: number,
  custoComSolar: number,
  economiaAnual: number,
  width: number = 600,
  height: number = 400
): Promise<Uint8Array> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: ['Sem Sistema Solar', 'Com Sistema Solar', 'Economia Anual'],
      datasets: [{
        label: 'Valor (R$)',
        data: [custoSemSolar, custoComSolar, economiaAnual],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Vermelho para custo sem solar
          'rgba(245, 158, 11, 0.8)',  // Amarelo para custo com solar
          'rgba(16, 185, 129, 0.8)'   // Verde para economia
        ],
        borderColor: [
          '#ef4444',
          '#f59e0b',
          '#10b981'
        ],
        borderWidth: 2
      }]
    },
    options: {
      ...baseChartOptions,
      plugins: {
        ...baseChartOptions.plugins,
        title: {
          display: true,
          text: 'Comparação de Custos Anuais',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          display: false
        }
      },
      scales: {
        ...baseChartOptions.scales,
        y: {
          ...baseChartOptions.scales.y,
          beginAtZero: true,
          ticks: {
            ...baseChartOptions.scales.y.ticks,
            callback: function(value) {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0
              }).format(value as number);
            }
          }
        }
      }
    }
  };

  let chart;
  try {
    chart = new Chart(ctx as any, config as any);
    
    // Aguarda renderização completa
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Converte canvas para PNG bytes
    const buffer = canvas.toBuffer('image/png');
    
    return new Uint8Array(buffer);
  } catch (error) {
    console.error('Erro na criação do gráfico de comparação de custos:', error);
    throw new Error(`Falha na geração do gráfico de comparação de custos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  } finally {
    if (chart) {
      chart.destroy();
    }
  }
}

/**
 * Função utilitária para criar gráficos customizados
 * Permite flexibilidade total na configuração
 */
export async function generateCustomChart(
  config: ChartConfiguration,
  width: number = 600,
  height: number = 400
): Promise<Uint8Array> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Aplica configurações base se não especificadas
  const mergedConfig: ChartConfiguration = {
    ...config,
    options: {
      ...baseChartOptions,
      ...config.options,
      animation: false
    }
  };

  let chart;
  try {
    chart = new Chart(ctx as any, config as any);
    
    // Aguarda renderização completa
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Converte canvas para PNG bytes
    const buffer = canvas.toBuffer('image/png');
    
    return new Uint8Array(buffer);
  } catch (error) {
    console.error('Erro na criação do gráfico:', error);
    throw new Error(`Falha na geração do gráfico de payback: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  } finally {
    if (chart) {
      chart.destroy();
    }
  }
}