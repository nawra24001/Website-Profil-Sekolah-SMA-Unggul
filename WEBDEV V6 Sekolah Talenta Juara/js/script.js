/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ─── MOBILE NAV ─── */
function toggleMobileNav() {
    document.getElementById('mobileNav').classList.toggle('open');
}

/* ─── TEACHER FILTER ─── */
function filterTeachers(dept, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#teacherGrid .teacher-card').forEach(card => {
        const match = dept === 'semua' || card.dataset.dept === dept;
        card.style.display = match ? '' : 'none';
    });
}

/* ─── STRUKTUR FILTER ─── */
function filterStruktur(group, btn) {
    document.querySelectorAll('.struktur-controls .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const allBlocks = document.querySelectorAll('#orgTree .org-block');
    const allConns  = document.querySelectorAll('#orgTree .org-level-connector');
    if (group === 'semua') {
        allBlocks.forEach(el => el.style.display = '');
        allConns.forEach(el  => el.style.display = '');
        return;
    }
    allBlocks.forEach(el => el.style.display = 'none');
    allConns.forEach(el  => el.style.display = 'none');
    allBlocks.forEach(block => {
        if (block.getAttribute('data-group') === group) block.style.display = '';
    });
}

/* ─── CAROUSEL ─── */
let carouselPos = 0;
const CARDS_PER_VIEW = window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 4;
function buildDots() {
    const dots = document.getElementById('carouselDots');
    if (!dots) return;
    const total = document.querySelectorAll('.ekskul-card').length;
    const pages = Math.ceil(total / CARDS_PER_VIEW);
    dots.innerHTML = '';
    for (let i = 0; i < pages; i++) {
        const d = document.createElement('div');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dots.appendChild(d);
    }
}
function moveCarousel(dir) {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    const cards = document.querySelectorAll('.ekskul-card');
    const total = cards.length;
    const pages = Math.ceil(total / CARDS_PER_VIEW);
    carouselPos = (carouselPos + dir + pages) % pages;
    const cardWidth = track.querySelector('.ekskul-card').offsetWidth;
    const gap = 20;
    track.style.transform = `translateX(-${carouselPos * (CARDS_PER_VIEW * (cardWidth + gap))}px)`;
    document.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === carouselPos));
}
buildDots();

/* ─── DATA TABS ─── */
function switchTab(tabId, btn) {
    document.querySelectorAll('.data-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.data-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

/* ─── TABLE SEARCH ─── */
function searchTable(tableId, query) {
    const rows = document.querySelectorAll('#' + tableId + ' tbody tr');
    const q = query.toLowerCase();
    rows.forEach(row => {
        const match = row.textContent.toLowerCase().includes(q);
        row.style.display = match ? '' : 'none';
    });
}

/* ─── TOAST ─── */
function showToast(msg, icon) {
    icon = icon || '✅';
    const t = document.getElementById('toast');
    if (!t) return;
    document.getElementById('toastMsg').textContent = msg;
    document.getElementById('toastIcon').textContent = icon;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ─── HELPER: set <select> value by text or value ─── */
function setSelectValue(selectId, value) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    for (let i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === value || sel.options[i].textContent.trim() === value) {
            sel.selectedIndex = i;
            return;
        }
    }
    sel.selectedIndex = 0;
}

/* ─── MODAL ─── */
let currentEditId   = null;
let currentEditType = null;
let _fotoBase64     = '';

function openModal(modalId, editId) {
    currentEditId   = editId;
    currentEditType = modalId;

    /* ── GURU ── */
    if (modalId === 'modal-guru') {
        const titleEl = document.getElementById('modal-guru-title');
        if (titleEl) titleEl.textContent = editId !== null ? 'Edit Data Guru' : 'Tambah Data Guru';

        _fotoBase64 = '';
        const preview   = document.getElementById('mg-foto-preview');
        const fotoInput = document.getElementById('mg-foto');
        if (preview)   { preview.src = ''; preview.style.display = 'none'; }
        if (fotoInput) fotoInput.value = '';

        if (editId !== null) {
            const row = document.querySelector('#teacherTableBody tr[data-id="' + editId + '"]');
            if (!row) { console.warn('Row not found for id', editId); return; }

            document.getElementById('mg-nama').value  = row.cells[0].textContent.trim();
            document.getElementById('mg-mapel').value = row.cells[1].textContent.trim();
            setSelectValue('mg-pendidikan', row.cells[2].textContent.trim());
            document.getElementById('mg-exp').value   = row.cells[3].textContent.trim();

            /* BUG FIX: status is inside a <span>, not raw text */
            const statusSpan = row.cells[4].querySelector('span');
            setSelectValue('mg-status', statusSpan ? statusSpan.textContent.trim() : row.cells[4].textContent.trim());

            /* load saved foto if any */
            const savedFoto = row.dataset.foto || '';
            if (savedFoto && preview) {
                _fotoBase64 = savedFoto;
                preview.src = savedFoto;
                preview.style.display = 'block';
            }
        } else {
            document.getElementById('mg-nama').value  = '';
            document.getElementById('mg-mapel').value = '';
            setSelectValue('mg-pendidikan', 'S1');
            document.getElementById('mg-exp').value   = '';
            setSelectValue('mg-status', 'Aktif');
        }
    }

    /* ── FASILITAS ── */
    if (modalId === 'modal-fasilitas') {
        const titleEl = document.getElementById('modal-fasilitas-title');
        if (titleEl) titleEl.textContent = editId !== null ? 'Edit Fasilitas' : 'Tambah Fasilitas';

        if (editId !== null) {
            const row = document.querySelector('#fasilitasTableBody tr[data-id="' + editId + '"]');
            if (!row) { console.warn('Row not found for id', editId); return; }

            document.getElementById('mf-nama').value   = row.cells[0].textContent.trim();
            document.getElementById('mf-kap').value    = row.cells[1].textContent.trim();
            setSelectValue('mf-kondisi', row.cells[2].textContent.trim());
            document.getElementById('mf-lokasi').value = row.cells[3].textContent.trim();

            /* BUG FIX: status is inside a <span> */
            const statusSpan = row.cells[4].querySelector('span');
            setSelectValue('mf-status', statusSpan ? statusSpan.textContent.trim() : row.cells[4].textContent.trim());
        } else {
            document.getElementById('mf-nama').value   = '';
            document.getElementById('mf-kap').value    = '';
            setSelectValue('mf-kondisi', 'Sangat Baik');
            document.getElementById('mf-lokasi').value = '';
            setSelectValue('mf-status', 'Tersedia');
        }
    }

    /* ── EKSKUL ── */
    if (modalId === 'modal-ekskul') {
        const titleEl = document.getElementById('modal-ekskul-title');
        if (titleEl) titleEl.textContent = editId !== null ? 'Edit Ekskul' : 'Tambah Ekskul';

        if (editId !== null) {
            const row = document.querySelector('#ekskriTableBody tr[data-id="' + editId + '"]');
            if (!row) { console.warn('Row not found for id', editId); return; }

            document.getElementById('me-nama').value     = row.cells[0].textContent.trim();
            document.getElementById('me-pembina').value  = row.cells[1].textContent.trim();
            document.getElementById('me-jadwal').value   = row.cells[2].textContent.trim();
            document.getElementById('me-anggota').value  = row.cells[3].textContent.trim();
            const p = row.cells[4].textContent.trim();
            document.getElementById('me-prestasi').value = p === '—' ? '' : p;
        } else {
            document.getElementById('me-nama').value     = '';
            document.getElementById('me-pembina').value  = '';
            document.getElementById('me-jadwal').value   = '';
            document.getElementById('me-anggota').value  = '';
            document.getElementById('me-prestasi').value = '';
        }
    }

    const overlay = document.getElementById(modalId);
    if (overlay) overlay.classList.add('open');
}

function closeModal(modalId) {
    const overlay = document.getElementById(modalId);
    if (overlay) overlay.classList.remove('open');
    currentEditId = null;
    _fotoBase64   = '';
}

/* close modal on backdrop click */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) closeModal(this.id);
    });
});

/* ─── FOTO PREVIEW ─── */
(function () {
    const fotoInput = document.getElementById('mg-foto');
    if (!fotoInput) return;
    fotoInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            _fotoBase64 = e.target.result;
            const preview = document.getElementById('mg-foto-preview');
            if (preview) { preview.src = _fotoBase64; preview.style.display = 'block'; }
        };
        reader.readAsDataURL(file);
    });
})();

/* ─── CRUD: DELETE ROW ─── */
function deleteRow(tbodyId, id) {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    const row = document.querySelector('#' + tbodyId + ' tr[data-id="' + id + '"]');
    if (row) { row.remove(); showToast('Data berhasil dihapus.', '🗑️'); }
    if (tbodyId === 'teacherTableBody') syncGuruToStorage();
}

/* ─── CRUD: SAVE GURU ─── */
let guruIdCounter = 100;
function saveGuruRow() {
    const nama   = document.getElementById('mg-nama').value.trim();
    const mapel  = document.getElementById('mg-mapel').value.trim();
    const pend   = document.getElementById('mg-pendidikan').value;
    const exp    = document.getElementById('mg-exp').value.trim();
    const status = document.getElementById('mg-status').value;

    if (!nama || !mapel) { showToast('Nama dan mata pelajaran wajib diisi.', '⚠️'); return; }

    const statusClass = status === 'Aktif' ? 'status-active' : 'status-inactive';
    const tbody = document.getElementById('teacherTableBody');

    if (currentEditId !== null) {
        /* EDIT */
        const row = tbody.querySelector('tr[data-id="' + currentEditId + '"]');
        if (row) {
            row.cells[0].textContent = nama;
            row.cells[1].textContent = mapel;
            row.cells[2].textContent = pend;
            row.cells[3].textContent = exp || '—';
            row.cells[4].innerHTML   = '<span class="status-badge ' + statusClass + '">' + status + '</span>';
            if (_fotoBase64) row.dataset.foto = _fotoBase64;
        }
        showToast('Data guru berhasil diperbarui.');
    } else {
        /* ADD NEW */
        guruIdCounter++;
        const id  = guruIdCounter;
        const row = document.createElement('tr');
        row.setAttribute('data-id', id);
        if (_fotoBase64) row.dataset.foto = _fotoBase64;
        row.innerHTML =
            '<td>' + nama + '</td>' +
            '<td>' + mapel + '</td>' +
            '<td>' + pend + '</td>' +
            '<td>' + (exp || '—') + '</td>' +
            '<td><span class="status-badge ' + statusClass + '">' + status + '</span></td>' +
            '<td>' +
                '<button class="action-btn" onclick="openModal(\'modal-guru\',' + id + ')" title="Edit">✏️</button>' +
                '<button class="action-btn del" onclick="deleteRow(\'teacherTableBody\',' + id + ')" title="Hapus">🗑️</button>' +
            '</td>';
        tbody.appendChild(row);
        showToast('Guru baru berhasil ditambahkan.');
    }

    closeModal('modal-guru');
    syncGuruToStorage();
}

/* ─── CRUD: SAVE FASILITAS ─── */
let fasIdCounter = 200;
function saveFasRow() {
    const nama    = document.getElementById('mf-nama').value.trim();
    const kap     = document.getElementById('mf-kap').value.trim();
    const kondisi = document.getElementById('mf-kondisi').value;
    const lok     = document.getElementById('mf-lokasi').value.trim();
    const status  = document.getElementById('mf-status').value;

    if (!nama) { showToast('Nama fasilitas wajib diisi.', '⚠️'); return; }

    const statusClass = status === 'Tersedia' ? 'status-active' : 'status-inactive';
    const tbody = document.getElementById('fasilitasTableBody');

    if (currentEditId !== null) {
        const row = tbody.querySelector('tr[data-id="' + currentEditId + '"]');
        if (row) {
            row.cells[0].textContent = nama;
            row.cells[1].textContent = kap || '—';
            row.cells[2].textContent = kondisi;
            row.cells[3].textContent = lok || '—';
            row.cells[4].innerHTML   = '<span class="status-badge ' + statusClass + '">' + status + '</span>';
        }
        showToast('Fasilitas berhasil diperbarui.');
    } else {
        fasIdCounter++;
        const id  = fasIdCounter;
        const row = document.createElement('tr');
        row.setAttribute('data-id', id);
        row.innerHTML =
            '<td>' + nama + '</td><td>' + (kap||'—') + '</td><td>' + kondisi + '</td><td>' + (lok||'—') + '</td>' +
            '<td><span class="status-badge ' + statusClass + '">' + status + '</span></td>' +
            '<td>' +
                '<button class="action-btn" onclick="openModal(\'modal-fasilitas\',' + id + ')">✏️</button>' +
                '<button class="action-btn del" onclick="deleteRow(\'fasilitasTableBody\',' + id + ')">🗑️</button>' +
            '</td>';
        tbody.appendChild(row);
        showToast('Fasilitas berhasil ditambahkan.');
    }
    closeModal('modal-fasilitas');
    syncFasilitasToStorage();
}

/* ─── CRUD: SAVE EKSKUL ─── */
let eksIdCounter = 300;
function saveEkskulRow() {
    const nama     = document.getElementById('me-nama').value.trim();
    const pembina  = document.getElementById('me-pembina').value.trim();
    const jadwal   = document.getElementById('me-jadwal').value.trim();
    const anggota  = document.getElementById('me-anggota').value.trim();
    const prestasi = document.getElementById('me-prestasi').value.trim();

    if (!nama) { showToast('Nama ekskul wajib diisi.', '⚠️'); return; }

    const tbody = document.getElementById('ekskriTableBody');

    if (currentEditId !== null) {
        const row = tbody.querySelector('tr[data-id="' + currentEditId + '"]');
        if (row) {
            row.cells[0].textContent = nama;
            row.cells[1].textContent = pembina  || '—';
            row.cells[2].textContent = jadwal   || '—';
            row.cells[3].textContent = anggota  || '—';
            row.cells[4].textContent = prestasi || '—';
        }
        showToast('Ekskul berhasil diperbarui.');
    } else {
        eksIdCounter++;
        const id  = eksIdCounter;
        const row = document.createElement('tr');
        row.setAttribute('data-id', id);
        row.innerHTML =
            '<td>' + nama + '</td><td>' + (pembina||'—') + '</td><td>' + (jadwal||'—') + '</td>' +
            '<td>' + (anggota||'—') + '</td><td>' + (prestasi||'—') + '</td>' +
            '<td>' +
                '<button class="action-btn" onclick="openModal(\'modal-ekskul\',' + id + ')">✏️</button>' +
                '<button class="action-btn del" onclick="deleteRow(\'ekskriTableBody\',' + id + ')">🗑️</button>' +
            '</td>';
        tbody.appendChild(row);
        showToast('Ekskul berhasil ditambahkan.');
    }
    closeModal('modal-ekskul');
    syncEkskulToStorage();
}

/* ══════════════════════════════════════════════
   PERSISTENSI — localStorage
   Data tidak hilang saat pindah halaman
   ══════════════════════════════════════════════ */

/* ── GURU ── */
function syncGuruToStorage() {
    const tbody = document.getElementById('teacherTableBody');
    if (!tbody) return;
    const data = [];
    tbody.querySelectorAll('tr').forEach(row => {
        const statusSpan = row.cells[4] ? row.cells[4].querySelector('span') : null;
        data.push({
            id        : row.dataset.id,
            jabatan   : row.dataset.jabatan   || '',
            fotoFile  : row.dataset.fotoFile  || '',
            foto      : row.dataset.foto      || '',
            nama      : row.cells[0] ? row.cells[0].textContent.trim() : '',
            mapel     : row.cells[1] ? row.cells[1].textContent.trim() : '',
            pendidikan: row.cells[2] ? row.cells[2].textContent.trim() : '',
            exp       : row.cells[3] ? row.cells[3].textContent.trim() : '',
            status    : statusSpan   ? statusSpan.textContent.trim()   : ''
        });
    });
    localStorage.setItem('guruData', JSON.stringify(data));
}

function loadGuruFromStorage() {
    /* ── data-akademik.html: restore tabel ── */
    const tbody = document.getElementById('teacherTableBody');
    if (tbody) {
        const raw = localStorage.getItem('guruData');
        if (!raw) { syncGuruToStorage(); return; } /* first visit: save hardcoded data */
        let data;
        try { data = JSON.parse(raw); } catch(e) { return; }
        if (!data || !data.length) return;

        tbody.innerHTML = '';
        data.forEach(guru => {
            const statusClass = guru.status === 'Aktif' ? 'status-active' : 'status-inactive';
            const row = document.createElement('tr');
            row.setAttribute('data-id', guru.id);
            if (guru.jabatan)  row.dataset.jabatan  = guru.jabatan;
            if (guru.fotoFile) row.dataset.fotoFile = guru.fotoFile;
            if (guru.foto)     row.dataset.foto     = guru.foto;
            row.innerHTML =
                '<td>' + guru.nama + '</td>' +
                '<td>' + guru.mapel + '</td>' +
                '<td>' + guru.pendidikan + '</td>' +
                '<td>' + guru.exp + '</td>' +
                '<td><span class="status-badge ' + statusClass + '">' + guru.status + '</span></td>' +
                '<td>' +
                    '<button class="action-btn" onclick="openModal(\'modal-guru\',' + guru.id + ')" title="Edit">✏️</button>' +
                    '<button class="action-btn del" onclick="deleteRow(\'teacherTableBody\',' + guru.id + ')" title="Hapus">🗑️</button>' +
                '</td>';
            tbody.appendChild(row);
        });
        return;
    }

    /* ── guru.html: render kartu ── */
    const grid = document.getElementById('teacherGrid');
    if (!grid) return;
    const raw = localStorage.getItem('guruData');
    if (!raw) return; /* belum pernah buka data-akademik, tampilkan hardcode */
    let data;
    try { data = JSON.parse(raw); } catch(e) { return; }
    if (!data || !data.length) return;

    const deptMap = {
        'Biologi':'ipa','Kimia':'ipa','Fisika':'ipa','Matematika':'ipa',
        'Ekonomi':'ips','Sosiologi':'ips','Geografi':'ips','Sejarah':'ips','Akuntansi':'ips',
        'Bahasa Indonesia':'bahasa','Bahasa Inggris':'bahasa',
        'Informatika':'tek',
        'PJOK':'pend','PPKn':'pend','Pendidikan Agama Islam':'pend'
    };
    const bgColors = ['avatar-bg-1','avatar-bg-2','avatar-bg-3','avatar-bg-4',
                      'avatar-bg-5','avatar-bg-6','avatar-bg-7','avatar-bg-8'];

    grid.innerHTML = '';
    data.forEach(function(guru, i) {
        const dept     = deptMap[guru.mapel] || 'semua';
        const initials = guru.nama.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
        const bg       = bgColors[i % 8];

        let avatarHTML;
        if (guru.foto) {
            /* base64 dari upload di data-akademik */
            avatarHTML = '<img src="' + guru.foto + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;object-position:top center">';
        } else if (guru.fotoFile) {
            /* file dari folder images/ */
            avatarHTML =
                '<img src="images/' + guru.fotoFile + '" ' +
                'style="width:100%;height:100%;object-fit:cover;border-radius:50%;object-position:top center" ' +
                'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
                '<span class="avatar-initials" style="display:none">' + initials + '</span>';
        } else {
            avatarHTML = '<span class="avatar-initials" style="display:flex">' + initials + '</span>';
        }

        const card = document.createElement('div');
        card.className    = 'teacher-card reveal visible';
        card.dataset.dept = dept;
        card.innerHTML =
            '<div class="teacher-avatar ' + bg + '">' + avatarHTML + '</div>' +
            '<div class="teacher-info">' +
                '<div class="teacher-name">'    + guru.nama   + '</div>' +
                '<div class="teacher-subject">' + (guru.jabatan || guru.status) + '</div>' +
                '<div class="teacher-mapel">'   + guru.mapel  + (guru.exp ? ' · ' + guru.exp : '') + '</div>' +
            '</div>';
        grid.appendChild(card);
    });
}

/* ── FASILITAS ── */
function syncFasilitasToStorage() {
    const tbody = document.getElementById('fasilitasTableBody');
    if (!tbody) return;
    const data = [];
    tbody.querySelectorAll('tr').forEach(row => {
        const statusSpan = row.cells[4] ? row.cells[4].querySelector('span') : null;
        data.push({
            id      : row.dataset.id,
            nama    : row.cells[0] ? row.cells[0].textContent.trim() : '',
            kap     : row.cells[1] ? row.cells[1].textContent.trim() : '',
            kondisi : row.cells[2] ? row.cells[2].textContent.trim() : '',
            lokasi  : row.cells[3] ? row.cells[3].textContent.trim() : '',
            status  : statusSpan   ? statusSpan.textContent.trim()   : ''
        });
    });
    localStorage.setItem('fasilitasData', JSON.stringify(data));
}

function loadFasilitasFromStorage() {
    const tbody = document.getElementById('fasilitasTableBody');
    if (!tbody) return;
    const raw = localStorage.getItem('fasilitasData');
    if (!raw) { syncFasilitasToStorage(); return; }
    let data;
    try { data = JSON.parse(raw); } catch(e) { return; }
    if (!data || !data.length) return;

    tbody.innerHTML = '';
    data.forEach(f => {
        const statusClass = f.status === 'Tersedia' ? 'status-active' : 'status-inactive';
        const row = document.createElement('tr');
        row.setAttribute('data-id', f.id);
        row.innerHTML =
            '<td>' + f.nama + '</td><td>' + f.kap + '</td><td>' + f.kondisi + '</td><td>' + f.lokasi + '</td>' +
            '<td><span class="status-badge ' + statusClass + '">' + f.status + '</span></td>' +
            '<td>' +
                '<button class="action-btn" onclick="openModal(\'modal-fasilitas\',' + f.id + ')">✏️</button>' +
                '<button class="action-btn del" onclick="deleteRow(\'fasilitasTableBody\',' + f.id + ')">🗑️</button>' +
            '</td>';
        tbody.appendChild(row);
    });
}

/* ── EKSKUL ── */
function syncEkskulToStorage() {
    const tbody = document.getElementById('ekskriTableBody');
    if (!tbody) return;
    const data = [];
    tbody.querySelectorAll('tr').forEach(row => {
        data.push({
            id      : row.dataset.id,
            nama    : row.cells[0] ? row.cells[0].textContent.trim() : '',
            pembina : row.cells[1] ? row.cells[1].textContent.trim() : '',
            jadwal  : row.cells[2] ? row.cells[2].textContent.trim() : '',
            anggota : row.cells[3] ? row.cells[3].textContent.trim() : '',
            prestasi: row.cells[4] ? row.cells[4].textContent.trim() : ''
        });
    });
    localStorage.setItem('ekskulData', JSON.stringify(data));
}

function loadEkskulFromStorage() {
    const tbody = document.getElementById('ekskriTableBody');
    if (!tbody) return;
    const raw = localStorage.getItem('ekskulData');
    if (!raw) { syncEkskulToStorage(); return; }
    let data;
    try { data = JSON.parse(raw); } catch(e) { return; }
    if (!data || !data.length) return;

    tbody.innerHTML = '';
    data.forEach(e => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', e.id);
        row.innerHTML =
            '<td>' + e.nama + '</td><td>' + e.pembina + '</td><td>' + e.jadwal + '</td>' +
            '<td>' + e.anggota + '</td><td>' + e.prestasi + '</td>' +
            '<td>' +
                '<button class="action-btn" onclick="openModal(\'modal-ekskul\',' + e.id + ')">✏️</button>' +
                '<button class="action-btn del" onclick="deleteRow(\'ekskriTableBody\',' + e.id + ')">🗑️</button>' +
            '</td>';
        tbody.appendChild(row);
    });
}

/* ── init semua saat halaman load ── */
loadGuruFromStorage();
loadFasilitasFromStorage();
loadEkskulFromStorage();

/* ─── PPDB FORM VALIDATION ─── */
let siswaIdCounter = 200;
function validateField(id, errId, condition) {
    const el = document.getElementById(errId);
    if (!el) return condition;
    if (!condition) { el.classList.add('visible'); return false; }
    el.classList.remove('visible'); return true;
}

function submitPPDB(e) {
    e.preventDefault();

    const nik    = document.getElementById('ppdb-nik')    ? document.getElementById('ppdb-nik').value.trim()    : '';
    const nisn   = document.getElementById('ppdb-nisn')   ? document.getElementById('ppdb-nisn').value.trim()   : '';
    const nama   = document.getElementById('ppdb-nama').value.trim();
    const jk     = document.getElementById('ppdb-jk').value;
    const ttl    = document.getElementById('ppdb-ttl').value.trim();
    const dob    = document.getElementById('ppdb-dob').value;
    const alamat = document.getElementById('ppdb-alamat') ? document.getElementById('ppdb-alamat').value.trim() : '';
    const hp     = document.getElementById('ppdb-hp').value.trim();
    const asal   = document.getElementById('ppdb-asal').value.trim();
    const jalur  = document.getElementById('ppdb-jalur').value;

    const valid = [
        validateField('ppdb-nik',    'err-nik',    !nik    || /^\d{16}$/.test(nik)),
        validateField('ppdb-nisn',   'err-nisn',   !nisn   || /^\d{10}$/.test(nisn)),
        validateField('ppdb-nama',   'err-nama',   nama.length >= 3),
        validateField('ppdb-jk',     'err-jk',     jk !== ''),
        validateField('ppdb-ttl',    'err-ttl',    ttl.length > 0),
        validateField('ppdb-dob',    'err-dob',    dob.length > 0),
        validateField('ppdb-alamat', 'err-alamat', !alamat || alamat.length > 0),
        validateField('ppdb-hp',     'err-hp',     hp.replace(/\D/g,'').length >= 10),
        validateField('ppdb-asal',   'err-asal',   asal.length > 0),
        validateField('ppdb-jalur',  'err-jalur',  jalur !== ''),
    ].every(Boolean);
    if (!valid) return;

    const jalurLabels = {
        'zonasi'         : 'Zonasi',
        'afirmasi'       : 'Afirmasi / KETM',
        'prestasi-rapor' : 'Prestasi Nilai Rapor',
        'prestasi-lomba' : 'Prestasi Perlombaan',
        'pindah'         : 'Perpindahan Tugas Ortu/Wali'
    };

    /* simpan ke tabel siswa (di data-akademik) via localStorage */
    siswaIdCounter++;
    const siswaRaw = localStorage.getItem('siswaData');
    const siswaData = siswaRaw ? JSON.parse(siswaRaw) : [];
    siswaData.push({
        id    : siswaIdCounter,
        nama  : nama,
        asal  : asal,
        jalur : jalurLabels[jalur] || jalur,
        nisn  : nisn || '-',
        hp    : hp,
        status: 'Menunggu'
    });
    localStorage.setItem('siswaData', JSON.stringify(siswaData));

    document.getElementById('ppdbForm').style.display = 'none';
    document.getElementById('ppdbSuccess').classList.add('visible');
    showToast('Pendaftaran berhasil!', '🎉');
}

/* load siswa data di data-akademik */
(function loadSiswaFromStorage() {
    const tbody = document.getElementById('siswaTableBody');
    if (!tbody) return;
    const raw = localStorage.getItem('siswaData');
    if (!raw) return;
    let data;
    try { data = JSON.parse(raw); } catch(e) { return; }
    data.forEach(s => {
        /* skip jika id sudah ada (hardcoded) */
        if (tbody.querySelector('tr[data-id="' + s.id + '"]')) return;
        const row = document.createElement('tr');
        row.setAttribute('data-id', s.id);
        row.innerHTML =
            '<td>' + s.nama + '</td><td>' + s.asal + '</td><td>' + s.jalur + '</td>' +
            '<td>' + s.nisn + '</td><td>—</td>' +
            '<td><span class="status-badge status-inactive">Menunggu</span></td>' +
            '<td><button class="action-btn del" onclick="deleteRow(\'siswaTableBody\',' + s.id + ')">🗑️</button></td>';
        tbody.appendChild(row);
    });
})();