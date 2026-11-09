/* Optional YouTube links. No third-party media requests before a visitor clicks. */
(() => {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const shorts = [
    {
      id: 'horse-and-cart', module: 2, slide: 1, seconds: 49,
      title: 'The horse and cart',
      description: 'The same horse and cart become easier to move when their order changes. Connect the story to earning, saving and buying.',
      activity: 'Choose one purchase to save for', href: 'module-2.html#activities',
      transcript: [
        'Working hard. Still going nowhere? Two brothers have one horse and one cart. One brother ties the horse behind the cart, so it has to push.',
        'His brother changes the order. The horse moves in front and pulls the cart. The same horse and cart now make a much easier journey.',
        'That is how I think about my money. Buy first, and tomorrow’s income can pay for yesterday’s purchase. Save first, and the order changes: earn, save, then buy.',
        'The cart’s cargo becomes savings. My “payments” can build savings for the next purchase. Put the cart behind the horse.'
      ]
    },
    {
      id: 'true-cost', module: 2, slide: 6, seconds: 46,
      title: 'The true cost of a purchase',
      description: 'Follow a $100 price tag as it becomes $105 to pay, $140 to earn and seven hours of work.',
      activity: 'Try the True Cost calculator', href: '../apps/true-cost/',
      transcript: [
        'A $100 purchase can require $140 in earnings. The price tag is only the starting point. In this illustration, $5 in sales tax brings the amount to pay to $105.',
        'If I keep 75% of my pay after income tax and payroll deductions, I have to earn $105 divided by 0.75, or $140. The animation splits that pay into $105 to spend and $35 in deductions.',
        'At $20 an hour before deductions, $140 represents seven hours of work. The pay diagram turns into a clock showing those seven hours.',
        'Is this purchase worth that much of my time? The real price includes my time. The 5% sales tax and 25% deduction rates are illustrative assumptions.'
      ]
    },
    {
      id: 'financial-spiral', module: 2, slide: 7, seconds: 59,
      title: 'Income, expenses and the financial spiral',
      description: 'Watch monthly surplus or shortfall change the direction while a separate bar tracks net worth above and below zero.',
      activity: 'Explore the Money Spiral', href: '../activities/money-spiral.html',
      transcript: [
        'The holy grail of personal finance? Income minus expenses: what is left each month? The equation stays in the centre and a separate sidebar shows net worth, meaning assets minus debts.',
        'In the first example, monthly take-home income is $4,000 and expenses start at $3,500. The surplus is saved. Costs fall by $10 each month, increasing the surplus from $500 to $550. The spiral rises and net worth reaches positive $3,150 after six months.',
        'The animation explicitly rewinds to the same starting net worth of zero. In the second example, $4,500 in base expenses exceed $4,000 in income. The shortfall is borrowed. At an illustrative 2% monthly interest rate, borrowing costs grow and the spiral turns downward. After six months, debt is about $3,154 and net worth is about negative $3,154.',
        'The final example changes income to $4,500 and expenses, including interest, to $3,950. A $550 surplus is used to repay debt. Net worth improves to about negative $2,604, but remains below zero. A surplus can change the direction before net worth becomes positive.',
        'These are simplified examples: surpluses are saved or used for extra principal repayments, shortfalls are borrowed, and asset-price changes are excluded. Expenses here exclude saving and extra principal repayments. The lesson’s cash-outflow worksheet includes debt principal already being paid, so use consistent definitions and avoid counting a repayment twice.'
      ]
    }
  ];
  const linked = () => shorts.filter(short => /^[A-Za-z0-9_-]{11}$/.test(window.COURSE_YOUTUBE_IDS?.[short.id] || ''));
  const watchURL = short => `https://www.youtube.com/watch?v=${window.COURSE_YOUTUBE_IDS[short.id]}`;
  const lesson = short => `module-${short.module}.html?short=${short.id}#slide-${short.slide}`;

  function slideHTML(module, slide) {
    const short = linked().find(item => item.module === module && item.slide === slide);
    if (!short) return '';
    return `<details class="course-short" data-short-id="${short.id}">
      <summary><span class="short-play" aria-hidden="true">▶</span><span><strong>Watch the Short</strong><span class="short-summary-title">${esc(short.title)}</span></span><span class="short-duration">${short.seconds} sec</span></summary>
      <div class="short-guide"><p>${esc(short.description)}</p>
        <a class="btn primary" href="${watchURL(short)}" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
        <p class="short-format">Opens in a new tab so you can return to this lesson. On-screen explanation with sound effects; no spoken narration.</p>
        <p><a href="${short.href}">${esc(short.activity)} →</a></p>
        <details class="short-transcript"><summary>Read the transcript and visual explanation</summary>${short.transcript.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</details>
      </div>
    </details>`;
  }

  function homeHTML() {
    const videos = linked();
    if (!videos.length) return '';
    return `<details class="course-shorts-intro"><summary><span><strong>Learn an idea in under a minute</strong><span>Animated Shorts alongside their course lessons</span></span><span class="short-count">${videos.length} videos</span></summary><div class="shorts-grid">${videos.map(short => `<a class="short-preview" href="${lesson(short)}"><span class="short-play" aria-hidden="true">▶</span><span><strong>${esc(short.title)}</strong><small>${short.seconds} seconds · Module ${short.module}</small><span>Watch with the lesson →</span></span></a>`).join('')}</div><p class="shorts-channel"><a href="https://www.youtube.com/@letsfixmoneycom" target="_blank" rel="noopener noreferrer">Visit Let’s Fix Money on YouTube ↗</a></p></details>`;
  }

  function attach(root, requested = '') {
    if (!requested) return;
    root.querySelectorAll('.course-short').forEach(panel => {
      if (requested === panel.dataset.shortId) panel.open = true;
    });
  }
  window.CourseShorts = { shorts, homeHTML, slideHTML, attach };
})();
