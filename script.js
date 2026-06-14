const STORAGE_KEY = 'collectedEvidence';

const hotspotIcons = {
  weapon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M560 120C560 106.7 549.3 96 536 96C522.7 96 512 106.7 512 120L512 128L64 128C46.3 128 32 142.3 32 160L32 272C32 289.7 46.3 304 64 304L74 304C94.8 304 110.1 323.6 105 343.8L65 504.2C62.6 513.8 64.8 523.9 70.8 531.7C76.8 539.5 86.1 544 96 544L192 544C206.7 544 219.5 534 223 519.8L249 416L353.4 416C377.1 416 398.2 401.1 406.1 378.8L432.8 304L463.9 304C472.4 304 480.5 300.6 486.5 294.6L509.1 272L575.8 272C593.5 272 607.8 257.7 607.8 240L607.8 160C607.8 142.3 593.5 128 575.8 128L559.8 128L559.8 120zM353.4 368L260.9 368L276.9 304L381.9 304L360.9 362.7C359.8 365.9 356.7 368 353.4 368zM112 192L496 192C504.8 192 512 199.2 512 208C512 216.8 504.8 224 496 224L112 224C103.2 224 96 216.8 96 208C96 199.2 103.2 192 112 192z"/></svg>',
  letter: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 480C576 515.3 547.5 544 512.1 544L128 544C92.6 544 64 515.3 64 480L64 228C64.1 212.5 71.8 198 84.5 189.2L270 61.3C300.1 40.6 339.8 40.6 369.9 61.3L555.5 189.2C568.3 198 575.9 212.5 576 228L576 480zM128 496L512.1 496C520.9 496 528 488.9 528 480L528 288.3L373.2 405.7C341.8 429.6 298.3 429.6 266.8 405.7L112 288.3L112 480C112 488.9 119.2 496 128 496zM527.6 228.4L342.7 100.8C329 91.4 311 91.4 297.3 100.8L112.4 228.4L295.8 367.5C310.1 378.3 329.9 378.3 344.2 367.5L527.6 228.4z"/></svg>',
  key:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M400 416C497.2 416 576 337.2 576 240C576 142.8 497.2 64 400 64C302.8 64 224 142.8 224 240C224 258.7 226.9 276.8 232.3 293.7L71 455C66.5 459.5 64 465.6 64 472L64 552C64 565.3 74.7 576 88 576L168 576C181.3 576 192 565.3 192 552L192 512L232 512C245.3 512 256 501.3 256 488L256 448L296 448C302.4 448 308.5 445.5 313 441L346.3 407.7C363.2 413.1 381.3 416 400 416zM440 160C462.1 160 480 177.9 480 200C480 222.1 462.1 240 440 240C417.9 240 400 222.1 400 200C400 177.9 417.9 160 440 160z"/></svg>',
  mug:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 128C96 110.3 110.3 96 128 96L480 96C550.7 96 608 153.3 608 224C608 294.7 550.7 352 480 352C480 405 437 448 384 448L192 448C139 448 96 405 96 352L96 128zM544 224C544 188.7 515.3 160 480 160L480 288C515.3 288 544 259.3 544 224zM96 512L480 512C497.7 512 512 526.3 512 544C512 561.7 497.7 576 480 576L96 576C78.3 576 64 561.7 64 544C64 526.3 78.3 512 96 512z"/></svg>'
};

const questionMarkSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M224 224C224 171 267 128 320 128C373 128 416 171 416 224C416 266.7 388.1 302.9 349.5 315.4C321.1 324.6 288 350.7 288 392L288 416C288 433.7 302.3 448 320 448C337.7 448 352 433.7 352 416L352 392C352 390.3 352.6 387.9 355.5 384.7C358.5 381.4 363.4 378.2 369.2 376.3C433.5 355.6 480 295.3 480 224C480 135.6 408.4 64 320 64C231.6 64 160 135.6 160 224C160 241.7 174.3 256 192 256C209.7 256 224 241.7 224 224zM320 576C342.1 576 360 558.1 360 536C360 513.9 342.1 496 320 496C297.9 496 280 513.9 280 536C280 558.1 297.9 576 320 576z"/></svg>';

function initCrimeScene() {
  const hotspots = document.querySelectorAll('.scene-hotspot');
  if (!hotspots.length) return;

  const evidenceCards = document.querySelectorAll('.evidence-card');
  const collected = new Set(JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]'));

  const cardMap = Array.from(evidenceCards).reduce((map, card) => {
    map[card.dataset.item] = card;
    return map;
  }, {});

  const renderHotspot = (button) => {
    const item = button.dataset.target;
    if (!item) return;
    button.innerHTML = collected.has(item) ? (hotspotIcons[item] || questionMarkSvg) : questionMarkSvg;
  };

  const renderCard = (card, reveal) => {
    const item = card.dataset.item;
    const heading = card.querySelector('h3');
    const paragraph = card.querySelector('p');
    const iconEl = card.querySelector('.card-icon');
    if (heading) heading.textContent = reveal ? card.dataset.title || '???' : '???';
    if (paragraph) paragraph.textContent = reveal ? card.dataset.text || '???' : '???';
    if (iconEl) iconEl.innerHTML = reveal ? (hotspotIcons[item] || questionMarkSvg) : questionMarkSvg;
  };

  const applyCollected = (item) => {
    const button = document.querySelector(`.scene-hotspot[data-target="${item}"]`);
    const card = cardMap[item];
    if (card) {
      card.classList.add('collected');
      renderCard(card, true);
    }
    if (button) {
      button.classList.add('collected');
      renderHotspot(button);
    }
  };

  const persist = () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(collected)));
  };

  hotspots.forEach(renderHotspot);
  evidenceCards.forEach(card => renderCard(card, false));
  collected.forEach(applyCollected);

  hotspots.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.dataset.target;
      if (!item || !cardMap[item]) return;
      collected.add(item);
      applyCollected(item);
      persist();
    });
  });
}

function initInterrogation() {
  const evidenceCards = document.querySelectorAll('.evidence-card');
  if (!evidenceCards.length) return;

  const collected = new Set(JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]'));

  evidenceCards.forEach(card => {
    const item = card.dataset.item;
    const reveal = item && collected.has(item);
    const heading = card.querySelector('h3');
    const paragraph = card.querySelector('p');
    const iconEl = card.querySelector('.card-icon');
    if (reveal) card.classList.add('collected');
    if (heading) heading.textContent = reveal ? card.dataset.title || '???' : '???';
    if (paragraph) paragraph.textContent = reveal ? card.dataset.text || '???' : '???';
    if (iconEl) iconEl.innerHTML = reveal ? (hotspotIcons[item] || questionMarkSvg) : questionMarkSvg;
  });
}

function initDialog() {
  const overlay = document.getElementById('dialog-overlay');
  const dialogName = document.getElementById('dialog-suspect-name');
  const confirmBtn = document.getElementById('dialog-confirm');
  const cancelBtn = document.getElementById('dialog-cancel');
  if (!overlay) return;

  let pendingTarget = null;

  window.obvinit = function(suspect, name) {
    pendingTarget = suspect;
    if (dialogName) dialogName.textContent = name;
    overlay.classList.remove('hidden');
  };

  confirmBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    window.location.href = pendingTarget === 'lukas' ? 'win.html' : 'lose.html';
    pendingTarget = null;
  });

  cancelBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    pendingTarget = null;
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      pendingTarget = null;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('page-crime-scene')) {
    initCrimeScene();
  }
  if (document.body.classList.contains('page-interrogation')) {
    initInterrogation();
    initDialog();
  }
});
