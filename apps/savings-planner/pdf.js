(function (root) {
  'use strict';

  // Browser fonts support Unicode input. Pages are compressed immediately so
  // exporting a long plan does not retain many full-size canvas bitmaps.
  const T=value=>root.LFM?.t(value)??String(value);
  const rtl=()=>root.LFM?.lang==='ur';
  const enc = new TextEncoder();
  const finite = value => value !== null && value !== undefined &&
    value !== '' && Number.isFinite(Number(value));
  const text = value => value == null ? '' : String(value);
  const dated = () => {
    const date = new Date();
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')].join('-');
  };
  const monetary = action => ['expense', 'income'].includes(action.impactType);

  function cash(value, currency, unknown = 'Not estimated') {
    if (!finite(value)) return unknown;
    try {
      return new Intl.NumberFormat(navigator.language || 'en', {
        style: 'currency', currency, maximumFractionDigits: 2
      }).format(Number(value));
    } catch {
      return currency + ' ' + Number(value).toFixed(2);
    }
  }

  function estimate(action) {
    if (!monetary(action)) return null;
    if (finite(action.estimate)) return Number(action.estimate);
    if (action.impactType === 'expense' && finite(action.current) && finite(action.target)) {
      return Number(action.current) - Number(action.target);
    }
    return null;
  }

  function wrap(ctx, value, width) {
    const lines = [];
    for (const paragraph of text(value).replace(/\r/g, '').split('\n')) {
      if (!paragraph.trim()) { lines.push(''); continue; }
      let line = '';
      for (const word of paragraph.trim().split(/\s+/)) {
        if (ctx.measureText(word).width > width) {
          if (line) { lines.push(line); line = ''; }
          let part = '';
          for (const character of Array.from(word)) {
            if (part && ctx.measureText(part + character).width > width) {
              lines.push(part); part = character;
            } else part += character;
          }
          line = part;
        } else if (line && ctx.measureText(line + ' ' + word).width > width) {
          lines.push(line); line = word;
        } else line += (line ? ' ' : '') + word;
      }
      if (line) lines.push(line);
    }
    return lines;
  }

  function jpegBytes(canvas) {
    const binary = atob(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function pdfBlob(pages, landscape) {
    const width = landscape ? 841.89 : 595.28;
    const height = landscape ? 595.28 : 841.89;
    const parts = [], offsets = [0];
    let length = 0;
    const add = value => {
      const bytes = typeof value === 'string' ? enc.encode(value) : value;
      parts.push(bytes); length += bytes.length;
    };
    const object = (number, body) => {
      offsets[number] = length;
      add(number + ' 0 obj\n');
      for (const part of Array.isArray(body) ? body : [body]) add(part);
      add('\nendobj\n');
    };
    add('%PDF-1.4\n');
    object(1, '<< /Type /Catalog /Pages 2 0 R >>');
    object(2, '<< /Type /Pages /Count ' + pages.length + ' /Kids [' +
      pages.map((_, i) => (3 + i * 3) + ' 0 R').join(' ') + '] >>');
    pages.forEach((page, index) => {
      const number = 3 + index * 3;
      const command = 'q\n' + width + ' 0 0 ' + height +
        ' 0 0 cm\n/Sheet Do\nQ\n';
      object(number, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' +
        width + ' ' + height + '] /Resources << /XObject << /Sheet ' +
        (number + 1) + ' 0 R >> >> /Contents ' + (number + 2) + ' 0 R >>');
      object(number + 1, [
        '<< /Type /XObject /Subtype /Image /Width ' + page.width +
        ' /Height ' + page.height +
        ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode' +
        ' /Length ' + page.bytes.length + ' >>\nstream\n',
        page.bytes, '\nendstream'
      ]);
      object(number + 2, '<< /Length ' + enc.encode(command).length +
        ' >>\nstream\n' + command + 'endstream');
    });
    const crossReference = length;
    const count = 3 + pages.length * 3;
    add('xref\n0 ' + count + '\n0000000000 65535 f \n');
    for (let i = 1; i < count; i++) {
      add(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
    }
    add('trailer\n<< /Size ' + count + ' /Root 1 0 R >>\nstartxref\n' +
      crossReference + '\n%%EOF');
    return new Blob(parts, {type: 'application/pdf'});
  }

  class Paper {
    constructor(title, subtitle, landscape = false) {
      this.title = T(title); this.subtitle = T(subtitle); this.rtl = rtl(); this.landscape = landscape;
      this.canvas = document.createElement('canvas');
      this.canvas.width = landscape ? 1754 : 1240;
      this.canvas.height = landscape ? 1240 : 1754;
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) throw new Error('PDF drawing is unavailable in this browser.');
      this.width = this.canvas.width; this.height = this.canvas.height;
      this.margin = 70; this.pages = []; this.started = false;
      this.page();
    }
    font(size = 25, bold = false) {
      this.ctx.font = (bold ? 'bold ' : '') + size + (this.rtl ? 'px LFMUrdu, serif' : 'px Arial, sans-serif');
      this.ctx.textBaseline = 'top'; this.ctx.direction = this.rtl ? 'rtl' : 'ltr'; this.ctx.textAlign = this.rtl ? 'right' : 'left';
    }
    page() {
      if (this.started) this.commit();
      this.started = true;
      const c = this.ctx;
      c.fillStyle = '#ffffff'; c.fillRect(0, 0, this.width, this.height);
      this.font(23, true); c.fillStyle = '#173b36';
      c.fillText(T('LET’S FIX MONEY'), this.rtl ? this.width-this.margin : this.margin, 38);
      this.font(32, true); c.fillText(this.title, this.rtl ? this.width-this.margin : this.margin, 77);
      this.font(18); c.fillStyle = '#536e67';
      c.fillText(this.subtitle, this.rtl ? this.width-this.margin : this.margin, 119);
      c.strokeStyle = '#c6d5ce'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(this.margin, 151);
      c.lineTo(this.width - this.margin, 151); c.stroke();
      this.y = 177;
    }
    commit() {
      const c = this.ctx;
      this.font(17); c.fillStyle = '#536e67';
      c.fillText(T('Private working document · Educational planning, not financial advice'),
        this.rtl ? this.width-this.margin : this.margin, this.height - 48);
      this.font(16); c.fillText(T('Terms and tool limits: letsfixmoney.com/terms.html · Privacy: letsfixmoney.com/privacy.html'), this.rtl ? this.width-this.margin : this.margin, this.height - 27);
      this.font(17); c.textAlign = this.rtl ? 'left' : 'right';
      c.fillText(T('Page ' + (this.pages.length + 1)),
        this.rtl ? this.margin : this.width - this.margin, this.height - 48);
      c.textAlign = this.rtl ? 'right' : 'left';
      this.pages.push({bytes: jpegBytes(this.canvas), width: this.width, height: this.height});
    }
    ensure(height) {
      if (this.y + height > this.height - 85 && this.y > 177) this.page();
    }
    write(value, options = {}) {
      const size = options.size || 25, lineHeight = options.lineHeight || size * (this.rtl ? 1.75 : 1.38);
      const width = options.width || this.width - this.margin * 2;
      this.font(size, options.bold);
      const lines = wrap(this.ctx, options.translate===false?value:T(value), width);
      for (const line of lines) {
        this.ensure(lineHeight);
        this.font(size, options.bold);
        this.ctx.fillStyle = options.color || '#213c38';
        this.ctx.fillText(line, options.x || (this.rtl ? this.width-this.margin : this.margin), this.y);
        this.y += lineHeight;
      }
      this.y += options.gap === undefined ? 10 : options.gap;
    }
    heading(value) {
      this.ensure(85); this.y += 8;
      this.write(value, {size: 29, bold: true, gap: 15});
    }
    finish(filename) {
      this.commit();
      const blob = pdfBlob(this.pages, this.landscape);
      const url = URL.createObjectURL(blob), anchor = document.createElement('a');
      anchor.href = url; anchor.download = filename;
      document.body.append(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      return {blob, pages: this.pages.length, filename};
    }
  }

  function actionBlock(paper, action, number, currency) {
    paper.ensure(235);
    paper.write(number + '. ' + (action.title || T('My action')), {size: 28, bold: true, gap: 8, translate:false});
    paper.write([action.category, action.pillar].filter(Boolean).join(' · '),
      {size: 20, color: '#536e67'});
    paper.write(T('First step:') + ' ' + (action.step || T('Not entered')), {translate:false});
    paper.write(T('Owner:')+' '+(action.owner||T('Not entered'))+'   '+T('Due:')+' '+(action.due||T('Not set'))+'   '+T('Review:')+' '+(action.review||T('Not set')), {size:21,translate:false});
    const impact = {expense: 'Expense reduction', income: 'Additional income / support (verify)',
      nonfinancial: 'Non-monetary action', unknown: 'Not specified'}[action.impactType] || 'Not specified';
    paper.write('Status: ' + (action.status || 'To do') + ' · Impact type: ' + impact, {size: 21});
    if (action.impactType === 'expense' && (finite(action.current) || finite(action.target))) {
      paper.write('Current monthly cost: ' + cash(action.current, currency) +
        ' · Target monthly cost: ' + cash(action.target, currency), {size: 21});
    }
    if (action.impactType === 'nonfinancial') paper.write('No monetary estimate.', {size: 21});
    else paper.write('Estimated monthly improvement: ' + cash(estimate(action), currency) +
      ' · Recorded actual: ' + cash(monetary(action) ? action.actual : null, currency, 'Not recorded'), {size: 21});
    if (action.caution) paper.write('Verify: ' + action.caution, {size: 20, color: '#6e4b28'});
    if (action.notes) paper.write(T('Notes:')+' '+action.notes, {size:21,translate:false});
    paper.y += 16;
  }

  async function downloadPlan(model) {
    if (rtl() && document.fonts?.load) await Promise.all([document.fonts.load('25px LFMUrdu'),document.fonts.load('bold 25px LFMUrdu')]);
    if (document.fonts?.ready) await document.fonts.ready;
    const currency = model.currency || 'CAD', date = text(model.date || dated());
    const actions = Array.isArray(model.actions) ? model.actions : [];
    const now = actions.filter(action => action.priority === true).slice(0, 3);
    const later = actions.filter(action => !now.includes(action));
    const paper = new Paper('My Four Pillars Savings Plan',
      date + ' · Currency: ' + currency + ' · ' + actions.length + ' selected actions');
    paper.write('Three manageable priorities are more useful than a long list of intentions.',
      {size: 25, bold: true});
    paper.write('Amounts use the stated currency; no exchange-rate conversion is performed. ' +
      'Estimates are recurring monthly changes, not guaranteed savings or eligibility. ' +
      'One-off tax relief or assistance is not automatically monthly income. ' +
      'Recorded actual changes are self-reported.', {size: 21});
    const known = actions.map(estimate).filter(finite).map(Number);
    if (model.totalsConfirmed && known.length) {
      const monthly = known.reduce((sum, value) => sum + value, 0);
      paper.write('Combined entered estimate: ' + cash(monthly, currency) +
        '/month · ' + cash(monthly * 12, currency) + '/year', {bold: true});
      paper.write('You confirmed these are recurring monthly amounts and do not overlap. ' +
        (actions.length - known.length) + ' actions have no monetary estimate.', {size: 20});
    } else {
      paper.write('Individual actions only: before combining estimates, resolve overlap and confirm ' +
        'that the amounts are recurring monthly changes. Unknown amounts are not treated as zero.', {size: 21});
    }
    paper.heading('My top three priorities');
    if (!now.length) paper.write('No priorities selected yet.');
    now.forEach((action, index) => actionBlock(paper, action, index + 1, currency));
    if (later.length) {
      paper.heading('Other selected actions · Later');
      later.forEach((action, index) => actionBlock(paper, action, index + 1, currency));
    }
    return paper.finish('lets-fix-money-savings-plan-' + dated() + '.pdf');
  }

  async function downloadWorksheet(categories, pillars, currency = 'CAD') {
    if (rtl() && document.fonts?.load) await Promise.all([document.fonts.load('25px LFMUrdu'),document.fonts.load('bold 25px LFMUrdu')]);
    if (document.fonts?.ready) await document.fonts.ready;
    const paper = new Paper('Four Pillars Savings Worksheet',
      dated() + ' · Currency: ' + currency + ' · Blank workshop copy', true);
    const names = pillars.map(pillar => typeof pillar === 'string' ? pillar : pillar.title || pillar.name);
    const tableWidth = paper.width - paper.margin * 2, categoryWidth = 205;
    const cellWidth = (tableWidth - categoryWidth) / 4, rowHeight = 174;
    for (let start = 0; start < categories.length; start += 5) {
      if (start) paper.page();
      paper.write('Use the hints to think. Write a suitable action or mark “Not applicable”.',
        {size: 22, gap: 14});
      const c = paper.ctx, headerY = paper.y;
      c.fillStyle = '#edf3ed'; c.fillRect(paper.margin, headerY, tableWidth, 61);
      paper.font(20, true); c.fillStyle = '#173b36';
      c.fillText(T('Expense category'), paper.rtl ? paper.width-paper.margin-12 : paper.margin + 12, headerY + 15);
      names.forEach((name, index) => {
        wrap(c, T(name), cellWidth - 22).slice(0, 2).forEach((line, n) =>
          c.fillText(line, paper.rtl ? paper.margin+(4-index)*cellWidth-11 : paper.margin + categoryWidth + index * cellWidth + 11,
            headerY + 9 + n * 24));
      });
      paper.y += 61;
      categories.slice(start, start + 5).forEach(category => {
        const y = paper.y;
        c.strokeStyle = '#b8c9c0'; c.lineWidth = 1;
        c.strokeRect(paper.margin, y, tableWidth, rowHeight);
        paper.font(22, true); c.fillStyle = '#173b36';
        wrap(c, T(category.name || category.title), categoryWidth - 24).slice(0, 4)
          .forEach((line, n) => c.fillText(line, paper.rtl ? paper.width-paper.margin-12 : paper.margin + 12, y + 15 + n * 28));
        for (let col = 0; col < 4; col++) {
          const x = paper.rtl ? paper.margin+(3-col)*cellWidth : paper.margin + categoryWidth + col * cellWidth;
          c.beginPath(); c.moveTo(paper.rtl?x+cellWidth:x, y); c.lineTo(paper.rtl?x+cellWidth:x, y + rowHeight); c.stroke();
          const entry = category.cells?.[col]?.[0];
          const hint = Array.isArray(entry) ? entry[0] : entry?.title || '';
          paper.font(18); c.fillStyle = '#536e67';
          wrap(c, T(hint), cellWidth - 24).slice(0, 3).forEach((line, n) =>
            c.fillText(line, paper.rtl ? x+cellWidth-12 : x + 12, y + 13 + n * 24));
          c.strokeStyle = '#d7e0dc';
          for (const lineY of [108, 139, 162]) {
            c.beginPath(); c.moveTo(x + 12, y + lineY);
            c.lineTo(x + cellWidth - 12, y + lineY); c.stroke();
          }
          c.strokeStyle = '#b8c9c0';
        }
        paper.y += rowHeight;
      });
    }
    paper.page();
    paper.write('Choose three manageable actions. Keep savings estimates separate from recorded results.', {size: 23});
    for (let i = 1; i <= 3; i++) {
      paper.heading('Priority ' + i);
      paper.write('Action: __________________________________________________________________________');
      paper.write('First step: _______________________________________________________________________');
      paper.write('Owner: ____________________   Due: ____________________   Review: ____________________');
      paper.write('Estimated monthly change: ____________________   Actual after review: ____________________');
      paper.y += 12;
    }
    paper.write('Before adding estimates: resolve overlap, preserve essentials and verify eligibility. ' +
      'One-off credits and support are not automatically monthly income. ' +
      'Medical, benefit and tax examples require current rules and supporting records.', {size: 20});
    return paper.finish('lets-fix-money-blank-worksheet-' + dated() + '.pdf');
  }

  root.SavingsPlannerPDF = {downloadPlan, downloadWorksheet};
})(window);
