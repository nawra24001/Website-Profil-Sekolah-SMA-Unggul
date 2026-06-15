
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
        card.setAttribute('data-hidden', dept !== 'semua' && card.dataset.dept !== dept ? 'true' : 'false');
    });
    }

    /* ─── CAROUSEL ─── */
    let carouselPos = 0;
    const CARDS_PER_VIEW = window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 4;
    const CARD_W = 100 / CARDS_PER_VIEW;
    function buildDots() {
    const total = document.querySelectorAll('.ekskul-card').length;
    const pages = Math.ceil(total / CARDS_PER_VIEW);
    const dots = document.getElementById('carouselDots');
    dots.innerHTML = '';
    for (let i = 0; i < pages; i++) {
        const d = document.createElement('div');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dots.appendChild(d);
    }
    }
    function moveCarousel(dir) {
    const cards = document.querySelectorAll('.ekskul-card');
    const total = cards.length;
    const pages = Math.ceil(total / CARDS_PER_VIEW);
    carouselPos = (carouselPos + dir + pages) % pages;
    const track = document.getElementById('carouselTrack');
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
    let visible = 0;
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = text.includes(q);
        row.setAttribute('data-hidden', match ? 'false' : 'true');
        if (match) visible++;
    });
    }

    /* ─── MODAL ─── */
    let currentEditId = null;
    let currentEditType = null;
    function openModal(modalId, editId) {
    currentEditId = editId;
    currentEditType = modalId;

    if (modalId === 'modal-guru') {
        document.getElementById('modal-guru-title').textContent = editId !== null ? 'Edit Data Guru' : 'Tambah Data Guru';
        if (editId !== null) {
        const row = document.querySelector('#teacherTableBody tr[data-id="' + editId + '"]');
        document.getElementById('mg-nama').value = row.cells[0].textContent.trim();
        document.getElementById('mg-mapel').value = row.cells[1].textContent.trim();
        document.getElementById('mg-pendidikan').value = row.cells[2].textContent.trim();
        document.getElementById('mg-exp').value = row.cells[3].textContent.trim();
        document.getElementById('mg-status').value = row.cells[4].textContent.trim();
        } else {
        document.getElementById('mg-nama').value = '';
        document.getElementById('mg-mapel').value = '';
        document.getElementById('mg-pendidikan').value = 'S1';
        document.getElementById('mg-exp').value = '';
        document.getElementById('mg-status').value = 'Aktif';
        }
    }

    if (modalId === 'modal-fasilitas') {
        document.getElementById('modal-fasilitas-title').textContent = editId !== null ? 'Edit Fasilitas' : 'Tambah Fasilitas';
        if (editId !== null) {
        const row = document.querySelector('#fasilitasTableBody tr[data-id="' + editId + '"]');
        document.getElementById('mf-nama').value = row.cells[0].textContent.trim();
        document.getElementById('mf-kap').value = row.cells[1].textContent.trim();
        document.getElementById('mf-kondisi').value = row.cells[2].textContent.trim();
        document.getElementById('mf-lokasi').value = row.cells[3].textContent.trim();
        document.getElementById('mf-status').value = row.cells[4].textContent.trim();
        } else {
        document.getElementById('mf-nama').value = '';
        document.getElementById('mf-kap').value = '';
        document.getElementById('mf-kondisi').value = 'Sangat Baik';
        document.getElementById('mf-lokasi').value = '';
        document.getElementById('mf-status').value = 'Tersedia';
        }
    }

    if (modalId === 'modal-ekskul') {
        document.getElementById('modal-ekskul-title').textContent = editId !== null ? 'Edit Ekskul' : 'Tambah Ekskul';
        if (editId !== null) {
        const row = document.querySelector('#ekskriTableBody tr[data-id="' + editId + '"]');
        document.getElementById('me-nama').value = row.cells[0].textContent.trim();
        document.getElementById('me-pembina').value = row.cells[1].textContent.trim();
        document.getElementById('me-jadwal').value = row.cells[2].textContent.trim();
        document.getElementById('me-anggota').value = row.cells[3].textContent.trim();
        document.getElementById('me-prestasi').value = row.cells[4].textContent.trim() === '—' ? '' : row.cells[4].textContent.trim();
        } else {
        document.getElementById('me-nama').value = '';
        document.getElementById('me-pembina').value = '';
        document.getElementById('me-jadwal').value = '';
        document.getElementById('me-anggota').value = '';
        document.getElementById('me-prestasi').value = '';
        }
    }

    document.getElementById(modalId).classList.add('open');
    }
    function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
    currentEditId = null;
    }
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('open');
    });
    });

    /* ─── TOAST ─── */
    function showToast(msg, icon = '✅') {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    document.getElementById('toastIcon').textContent = icon;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3200);
    }

    /* ─── CRUD: DELETE ROW ─── */
    function deleteRow(tbodyId, id) {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    const row = document.querySelector('#' + tbodyId + ' tr[data-id="' + id + '"]');
    if (row) { row.remove(); showToast('Data berhasil dihapus.', '🗑️'); }
    }

    /* ─── CRUD: SAVE GURU ─── */
    let guruIdCounter = 100;
    function saveGuruRow() {
    const nama = document.getElementById('mg-nama').value.trim();
    const mapel = document.getElementById('mg-mapel').value.trim();
    const pend = document.getElementById('mg-pendidikan').value;
    const exp = document.getElementById('mg-exp').value.trim();
    const status = document.getElementById('mg-status').value;
    if (!nama || !mapel) { showToast('Nama dan mata pelajaran wajib diisi.', '⚠️'); return; }
    const statusClass = status === 'Aktif' ? 'status-active' : 'status-inactive';
    const tbody = document.getElementById('teacherTableBody');
    if (currentEditId !== null) {
        const row = tbody.querySelector('tr[data-id="' + currentEditId + '"]');
        if (row) {
        row.cells[0].textContent = nama;
        row.cells[1].textContent = mapel;
        row.cells[2].textContent = pend;
        row.cells[3].textContent = exp;
        row.cells[4].innerHTML = '<span class="status-badge ' + statusClass + '">' + status + '</span>';
        }
        showToast('Data guru berhasil diperbarui.');
    } else {
        guruIdCounter++;
        const row = document.createElement('tr');
        row.setAttribute('data-id', guruIdCounter);
        row.innerHTML = '<td>' + nama + '</td><td>' + mapel + '</td><td>' + pend + '</td><td>' + (exp || '—') + '</td><td><span class="status-badge ' + statusClass + '">' + status + '</span></td><td><button class="action-btn" onclick="openModal(\'modal-guru\',' + guruIdCounter + ')">✏️</button><button class="action-btn del" onclick="deleteRow(\'teacherTableBody\',' + guruIdCounter + ')">🗑️</button></td>';
        tbody.appendChild(row);
        showToast('Guru baru berhasil ditambahkan.');
    }
    closeModal('modal-guru');
    document.getElementById('mg-nama').value = '';
    document.getElementById('mg-mapel').value = '';
    document.getElementById('mg-exp').value = '';
    }

    /* ─── CRUD: SAVE FASILITAS ─── */
    let fasIdCounter = 200;
    let siswaIdCounter = 200;
    function saveFasRow() {
    const nama = document.getElementById('mf-nama').value.trim();
    const kap = document.getElementById('mf-kap').value.trim();
    const kondisi = document.getElementById('mf-kondisi').value;
    const lok = document.getElementById('mf-lokasi').value.trim();
    const status = document.getElementById('mf-status').value;
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
        row.cells[4].innerHTML = '<span class="status-badge ' + statusClass + '">' + status + '</span>';
        }
        showToast('Fasilitas berhasil diperbarui.');
    } else {
        fasIdCounter++;
        const row = document.createElement('tr');
        row.setAttribute('data-id', fasIdCounter);
        row.innerHTML = '<td>' + nama + '</td><td>' + (kap||'—') + '</td><td>' + kondisi + '</td><td>' + (lok||'—') + '</td><td><span class="status-badge ' + statusClass + '">' + status + '</span></td><td><button class="action-btn" onclick="openModal(\'modal-fasilitas\',' + fasIdCounter + ')">✏️</button><button class="action-btn del" onclick="deleteRow(\'fasilitasTableBody\',' + fasIdCounter + ')">🗑️</button></td>';
        tbody.appendChild(row);
        showToast('Fasilitas berhasil ditambahkan.');
    }
    closeModal('modal-fasilitas');
    }

    /* ─── CRUD: SAVE EKSKUL ─── */
    let eksIdCounter = 300;
    function saveEkskulRow() {
    const nama = document.getElementById('me-nama').value.trim();
    const pembina = document.getElementById('me-pembina').value.trim();
    const jadwal = document.getElementById('me-jadwal').value.trim();
    const anggota = document.getElementById('me-anggota').value.trim();
    const prestasi = document.getElementById('me-prestasi').value.trim();
    if (!nama) { showToast('Nama ekskul wajib diisi.', '⚠️'); return; }
    const tbody = document.getElementById('ekskriTableBody');
    if (currentEditId !== null) {
        const row = tbody.querySelector('tr[data-id="' + currentEditId + '"]');
        if (row) {
        row.cells[0].textContent = nama;
        row.cells[1].textContent = pembina || '—';
        row.cells[2].textContent = jadwal || '—';
        row.cells[3].textContent = anggota || '—';
        row.cells[4].textContent = prestasi || '—';
        }
        showToast('Ekskul berhasil diperbarui.');
    } else {
        eksIdCounter++;
        const row = document.createElement('tr');
        row.setAttribute('data-id', eksIdCounter);
        row.innerHTML = '<td>' + nama + '</td><td>' + (pembina||'—') + '</td><td>' + (jadwal||'—') + '</td><td>' + (anggota||'—') + '</td><td>' + (prestasi||'—') + '</td><td><button class="action-btn" onclick="openModal(\'modal-ekskul\',' + eksIdCounter + ')">✏️</button><button class="action-btn del" onclick="deleteRow(\'ekskriTableBody\',' + eksIdCounter + ')">🗑️</button></td>';
        tbody.appendChild(row);
        showToast('Ekskul berhasil ditambahkan.');
    }
    closeModal('modal-ekskul');
    }

    /* ─── PPDB FORM VALIDATION ─── */
    function validateField(id, errId, condition) {
    const err = document.getElementById(errId);
    if (!condition) { err.classList.add('visible'); return false; }
    err.classList.remove('visible'); return true;
    }
    function submitPPDB(e) {
    e.preventDefault();
    const nama = document.getElementById('ppdb-nama').value.trim();
    const ttl = document.getElementById('ppdb-ttl').value.trim();
    const dob = document.getElementById('ppdb-dob').value;
    const jk = document.getElementById('ppdb-jk').value;
    const hp = document.getElementById('ppdb-hp').value.trim();
    const email = document.getElementById('ppdb-email').value.trim();
    const asal = document.getElementById('ppdb-asal').value.trim();
    const jalur = document.getElementById('ppdb-jalur').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = [
        validateField('ppdb-nama', 'err-nama', nama.length >= 3),
        validateField('ppdb-ttl', 'err-ttl', ttl.length > 0),
        validateField('ppdb-dob', 'err-dob', dob.length > 0),
        validateField('ppdb-jk', 'err-jk', jk !== ''),
        validateField('ppdb-hp', 'err-hp', hp.replace(/\D/g,'').length >= 10),
        validateField('ppdb-email', 'err-email', emailRegex.test(email)),
        validateField('ppdb-asal', 'err-asal', asal.length > 0),
        validateField('ppdb-jalur', 'err-jalur', jalur !== ''),
    ].every(Boolean);
    if (!valid) return;

    const jalurLabels = {
        'reguler': 'Reguler',
        'prestasi': 'Prestasi Akademik',
        'prestasi-non': 'Prestasi Non-Akademik',
        'afirmasi': 'Afirmasi'
    };
    siswaIdCounter++;
    const tbody = document.getElementById('siswaTableBody');
    const row = document.createElement('tr');
    row.setAttribute('data-id', siswaIdCounter);
    row.innerHTML = '<td>' + nama + '</td><td>' + asal + '</td><td>' + (jalurLabels[jalur] || jalur) + '</td><td>' + hp + '</td><td>' + email + '</td><td><span class="status-badge status-inactive">Menunggu</span></td><td><button class="action-btn del" onclick="deleteRow(\'siswaTableBody\',' + siswaIdCounter + ')">🗑️</button></td>';
    tbody.appendChild(row);

    document.getElementById('ppdbForm').style.display = 'none';
    document.getElementById('ppdbSuccess').classList.add('visible');
    showToast('Pendaftaran berhasil! Data tersimpan di Data Akademik → Calon Siswa.', '🎉');
    }
