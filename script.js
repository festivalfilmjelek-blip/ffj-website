
const translations = {
  id: {
    navAbout: 'Tentang',
    navProgram: 'Program',
    navSubmit: 'Submission',
    navArchive: 'Arsip',
    navNews: 'Kabar',
    navContact: 'Kontak',
    detailsTbd: 'DETAIL MENYUSUL',
    tagline: 'BERANI BERKARYA<br>TANPA TAKUT JELEK.',
    ctaSubmit: 'SUBMIT FILM ↗',
    ctaProgram: 'LIHAT PROGRAM ↗',
    aboutTitle: 'BUKAN SOAL<br>SEMPURNA.',
    aboutNote: 'Sebuah festival untuk karya yang terlalu aneh, terlalu jujur, atau terlalu berbeda untuk masuk kotak.',
    programTitle: 'PROGRAM<br>FESTIVAL',
    programIntro: 'Program dan jadwal resmi FFJ 2027 akan diumumkan di sini.',
    submitTitle: 'PUNYA FILM<br>YANG ANEH?',
    submitStatus: 'BELUM DIBUKA ↗',
    submissionCaution: 'Jangan kirim film sebelum pengumuman resmi.',
    archiveTitle: 'ARSIP<br>FEFILEK.',
    newsTitle: 'KABAR<br>TERBARU.',
    contactTitle: 'MAU BIKIN<br>RIBUT?',
    contactIntro: 'Untuk kolaborasi, media, dan pertanyaan seputar festival:',
    footer: 'DIBUAT DENGAN KEBERANIAN.'
  },
  en: {
    navAbout: 'About',
    navProgram: 'Program',
    navSubmit: 'Submit',
    navArchive: 'Archive',
    navNews: 'News',
    navContact: 'Contact',
    detailsTbd: 'DETAILS TO FOLLOW',
    tagline: 'CREATE BOLDLY.<br>DON’T FEAR BAD.',
    ctaSubmit: 'SUBMIT A FILM ↗',
    ctaProgram: 'EXPLORE PROGRAM ↗',
    aboutTitle: 'NOT ABOUT<br>PERFECTION.',
    aboutNote: 'A festival for work too strange, too honest, or too different to fit a box.',
    programTitle: 'FESTIVAL<br>PROGRAM',
    programIntro: 'Official FFJ 2027 program and schedule will be announced here.',
    submitTitle: 'GOT A<br>WEIRD FILM?',
    submitStatus: 'NOT OPEN YET ↗',
    submissionCaution: 'Please wait for the official announcement.',
    archiveTitle: 'FEFILEK<br>ARCHIVE.',
    newsTitle: 'LATEST<br>UPDATES.',
    contactTitle: 'LET’S MAKE<br>SOME NOISE.',
    contactIntro: 'For collaborations, press, and festival inquiries:',
    footer: 'MADE WITH COURAGE.'
  }
};

let lang = 'id';
let data = null;

const safe = s => String(s ?? '').replace(
  /[&<>"']/g,
  c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c])
);

function tile(item, i) {
  let link = item.url && /^https?:\/\//.test(item.url)
    ? `<a href="${safe(item.url)}" target="_blank" rel="noopener noreferrer">READ MORE ↗</a>`
    : '';

  return `
    <article class="tile">
      <span class="num">${safe(item.date || String(i + 1).padStart(2, '0'))}</span>
      <h3>${safe(item.title)}</h3>
      <p>${safe(item.description)}</p>
      ${link}
    </article>
  `;
}

function render() {
  document.documentElement.lang = lang;

  for (const el of document.querySelectorAll('[data-i]')) {
    el.innerHTML = translations[lang][el.dataset.i];
  }

  if (!data) return;

  document.querySelector('.stamp').innerHTML = `
    ✳ ${safe(data.festivalYear)} /
    ${safe(data.festivalEdition)} /
    <span class="small">${safe(data.locationStatus)}</span>
  `;

  document.getElementById('aboutText').textContent =
    data.about[lang] || data.about.id;

  document.getElementById('submissionText').textContent =
    data.submission[lang] || data.submission.id;

  const sub = document.getElementById('submissionLink');

  if (
    data.submission.isOpen &&
    /^https?:\/\//.test(data.submission.url)
  ) {
    sub.href = data.submission.url;
    sub.textContent = lang === 'id'
      ? 'DAFTAR SEKARANG ↗'
      : 'SUBMIT NOW ↗';

    sub.classList.remove('disabled');
    sub.target = '_blank';
    sub.rel = 'noopener noreferrer';
  } else {
    sub.href = '#updates';
    sub.textContent = translations[lang].submitStatus;
    sub.classList.add('disabled');
    sub.removeAttribute('target');
  }

  document.getElementById('programCards').innerHTML =
    (data.programs || []).map(tile).join('');

  document.getElementById('archiveCards').innerHTML =
    (data.archives || []).map(tile).join('');

  document.getElementById('newsCards').innerHTML =
    (data.updates || []).map(tile).join('');

  if (data.heroImage) {
    document.querySelector('.hero').style.backgroundImage =
      `linear-gradient(90deg,rgba(21,19,19,.9),rgba(21,19,19,.35)),url("${encodeURI(data.heroImage).replace(/"/g, '%22')}")`;

    document.querySelector('.hero').style.backgroundSize = 'cover';
    document.querySelector('.hero').style.backgroundPosition = 'center';
  }
}

document.getElementById('year').textContent =
  new Date().getFullYear();

document.getElementById('lang').addEventListener('click', () => {
  lang = lang === 'id' ? 'en' : 'id';
  render();
});

document.getElementById('menu').addEventListener('click', () => {
  document.getElementById('links').classList.toggle('open');
});

document.querySelectorAll('nav a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('links').classList.remove('open');
  });
});

fetch('content/site.json')
  .then(r => {
    if (!r.ok) throw Error('Missing content');
    return r.json();
  })
  .then(d => {
    data = d;
    render();
  })
  .catch(() => {
    document.getElementById('programCards').innerHTML =
      '<p>Gagal memuat konten. Periksa content/site.json.</p>';
  });

render();


/* ========================================
   FFJ ARCHIVE PHOTO GALLERY
   ======================================== */

function setupArchiveGallery() {
  const archive = document.getElementById('archiveCards');
  if (!archive || !data) return;

  archive.innerHTML = (data.archives || []).map((item, index) => {
    const images = Array.isArray(item.images) ? item.images : [];
    const cover = images[0];

    return `
      <article class="tile archive-item">
        ${cover ? `
          <img
            src="${safe(cover)}"
            alt="${safe(item.title)}"
            class="archive-cover"
            loading="lazy"
          >
        ` : ''}

        <span class="num">${safe(item.date || '')}</span>
        <h3>${safe(item.title)}</h3>
        <p>${safe(item.description)}</p>

        ${images.length ? `
          <button class="archive-open" data-index="${index}">
            LIHAT DOKUMENTASI ↗
          </button>
        ` : '<span>DOKUMENTASI MENYUSUL</span>'}
      </article>
    `;
  }).join('');

  archive.querySelectorAll('.archive-open').forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      openArchiveGallery(data.archives[index]);
    });
  });
}

function openArchiveGallery(item) {
  const images = item.images || [];
  if (!images.length) return;

  let current = 0;

  const modal = document.createElement('div');
  modal.className = 'ffj-gallery-modal';

  modal.innerHTML = `
    <button class="gallery-close" aria-label="Tutup">✕</button>
    <button class="gallery-prev" aria-label="Sebelumnya">‹</button>
    <img class="gallery-photo" alt="Dokumentasi FFJ">
    <button class="gallery-next" aria-label="Berikutnya">›</button>
    <div class="gallery-counter"></div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  function showPhoto() {
    modal.querySelector('.gallery-photo').src = images[current];
    modal.querySelector('.gallery-counter').textContent =
      `${current + 1} / ${images.length}`;
  }

  function close() {
    modal.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', keyboard);
  }

  function keyboard(event) {
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') prev();
  }

  function next() {
    current = (current + 1) % images.length;
    showPhoto();
  }

  function prev() {
    current = (current - 1 + images.length) % images.length;
    showPhoto();
  }

  modal.querySelector('.gallery-close').onclick = close;
  modal.querySelector('.gallery-next').onclick = next;
  modal.querySelector('.gallery-prev').onclick = prev;

  document.addEventListener('keydown', keyboard);
  showPhoto();
}

/* Run after site.json has loaded */
const originalRender = render;

render = function () {
  originalRender();
  if (data) setupArchiveGallery();
};

render = function () {
  originalRender();
  if (data) setupArchiveGallery();
};


/* ========================================
   FFJ IN THE PRESS
   ======================================== */

let pressVisibleCount = 6;

function renderFFJPress() {
  const container = document.getElementById('pressCards');
  const moreButton = document.getElementById('pressLoadMore');

  if (!container || !moreButton || !data) return;

  const articles = [...(data.press || [])].sort((a, b) => {
    if (!a.sortDate && !b.sortDate) return 0;
    if (!a.sortDate) return 1;
    if (!b.sortDate) return -1;

    return a.sortDate.localeCompare(b.sortDate);
  });

  const visibleArticles = articles.slice(0, pressVisibleCount);

  container.innerHTML = visibleArticles.map(article => {
    const url = String(article.url || '');
    const validUrl = /^https?:\/\//i.test(url);

    return `
      <article class="press-card">

        <div class="press-card-top">
          <span class="press-media">
            ${safe(article.media)}
          </span>

          <span class="press-date">
            ${safe(article.date)}
          </span>
        </div>

        <h3>${safe(article.title)}</h3>

        <p>${safe(article.description)}</p>

        ${validUrl ? `
          <a
            href="${safe(url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="press-read"
          >
            READ ARTICLE ↗
          </a>
        ` : ''}

      </article>
    `;
  }).join('');

  moreButton.hidden = pressVisibleCount >= articles.length;
}

/* Integrate press with existing render function */

const previousFFJRender = render;

render = function () {
  previousFFJRender();
  renderFFJPress();
};

/* Load more articles */

const pressMoreButton = document.getElementById('pressLoadMore');

if (pressMoreButton) {
  pressMoreButton.addEventListener('click', () => {
    pressVisibleCount += 6;
    renderFFJPress();
  });
}

/* Refresh when data has already loaded */

if (data) {
  renderFFJPress();
}


/* ========================================
   FFJ 8-BIT LOADING ANIMATION
   ======================================== */

(function initFFJLoader() {
  const loader = document.getElementById('ffj-loader');
  const bar = document.getElementById('ffj-loader-bar');
  const percent = document.getElementById('ffj-loader-percent');
  const message = document.getElementById('ffj-loader-message');

  if (!loader || !bar || !percent || !message) return;

  const closeLoader = () => {
    loader.classList.add('ffj-loader-exit');
    setTimeout(() => loader.remove(), 400);
  };

  // Respect reduced-motion preferences.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    closeLoader();
    return;
  }

  // Show only once per browser tab/session.
  try {
    if (sessionStorage.getItem('ffj-loader-seen') === 'yes') {
      closeLoader();
      return;
    }
    sessionStorage.setItem('ffj-loader-seen', 'yes');
  } catch (error) {
    // Continue normally if browser storage is unavailable.
  }

  const messages = [
    'INITIALIZING BAD CINEMA...',
    'LOADING WEIRD FILMS...',
    'REJECTING PERFECTION...',
    'READY TO BE JELEK!'
  ];

  const totalPixels = 20;
  const duration = 1800;
  const startTime = performance.now();

  for (let i = 0; i < totalPixels; i++) {
    const pixel = document.createElement('div');
    pixel.className = 'ffj-loader-pixel';
    bar.appendChild(pixel);
  }

  const pixels = Array.from(bar.children);

  function animate(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * 100);
    const activePixels = Math.ceil(progress * totalPixels);

    percent.textContent = String(value).padStart(2, '0') + '%';

    pixels.forEach((pixel, index) => {
      pixel.classList.toggle('active', index < activePixels);
    });

    const messageIndex = Math.min(
      Math.floor(progress * messages.length),
      messages.length - 1
    );

    message.textContent = messages[messageIndex];

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(closeLoader, 250);
    }
  }

  requestAnimationFrame(animate);
})();
