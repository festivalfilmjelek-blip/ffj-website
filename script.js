
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
