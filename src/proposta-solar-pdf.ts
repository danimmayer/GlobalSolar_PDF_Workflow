// proposta-solar-pdf.ts
// Gera PDF de proposta solar com layout completo e gráficos (PDF-lib)
// Uso: importar buildSolarProposalPDF(data, assets) e salvar/baixar bytes

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// ----------------------------- Tipos -----------------------------
export type EquipItem = {
  descricao: string;
  qtd: number;
  precoUnit: number; // BRL
};

export type Kpis = {
  potenciaKWp: number; // kWp
  energiaMensalKWh: number; // kWh/mês
  economiaAnualBRL: number; // R$/ano
  paybackAnos: number; // anos
  tirPercent?: number; // % (opcional)
};

export type Finance = {
  capexBRL: number;
  tarifaBRLkWh: number;
  degradacaoAnual?: number; // 0.5% => 0.005
};

export type Charts = {
  // PNG/JPG em bytes
  paybackChart?: Uint8Array;
  geracaoAnualChart?: Uint8Array;
};

export type Company = {
  nome: string;
  cnpj?: string;
  endereco?: string;
  contato?: string;
};

export type Client = {
  nome: string;
  documento?: string; // CPF/CNPJ
  endereco?: string;
};

export type SolarProposalData = {
  titulo: string; // "Proposta de Sistema Fotovoltaico"
  dataISO: string; // "2025-08-31"
  company: Company;
  client: Client;
  kpis: Kpis;
  finance: Finance;
  itens: EquipItem[];
  observacoes?: string[]; // bullets
  premissasTecnicas?: string[]; // bullets
};

export type Assets = {
  logo?: Uint8Array; // PNG/JPG
  charts?: Charts;
};

// ----------------------------- Util -----------------------------
const A4 = { w: 595.28, h: 841.89 };
const M = 40;
const GRAY = (g: number) => rgb(g, g, g);
const fmtBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`;
const fmtAnos = (v: number) => `${v.toFixed(1)} anos`;
const yBetween = (n: number) => n; // semantic

/**
 * Embeds an image flexibly, trying PNG first then JPG
 * This approach handles different image formats gracefully
 */
async function embedImageFlexible(pdf: PDFDocument, bytes?: Uint8Array) {
  if (!bytes) return undefined;
  try { return await pdf.embedPng(bytes); } catch { return await pdf.embedJpg(bytes); }
}

/**
 * Calculates text width for precise positioning
 * Essential for right-aligned text and layout calculations
 */
function textWidth(font: any, text: string, size: number) {
  return font.widthOfTextAtSize(text, size);
}

/**
 * Wraps text into multiple lines based on available width
 * Critical for handling long descriptions in tables and bullets
 */
function wrapLines(text: string, maxWidth: number, font: any, size: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let buf = "";
  for (const w of words) {
    const test = buf ? buf + " " + w : w;
    if (textWidth(font, test, size) > maxWidth) {
      if (buf) lines.push(buf);
      buf = w;
    } else buf = test;
  }
  if (buf) lines.push(buf);
  return lines;
}

// ----------------------------- Desenho de componentes -----------------------------

type DrawCtx = { pdf: PDFDocument; page: any; helv: any; helvB: any; x: number; y: number };

/**
 * Draws label-value pairs with consistent spacing
 * Used for structured data presentation
 */
function drawLabelValue(ctx: DrawCtx, label: string, value: string, opts?: { width?: number; size?: number }) {
  const size = opts?.size ?? 10;
  const width = opts?.width ?? 200;
  const { page, helv, helvB, x, y } = ctx;
  page.drawText(label, { x, y, size, font: helv, color: GRAY(0.35) });
  const valY = y - 13;
  page.drawText(value, { x, y: valY, size: size + 2, font: helvB });
  return { nextY: valY - 16, width };
}

/**
 * Draws KPI cards with consistent styling
 * Visual hierarchy emphasizes key metrics
 */
function drawKpiCard(ctx: DrawCtx, title: string, value: string, unit?: string) {
  const { page, helv, helvB, x } = ctx;
  let { y } = ctx;
  const W = 120, H = 70, PAD = 10;
  page.drawRectangle({ x, y: y - H, width: W, height: H, color: rgb(0.98, 0.98, 0.98), borderColor: GRAY(0.85), borderWidth: 0.6, borderOpacity: 1, opacity: 1, });
  page.drawText(title, { x: x + PAD, y: y - PAD - 14, size: 9, font: helv, color: GRAY(0.35) });
  page.drawText(value, { x: x + PAD, y: y - PAD - 32, size: 16, font: helvB });
  if (unit) page.drawText(unit, { x: x + PAD, y: y - PAD - 48, size: 9, font: helv, color: GRAY(0.35) });
  return { nextX: x + W + 12 };
}

/**
 * Draws bullet point lists with proper text wrapping
 * Handles multi-line items gracefully
 */
function drawBullets(ctx: DrawCtx, items: string[], width: number) {
  const { page, helv } = ctx;
  let y = ctx.y;
  const size = 10;
  for (const it of items) {
    const lines = wrapLines(it, width - 16, helv, size);
    page.drawCircle({ x: ctx.x + 3, y: y - 6, size: 2, color: GRAY(0.2) });
    page.drawText(lines[0], { x: ctx.x + 12, y: y - 10, size, font: helv });
    let yy = y - 24;
    for (const extra of lines.slice(1)) {
      page.drawText(extra, { x: ctx.x + 12, y: yy, size, font: helv });
      yy -= 14;
    }
    y = yy - 2;
  }
  return { nextY: y };
}

// ----------------------------- Tabela de Itens -----------------------------

const COLS = [
  { key: "descricao", title: "Descrição", w: 300 },
  { key: "qtd", title: "Qtde", w: 60, align: "right" as const },
  { key: "preco", title: "Preço", w: 90, align: "right" as const },
  { key: "total", title: "Total", w: 90, align: "right" as const },
];

/**
 * Draws table header with consistent column widths
 * Foundation for tabular data presentation
 */
function drawTableHeader(ctx: DrawCtx) {
  const { page, helvB } = ctx;
  let x = ctx.x;
  const y = ctx.y;
  for (const c of COLS) {
    page.drawText(c.title, { x: x + 2, y, size: 10, font: helvB });
    x += c.w;
  }
  page.drawLine({ start: { x: ctx.x, y: y - 4 }, end: { x: ctx.x + COLS.reduce((s, c) => s + c.w, 0), y: y - 4 }, thickness: 0.6, color: GRAY(0.6) });
}

/**
 * Ensures adequate space for content, creating new pages when needed
 * Critical for multi-page documents with dynamic content
 */
function ensureSpace(pdf: PDFDocument, pageRef: { page: any }, cursorY: number, needed: number, helv: any, helvB: any) {
  if (cursorY - needed < M + 80) {
    const page = pdf.addPage([A4.w, A4.h]);
    pageRef.page = page;
    // cabeçalho de tabela repetido
    const ctx: DrawCtx = { pdf, page, helv, helvB, x: M, y: A4.h - M };
    drawTableHeader({ ...ctx, y: ctx.y - 14 });
    return A4.h - M - 14 - 10;
  }
  return cursorY;
}

/**
 * Draws complete items table with automatic pagination
 * Handles variable content length with consistent formatting
 */
function drawItemsTable(pdf: PDFDocument, pageRef: { page: any }, helv: any, helvB: any, itens: EquipItem[]) {
  const rowH = 20;
  let cursorY = A4.h - 260; // após KPIs/intro
  const ctx: DrawCtx = { pdf, page: pageRef.page, helv, helvB, x: M, y: cursorY };

  // Título
  ctx.page.drawText("Itens do Sistema", { x: M, y: cursorY, size: 12, font: helvB });
  cursorY -= yBetween(20);

  // Cabeçalho
  drawTableHeader({ ...ctx, y: cursorY });
  cursorY -= yBetween(16);

  let subtotal = 0;
  for (const it of itens) {
    const total = it.qtd * it.precoUnit;
    subtotal += total;
    cursorY = ensureSpace(pdf, pageRef, cursorY, rowH * 2, helv, helvB);

    // colunas
    let x = M;
    const desc = it.descricao.length > 90 ? it.descricao.slice(0, 87) + "..." : it.descricao;
    ctx.page.drawText(desc, { x: x + 2, y: cursorY, size: 10, font: helv }); x += COLS[0].w;

    const drawR = (text: string, right: number) => {
      const w = textWidth(helv, text, 10);
      ctx.page.drawText(text, { x: right - w - 2, y: cursorY, size: 10, font: helv });
    };
    drawR(String(it.qtd), x + COLS[1].w); x += COLS[1].w;
    drawR(fmtBRL(it.precoUnit), x + COLS[2].w); x += COLS[2].w;
    drawR(fmtBRL(total), x + COLS[3].w);

    // linha
    cursorY -= rowH;
    ctx.page.drawLine({ start: { x: M, y: cursorY + 4 }, end: { x: A4.w - M, y: cursorY + 4 }, thickness: 0.3, color: GRAY(0.9) });
  }

  // Totais
  cursorY = ensureSpace(pdf, pageRef, cursorY, 90, helv, helvB);
  const rightColX = A4.w - M - 220;
  const drawLine = (lab: string, val: string, bold = false) => {
    const font = bold ? helvB : helv;
    pageRef.page.drawText(lab, { x: rightColX, y: cursorY, size: 10, font });
    const w = textWidth(font, val, 10);
    pageRef.page.drawText(val, { x: A4.w - M - w, y: cursorY, size: 10, font });
    cursorY -= 18;
  };

  drawLine("Subtotal", fmtBRL(subtotal));
  // impostos/descontos podem ser calculados fora, aqui mantemos s/ ajustes
  pageRef.page.drawLine({ start: { x: rightColX, y: cursorY + 6 }, end: { x: A4.w - M, y: cursorY + 6 }, thickness: 0.8, color: GRAY(0.2) });
  drawLine("TOTAL", fmtBRL(subtotal), true);

  return { subtotal, cursorY };
}

// ----------------------------- Página de capa -----------------------------

/**
 * Draws the cover page with company info, client details, and KPI cards
 * Sets the professional tone for the entire document
 */
async function drawCover(pdf: PDFDocument, page: any, helv: any, helvB: any, data: SolarProposalData, assets: Assets) {
  const logo = await embedImageFlexible(pdf, assets.logo);
  let y = A4.h - M;
  if (logo) {
    const W = 140; const s = W / logo.width; const H = logo.height * s;
    page.drawImage(logo, { x: M, y: y - H, width: W, height: H });
    y -= H + 12;
  }
  page.drawText(data.titulo, { x: M, y: y - 24, size: 22, font: helvB });
  y -= 44;
  page.drawText(data.company.nome + (data.company.cnpj ? ` • CNPJ ${data.company.cnpj}` : ""), { x: M, y: y, size: 11, font: helv, color: GRAY(0.25) });
  y -= 18;
  page.drawText(`Cliente: ${data.client.nome}` + (data.client.documento ? ` • ${data.client.documento}` : ""), { x: M, y, size: 11, font: helv, color: GRAY(0.25) });
  y -= 18;
  page.drawText(`Data: ${new Date(data.dataISO).toLocaleDateString("pt-BR")}`, { x: M, y, size: 11, font: helv, color: GRAY(0.25) });

  // KPIs
  let kx = M, ky = A4.h - 260 + 40;
  const ctx: DrawCtx = { pdf, page, helv, helvB, x: kx, y: ky };
  const { kpis } = data;
  drawKpiCard({ ...ctx, x: kx }, "Potência do Sistema", `${kpis.potenciaKWp.toFixed(2)} kWp`);
  kx += 132;
  drawKpiCard({ ...ctx, x: kx }, "Geração Mensal", `${kpis.energiaMensalKWh.toFixed(0)} kWh/mês`);
  kx += 132;
  drawKpiCard({ ...ctx, x: kx }, "Economia Anual", `${fmtBRL(kpis.economiaAnualBRL)}`);
  kx += 132;
  const tir = kpis.tirPercent != null ? ` • TIR ${(kpis.tirPercent).toFixed(1)}%` : "";
  drawKpiCard({ ...ctx, x: kx }, "Payback Estimado", `${kpis.paybackAnos.toFixed(1)} anos${tir}`);

  // linha divisória
  page.drawLine({ start: { x: M, y: A4.h - 260 }, end: { x: A4.w - M, y: A4.h - 260 }, thickness: 1, color: GRAY(0.85) });
}

// ----------------------------- Página de gráficos -----------------------------

/**
 * Draws charts page with embedded images and notes section
 * Provides visual analysis of the solar proposal
 */
async function drawCharts(pdf: PDFDocument, page: any, helv: any, helvB: any, charts?: Charts) {
  const pay = await embedImageFlexible(pdf, charts?.paybackChart);
  const gen = await embedImageFlexible(pdf, charts?.geracaoAnualChart);

  let y = A4.h - M - 10;
  page.drawText("Gráficos", { x: M, y, size: 12, font: helvB });
  y -= 20;

  const W = (A4.w - M * 2 - 12) / 2;
  const H = 240;
  if (pay) {
    const s = Math.min(W / pay.width, H / pay.height);
    const w = pay.width * s, h = pay.height * s;
    page.drawText("Payback (fluxo de caixa)", { x: M, y: y - 12, size: 10, font: helv, color: GRAY(0.35) });
    page.drawImage(pay, { x: M, y: y - h - 18, width: w, height: h });
  }
  if (gen) {
    const s = Math.min(W / gen.width, H / gen.height);
    const w = gen.width * s, h = gen.height * s;
    page.drawText("Geração Anual (kWh)", { x: M + W + 12, y: y - 12, size: 10, font: helv, color: GRAY(0.35) });
    page.drawImage(gen, { x: M + W + 12, y: y - h - 18, width: w, height: h });
  }

  // caixa de premissas/observações
  let boxY = y - H - 40;
  page.drawRectangle({ x: M, y: boxY - 120, width: A4.w - 2 * M, height: 120, color: rgb(0.985, 0.985, 0.985), borderWidth: 0.6, borderColor: GRAY(0.85) });
  page.drawText("Notas e Premissas", { x: M + 10, y: boxY - 16, size: 11, font: helvB });
}

// ----------------------------- Seções de texto -----------------------------

/**
 * Draws section with bullet points
 * Used for technical assumptions and observations
 */
function drawSectionBullets(pdf: PDFDocument, page: any, helv: any, helvB: any, title: string, bullets: string[], startY: number) {
  let y = startY;
  page.drawText(title, { x: M, y, size: 12, font: helvB });
  y -= 18;
  const ctx: DrawCtx = { pdf, page, helv, helvB, x: M, y };
  const res = drawBullets(ctx, bullets, A4.w - 2 * M);
  return res.nextY;
}

// ----------------------------- Rodapé -----------------------------

/**
 * Adds consistent footer to each page
 * Maintains professional branding throughout document
 */
function addFooter(page: any, helv: any, company: Company, pageNum: number) {
  page.drawLine({ start: { x: M, y: M + 24 }, end: { x: A4.w - M, y: M + 24 }, thickness: 0.4, color: GRAY(0.85) });
  const info = `${company.nome}${company.contato ? " • " + company.contato : ""}`;
  page.drawText(info, { x: M, y: M + 10, size: 9, font: helv, color: GRAY(0.4) });
  const pn = String(pageNum);
  page.drawText(pn, { x: A4.w - M - 10, y: M + 10, size: 9, font: helv, color: GRAY(0.4) });
}

// ----------------------------- Builder principal -----------------------------

/**
 * Main function that orchestrates the entire PDF generation process
 * Combines all components into a cohesive multi-page document
 */
export async function buildSolarProposalPDF(data: SolarProposalData, assets: Assets = {}) {
  const pdf = await PDFDocument.create();
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvB = await pdf.embedFont(StandardFonts.HelveticaBold);

  // CAPA / RESUMO
  let page = pdf.addPage([A4.w, A4.h]);
  await drawCover(pdf, page, helv, helvB, data, assets);
  addFooter(page, helv, data.company, 1);

  // ITENS
  page = pdf.addPage([A4.w, A4.h]);
  let pageRef = { page };
  const { subtotal } = drawItemsTable(pdf, pageRef, helv, helvB, data.itens);
  addFooter(pageRef.page, helv, data.company, 2);

  // GRÁFICOS + PREMISSAS/OBS
  page = pdf.addPage([A4.w, A4.h]);
  await drawCharts(pdf, page, helv, helvB, assets.charts);
  let y = A4.h - 430;
  if (data.premissasTecnicas?.length) {
    y = drawSectionBullets(pdf, page, helv, helvB, "Premissas Técnicas", data.premissasTecnicas, y);
    y -= 12;
  }
  if (data.observacoes?.length) {
    y = drawSectionBullets(pdf, page, helv, helvB, "Observações", data.observacoes, y);
  }
  addFooter(page, helv, data.company, 3);

  // Metadados do doc
  pdf.setTitle(data.titulo);
  pdf.setAuthor(data.company.nome);
  pdf.setSubject("Proposta de sistema fotovoltaico");

  return await pdf.save();
}