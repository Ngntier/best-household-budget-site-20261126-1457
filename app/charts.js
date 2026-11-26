// Charts drawn with plain canvas and SVG — no external chart library.
// Both functions take a canvas/SVG host element and the numbers to draw.

export function drawTrendChart(canvas, history) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padLeft = 52;
  const padRight = 14;
  const padTop = 16;
  const padBottom = 30;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const max = Math.max(...history.map((m) => Math.max(m.income, m.spending))) * 1.1;

  ctx.clearRect(0, 0, width, height);
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#5b6470';
  ctx.strokeStyle = '#e3e0d8';
  ctx.lineWidth = 1;

  // Gridlines + y labels.
  for (let step = 0; step <= 4; step += 1) {
    const value = (max / 4) * step;
    const y = padTop + plotH - (plotH * step) / 4;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(`$${Math.round(value / 1000)}k`, padLeft - 8, y + 4);
  }

  const groupW = plotW / history.length;
  const barW = Math.min(26, (groupW - 18) / 2);
  history.forEach((month, i) => {
    const x = padLeft + i * groupW + (groupW - barW * 2 - 6) / 2;
    const incomeH = (month.income / max) * plotH;
    const spendH = (month.spending / max) * plotH;
    ctx.fillStyle = '#2f6f4f';
    ctx.fillRect(x, padTop + plotH - incomeH, barW, incomeH);
    ctx.fillStyle = '#c98a2e';
    ctx.fillRect(x + barW + 6, padTop + plotH - spendH, barW, spendH);
    ctx.fillStyle = '#33402f';
    ctx.textAlign = 'center';
    ctx.fillText(month.month, padLeft + i * groupW + groupW / 2, height - 10);
  });

  // Legend.
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2f6f4f';
  ctx.fillRect(padLeft, 0, 12, 12);
  ctx.fillStyle = '#33402f';
  ctx.fillText('Income', padLeft + 18, 11);
  ctx.fillStyle = '#c98a2e';
  ctx.fillRect(padLeft + 92, 0, 12, 12);
  ctx.fillStyle = '#33402f';
  ctx.fillText('Spending', padLeft + 110, 11);
}

// Donut of spending by category, drawn as SVG arcs so it stays sharp.
export function donutSvg(parts, size) {
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  if (total <= 0) return '<p class="muted">No spending yet this month.</p>';
  const radius = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  let angle = -Math.PI / 2;
  const arcs = parts.map((part) => {
    const sweep = (part.value / total) * Math.PI * 2;
    const x1 = cx + radius * Math.cos(angle);
    const y1 = cy + radius * Math.sin(angle);
    const x2 = cx + radius * Math.cos(angle + sweep);
    const y2 = cy + radius * Math.sin(angle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    const arc = `<path d="M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${part.color}" />`;
    angle += sweep;
    return arc;
  });
  const hole = `<circle cx="${cx}" cy="${cy}" r="${radius * 0.58}" fill="#fffdf7" />`;
  const centerText = `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="700" fill="#33402f">$${Math.round(total).toLocaleString('en-US')}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="#5b6470">spent in Nov</text>`;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category">${arcs.join('')}${hole}${centerText}</svg>`;
}
