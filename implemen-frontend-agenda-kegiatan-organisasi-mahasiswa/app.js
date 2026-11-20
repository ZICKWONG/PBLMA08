/* =========================================================
   Agenda Kegiatan Organisasi Mahasiswa — app.js
   Vanilla JavaScript, tanpa framework, tanpa backend.

   Struktur bagian:
   1) DATA DUMMY      — sumber data awal (mudah diganti REST API)
   1b) DATA AUTH      — akun dummy login (admin & anggota)
   2) STATE           — status aplikasi di memori
   3) UTIL            — pembantu format & notifikasi
   4) AUTH & HAK AKSES— login, logout, daftar, guard view
   5) RENDER          — fungsi render tiap view
   6) CRUD / AKSI     — tambah, ubah, hapus, simpan kehadiran
   7) NAVIGASI & EVENT— perpindahan view + binding tombol
   ========================================================= */

/* =========================================================
   1) DATA DUMMY
   — Nantinya bisa diganti dengan fetch() ke REST API:
     contoh: const kegiatan = await api.get('/kegiatan');
   ========================================================= */

/* =========================================================
   1b) DATA AUTH — akun login dummy (in-memory)
   — Nantinya diganti POST /auth/login ke backend.
   Hak akses:
     admin   → bisa akses semua menu
     anggota → hanya melihat jadwal kegiatan (read-only),
               tidak dapat mengedit/menambah/menghapus
   ========================================================= */
const DUMMY_USERS = [
  {
    username: "admin",
    email: "admin@pbl-if.ac.id",
    password: "admin123",
    role: "admin",
    nama: "Admin PBL-IF",
  },
  {
    username: "anggota",
    email: "anggota@pbl-if.ac.id",
    password: "anggota123",
    role: "anggota",
    nama: "Anggota Mahasiswa",
  },
];

const DUMMY_ANGGOTA = [
  { id: 1, nim: "2301001", nama: "Rina Putri",      jabatan: "Ketua" },
  { id: 2, nim: "2301002", nama: "Dimas Pratama",   jabatan: "Sekretaris" },
  { id: 3, nim: "2301003", nama: "Sari Wulandari",  jabatan: "Bendahara" },
  { id: 4, nim: "2301004", nama: "Budi Santoso",    jabatan: "Anggota" },
];

/* Tanggal disimpan ISO (yyyy-mm-dd) agar mudah dihitung;
   ditampilkan sesuai wireframe (d MMM yyyy). */
const DUMMY_KEGIATAN = [
  {
    id: 1,
    nama: "Seminar Kepemimpinan",
    kategori: "Seminar",
    tanggal: "2026-10-12",
    jam: "09:00",
    lokasi: "Aula",
    pic: "Rina Putri",
    status: "Direncanakan",
    deskripsi: "Seminar nasional kepemimpinan mahasiswa.",
    jumlahPeserta: 25,
  },
  {
    id: 2,
    nama: "Rapat Evaluasi Bulanan",
    kategori: "Rapat",
    tanggal: "2026-10-15",
    jam: "16:00",
    lokasi: "Ruang BEM",
    pic: "Dimas Pratama",
    status: "Direncanakan",
    deskripsi: "Evaluasi program kerja bulan berjalan.",
    jumlahPeserta: 18,
  },
  {
    id: 3,
    nama: "Lomba Futsal Antar Jurusan",
    kategori: "Lomba",
    tanggal: "2026-10-20",
    jam: "08:00",
    lokasi: "Lapangan",
    pic: "Sari Wulandari",
    status: "Direncanakan",
    deskripsi: "Turnamen futsal antar jurusan.",
    jumlahPeserta: 40,
  },
  {
    id: 4,
    nama: "Bakti Sosial",
    kategori: "Sosial",
    tanggal: "2026-10-05",
    jam: "07:00",
    lokasi: "Desa Sukamaju",
    pic: "Budi Santoso",
    status: "Selesai",
    deskripsi: "Bakti sosial di desa binaan.",
    jumlahPeserta: 12,
  },
  {
    id: 5,
    nama: "Pelatihan Dasar Organisasi",
    kategori: "Latihan",
    tanggal: "2026-10-25",
    jam: "13:00",
    lokasi: "Ruang Kelas 3A",
    pic: "Rina Putri",
    status: "Direncanakan",
    deskripsi: "Pelatihan dasar untuk pengurus baru.",
    jumlahPeserta: 30,
  },
  {
    id: 6,
    nama: "Workshop Penulisan Proposal",
    kategori: "Seminar",
    tanggal: "2026-11-02",
    jam: "10:00",
    lokasi: "Aula",
    pic: "Dimas Pratama",
    status: "Direncanakan",
    deskripsi: "Workshop penyusunan proposal kegiatan.",
    jumlahPeserta: 22,
  },
  {
    id: 7,
    nama: "Rapat Anggota Tahunan",
    kategori: "Rapat",
    tanggal: "2026-11-10",
    jam: "19:00",
    lokasi: "Ruang BEM",
    pic: "Sari Wulandari",
    status: "Direncanakan",
    deskripsi: "Rapat tahunan anggota organisasi.",
    jumlahPeserta: 45,
  },
  {
    id: 8,
    nama: "Donor Darah Bersama PMI",
    kategori: "Sosial",
    tanggal: "2026-11-18",
    jam: "08:30",
    lokasi: "Gedung Serbaguna",
    pic: "Budi Santoso",
    status: "Direncanakan",
    deskripsi: "Kegiatan donor darah bekerja sama dengan PMI.",
    jumlahPeserta: 20,
  },
  {
    id: 9,
    nama: "Latihan Gabungan Ekskul",
    kategori: "Latihan",
    tanggal: "2026-11-25",
    jam: "15:30",
    lokasi: "Lapangan Utama",
    pic: "Rina Putri",
    status: "Direncanakan",
    deskripsi: "Latihan gabungan antar ekstrakurikuler.",
    jumlahPeserta: 35,
  },
  {
    id: 10,
    nama: "Seminar Karir & Magang",
    kategori: "Seminar",
    tanggal: "2026-12-01",
    jam: "09:30",
    lokasi: "Aula",
    pic: "Dimas Pratama",
    status: "Direncanakan",
    deskripsi: "Seminar persiapan karir dan magang mahasiswa.",
    jumlahPeserta: 28,
  },
  {
    id: 11,
    nama: "Turnamen Basket Internal",
    kategori: "Lomba",
    tanggal: "2026-12-08",
    jam: "16:00",
    lokasi: "Lapangan Basket",
    pic: "Sari Wulandari",
    status: "Direncanakan",
    deskripsi: "Turnamen basket antar kelas.",
    jumlahPeserta: 32,
  },
  {
    id: 12,
    nama: "Pembukaan Orientasi Mahasiswa",
    kategori: "Sosial",
    tanggal: "2026-12-15",
    jam: "07:30",
    lokasi: "Lapangan Utama",
    pic: "Budi Santoso",
    status: "Direncanakan",
    deskripsi: "Pembukaan kegiatan orientasi mahasiswa baru.",
    jumlahPeserta: 50,
  },
];

/* Peserta per kegiatan: { [kegiatanId]: [ { anggotaId, kehadiran } ] } */
const DUMMY_PESERTA = {
  1: [
    { anggotaId: 1, kehadiran: "Hadir" },
    { anggotaId: 2, kehadiran: "Belum" },
    { anggotaId: 3, kehadiran: "Tidak Hadir" },
    { anggotaId: 4, kehadiran: "Hadir" },
  ],
  2: [
    { anggotaId: 1, kehadiran: "Hadir" },
    { anggotaId: 2, kehadiran: "Hadir" },
    { anggotaId: 3, kehadiran: "Belum" },
  ],
};

/* =========================================================
   2) STATE — status aplikasi di memori
   ========================================================= */

const state = {
  anggota: DUMMY_ANGGOTA.map((a) => ({ ...a })),
  kegiatan: DUMMY_KEGIATAN.map((k) => ({ ...k })),
  peserta: JSON.parse(JSON.stringify(DUMMY_PESERTA)),

  // auth: null = belum login; { username, role, nama, email }
  auth: null,
  // tampilan login aktif: "anggota" | "admin" | "daftar"
  authView: "anggota",

  // navigasi
  currentView: "dashboard",

  // kegiatan
  kegiatanSearch: "",
  kegiatanFilter: { kategori: "", status: "" },
  kegiatanPage: 1,
  kegiatanPerPage: 4,
  editingKegiatanId: null,

  // anggota
  anggotaSearch: "",
  anggotaFilter: { jabatan: "" },
  editingAnggotaId: null,

  // peserta
  selectedKegiatanId: 1,

  // laporan
  laporanRows: null, // null = tampilkan semua
};

let nextId = 100;

/* =========================================================
   3) UTIL — format tanggal, escape HTML, notifikasi
   ========================================================= */

/** Ubah "2026-10-12" → "12 Okt 2026" (sesuai wireframe). */
function formatDate(iso) {
  if (!iso) return "-";
  const bulan = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${bulan[m - 1]} ${y}`;
}

/** "09:00" → "09.00" (gaya wireframe). */
function formatJam(jam) {
  if (!jam) return "-";
  return jam.replace(":", ".");
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let toastTimer = null;
function showToast(message, type = "ok") {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.toggle("error", type === "error");
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
  }, 2600);
}

function findAnggota(id) {
  return state.anggota.find((a) => a.id === id) || null;
}

function findKegiatan(id) {
  return state.kegiatan.find((k) => k.id === id) || null;
}

/** Tampilkan error validasi pada satu field. */
function setFieldError(inputId, errId, show) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.toggle("invalid", show);
  if (err) err.hidden = !show;
}

/* =========================================================
   4) AUTH & HAK AKSES
   — Login dummy in-memory; siap diganti ke POST /auth/login.
   Hak akses:
     admin   → semua menu & aksi CRUD
     anggota → semua menu, tapi READ-ONLY
               (boleh lihat semua data, tidak bisa edit/tambah/hapus)
   ========================================================= */

function isAdmin() {
  return state.auth && state.auth.role === "admin";
}

function isAnggota() {
  return state.auth && state.auth.role === "anggota";
}

/**
 * Terapkan hak akses UI sesuai peran:
 * - Menu: keduanya boleh lihat semua
 * - Anggota: sembunyikan semua kontrol edit (tambah/edit/hapus/simpan)
 */
function applyRoleAccess() {
  // Kedua peran boleh akses semua menu
  document.querySelectorAll(".menu-item").forEach((btn) => {
    btn.hidden = !state.auth;
  });

  const readonly = isAnggota();

  // Kontrol yang disembunyikan saat anggota (read-only)
  const editControls = [
    "btnTambahKegiatan", // Data Kegiatan
    "btnTambahAnggota",  // Data Anggota
    "btnTambahPeserta",  // Peserta Kegiatan
    "btnSimpanKehadiran", // Peserta Kegiatan
  ];
  editControls.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = readonly;
  });
}

/** Cegah view tanpa login; setelah login semua view boleh (anggota read-only). */
function canAccessView(view) {
  return !!state.auth;
}

/* ----- Tampilan login (tukar kartu: anggota / admin / daftar) ----- */
function showAuthView(view) {
  state.authView = view;
  document.getElementById("cardLoginAnggota").hidden = view !== "anggota";
  document.getElementById("cardLoginAdmin").hidden = view !== "admin";
  document.getElementById("cardDaftar").hidden = view !== "daftar";

  // bersihkan error & input password saat pindah tampilan
  ["loginAnggotaError", "loginAdminError", "daftarError"].forEach((id) => {
    document.getElementById(id).hidden = true;
  });
}

function hideAuthError(card) {
  const map = {
    anggota: "loginAnggotaError",
    admin: "loginAdminError",
    daftar: "daftarError",
  };
  const el = document.getElementById(map[card]);
  if (el) el.hidden = true;
}

function showAuthError(card, message) {
  const map = {
    anggota: "loginAnggotaError",
    admin: "loginAdminError",
    daftar: "daftarError",
  };
  const el = document.getElementById(map[card]);
  if (el) {
    if (message) el.textContent = message;
    el.hidden = false;
  }
}

/**
 * Proses login dummy.
 * @param {string} userOrEmail - username atau email
 * @param {string} password
 * @param {string} expectedRole - "admin" | "anggota"
 * @returns {object|null} user bila cocok & role sesuai
 */
function authenticate(userOrEmail, password, expectedRole) {
  const key = userOrEmail.trim().toLowerCase();
  const user = DUMMY_USERS.find(
    (u) =>
      (u.username.toLowerCase() === key || u.email.toLowerCase() === key) &&
      u.password === password &&
      u.role === expectedRole
  );
  return user || null;
}

function loginSuccess(user, remember, usernameInput) {
  state.auth = {
    username: user.username,
    role: user.role,
    nama: user.nama,
    email: user.email,
  };

  // "Ingat saya" → simpan username saja (bukan password) di localStorage
  try {
    if (remember) {
      localStorage.setItem("remember_user", usernameInput);
      localStorage.setItem("remember_role", user.role);
    } else {
      localStorage.removeItem("remember_user");
      localStorage.removeItem("remember_role");
    }
  } catch (_) {
    /* localStorage mungkin diblokir — abaikan */
  }

  // tampilkan aplikasi, sembunyikan layar login
  document.getElementById("authScreen").hidden = true;
  document.getElementById("appScreen").hidden = false;

  applyRoleAccess();

  // Anggota & admin selalu mulai dari dashboard
  navigate("dashboard");
  showToast(`Selamat datang, ${user.nama}!`);
}

function logout() {
  state.auth = null;
  document.getElementById("modalProfil").hidden = true;
  document.getElementById("appScreen").hidden = true;
  document.getElementById("authScreen").hidden = false;

  // reset form login
  document.getElementById("formLoginAnggota").reset();
  document.getElementById("formLoginAdmin").reset();
  showAuthView("anggota");
  showToast("Anda telah keluar.");
}

/* =========================================================
   4) RENDER — fungsi render tiap view
   ========================================================= */

/* ---------- Dashboard: agenda terdekat ---------- */
function renderDashboard() {
  // Kegiatan berstatus direncanakan/berlangsung, diurutkan tanggal terdekat
  const rows = state.kegiatan
    .filter((k) => k.status === "Direncanakan" || k.status === "Berlangsung")
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
    .slice(0, 5);

  const body = document.getElementById("dashboardBody");
  if (!rows.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">Belum ada agenda.</td></tr>`;
    return;
  }

  body.innerHTML = rows
    .map(
      (k) => `
      <tr>
        <td>${escapeHtml(formatDate(k.tanggal))}</td>
        <td>${escapeHtml(formatJam(k.jam))}</td>
        <td>${escapeHtml(k.nama)}</td>
        <td>${escapeHtml(k.lokasi)}</td>
        <td>${escapeHtml(k.status)}</td>
      </tr>`
    )
    .join("");
}

/* ---------- Kegiatan: filter + pagination + tabel ---------- */
function getFilteredKegiatan() {
  const q = state.kegiatanSearch.trim().toLowerCase();
  const { kategori, status } = state.kegiatanFilter;

  return state.kegiatan
    .filter((k) => {
      const cocokCari =
        !q ||
        k.nama.toLowerCase().includes(q) ||
        k.lokasi.toLowerCase().includes(q) ||
        k.pic.toLowerCase().includes(q);
      const cocokKategori = !kategori || k.kategori === kategori;
      const cocokStatus = !status || k.status === status;
      return cocokCari && cocokKategori && cocokStatus;
    })
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
}

function renderKegiatan() {
  const filtered = getFilteredKegiatan();
  const perPage = state.kegiatanPerPage;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  if (state.kegiatanPage > totalPages) state.kegiatanPage = totalPages;

  const start = (state.kegiatanPage - 1) * perPage;
  const pageRows = filtered.slice(start, start + perPage);

  const body = document.getElementById("kegiatanBody");
  if (!pageRows.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="8">Tidak ada kegiatan ditemukan.</td></tr>`;
  } else {
    // Anggota: hanya melihat jadwal — kolom Aksi tanpa tombol edit/hapus
    const aksiCell = isAdmin()
      ? `<td>
            <div class="actions">
              <button type="button" class="btn btn-sm" data-act="edit-kegiatan" data-id="__ID__">Edit</button>
              <button type="button" class="btn btn-sm btn-danger" data-act="hapus-kegiatan" data-id="__ID__">Hapus</button>
            </div>
          </td>`
      : `<td><span class="text-secondary">—</span></td>`;

    body.innerHTML = pageRows
      .map(
        (k) => `
        <tr>
          <td>${escapeHtml(k.nama)}</td>
          <td>${escapeHtml(k.kategori)}</td>
          <td>${escapeHtml(formatDate(k.tanggal))}</td>
          <td>${escapeHtml(formatJam(k.jam))}</td>
          <td>${escapeHtml(k.lokasi)}</td>
          <td>${escapeHtml(k.pic)}</td>
          <td>${escapeHtml(k.status)}</td>
          ${aksiCell.replace("__ID__", k.id).replace("__ID__", k.id)}
        </tr>`
      )
      .join("");
  }

  renderKegiatanPagination(totalPages);
}

function renderKegiatanPagination(totalPages) {
  const wrap = document.getElementById("kegiatanPagination");
  if (totalPages <= 1) {
    wrap.innerHTML = "";
    return;
  }

  const page = state.kegiatanPage;
  let html = `<button type="button" class="page-btn" data-page="${page - 1}" ${page === 1 ? "disabled" : ""}>&lt;</button>`;
  for (let p = 1; p <= totalPages; p++) {
    html += `<button type="button" class="page-btn ${p === page ? "active" : ""}" data-page="${p}">${p}</button>`;
  }
  html += `<button type="button" class="page-btn" data-page="${page + 1}" ${page === totalPages ? "disabled" : ""}>&gt;</button>`;
  wrap.innerHTML = html;
}

/* ---------- Form Kegiatan ---------- */
function populatePicOptions() {
  const select = document.getElementById("fPic");
  const current = select.value;
  select.innerHTML =
    `<option value="">Pilih anggota</option>` +
    state.anggota
      .map((a) => `<option value="${escapeHtml(a.nama)}">${escapeHtml(a.nama)} — ${escapeHtml(a.jabatan)}</option>`)
      .join("");
  select.value = current;
}

function openKegiatanForm(kegiatan = null) {
  state.editingKegiatanId = kegiatan ? kegiatan.id : null;

  populatePicOptions();

  document.getElementById("formKegiatan").reset();
  ["Nama", "Kategori", "Tanggal", "Jam", "Lokasi", "Pic"].forEach((f) =>
    setFieldError("f" + f, "err" + f, false)
  );

  if (kegiatan) {
    document.getElementById("fNama").value = kegiatan.nama;
    document.getElementById("fKategori").value = kegiatan.kategori;
    document.getElementById("fTanggal").value = kegiatan.tanggal;
    document.getElementById("fJam").value = kegiatan.jam;
    document.getElementById("fLokasi").value = kegiatan.lokasi;
    document.getElementById("fPic").value = kegiatan.pic;
    document.getElementById("fStatus").value = kegiatan.status;
    document.getElementById("fDeskripsi").value = kegiatan.deskripsi || "";
  } else {
    document.getElementById("fStatus").value = "Direncanakan";
  }

  navigate("kegiatan-form");
}

function saveKegiatan(event) {
  event.preventDefault();

  const nama = document.getElementById("fNama").value.trim();
  const kategori = document.getElementById("fKategori").value;
  const tanggal = document.getElementById("fTanggal").value;
  const jam = document.getElementById("fJam").value;
  const lokasi = document.getElementById("fLokasi").value.trim();
  const pic = document.getElementById("fPic").value;
  const status = document.getElementById("fStatus").value;
  const deskripsi = document.getElementById("fDeskripsi").value.trim();

  // Validasi field wajib
  const checks = [
    ["fNama", "errNama", !nama],
    ["fKategori", "errKategori", !kategori],
    ["fTanggal", "errTanggal", !tanggal],
    ["fJam", "errJam", !jam],
    ["fLokasi", "errLokasi", !lokasi],
    ["fPic", "errPic", !pic],
  ];
  let valid = true;
  checks.forEach(([inputId, errId, bad]) => {
    setFieldError(inputId, errId, bad);
    if (bad) valid = false;
  });

  if (!valid) {
    showToast("Lengkapi field wajib terlebih dahulu.", "error");
    return;
  }

  if (state.editingKegiatanId != null) {
    // UPDATE
    const k = findKegiatan(state.editingKegiatanId);
    if (k) {
      Object.assign(k, { nama, kategori, tanggal, jam, lokasi, pic, status, deskripsi });
    }
    showToast("Perubahan kegiatan disimpan.");
  } else {
    // CREATE
    state.kegiatan.push({
      id: nextId++,
      nama,
      kategori,
      tanggal,
      jam,
      lokasi,
      pic,
      status,
      deskripsi,
      jumlahPeserta: 0,
    });
    showToast("Kegiatan baru ditambahkan.");
  }

  state.editingKegiatanId = null;
  renderAll();
  navigate("kegiatan");
}

/* ---------- Anggota ---------- */
function getFilteredAnggota() {
  const q = state.anggotaSearch.trim().toLowerCase();
  const jabatan = state.anggotaFilter.jabatan;

  return state.anggota.filter((a) => {
    const cocokCari =
      !q || a.nim.toLowerCase().includes(q) || a.nama.toLowerCase().includes(q);
    const cocokJabatan = !jabatan || a.jabatan === jabatan;
    return cocokCari && cocokJabatan;
  });
}

function renderAnggota() {
  const rows = getFilteredAnggota();
  const body = document.getElementById("anggotaBody");

  if (!rows.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">Tidak ada anggota ditemukan.</td></tr>`;
    return;
  }

  body.innerHTML = rows
    .map((a, i) => {
      // Anggota (read-only): kolom Aksi tanpa tombol edit/hapus
      const aksiCell = isAdmin()
        ? `<td>
              <div class="actions">
                <button type="button" class="btn btn-sm" data-act="edit-anggota" data-id="${a.id}">Edit</button>
                <button type="button" class="btn btn-sm btn-danger" data-act="hapus-anggota" data-id="${a.id}">Hapus</button>
              </div>
            </td>`
        : `<td><span class="text-secondary">—</span></td>`;

      return `
      <tr>
        <td class="col-narrow">${i + 1}</td>
        <td>${escapeHtml(a.nim)}</td>
        <td>${escapeHtml(a.nama)}</td>
        <td>${escapeHtml(a.jabatan)}</td>
        ${aksiCell}
      </tr>`;
    })
    .join("");
}

function openAnggotaModal(anggota = null) {
  state.editingAnggotaId = anggota ? anggota.id : null;

  document.getElementById("formAnggota").reset();
  setFieldError("aNim", "errNim", false);
  setFieldError("aNama", "errANama", false);
  setFieldError("aJabatan", "errAJabatan", false);

  if (anggota) {
    document.getElementById("aNim").value = anggota.nim;
    document.getElementById("aNama").value = anggota.nama;
    document.getElementById("aJabatan").value = anggota.jabatan;
  }

  document.getElementById("modalAnggota").hidden = false;
  document.getElementById("aNim").focus();
}

function closeAnggotaModal() {
  document.getElementById("modalAnggota").hidden = true;
  state.editingAnggotaId = null;
}

function saveAnggota(event) {
  event.preventDefault();

  const nim = document.getElementById("aNim").value.trim();
  const nama = document.getElementById("aNama").value.trim();
  const jabatan = document.getElementById("aJabatan").value.trim();

  const checks = [
    ["aNim", "errNim", !nim],
    ["aNama", "errANama", !nama],
    ["aJabatan", "errAJabatan", !jabatan],
  ];
  let valid = true;
  checks.forEach(([inputId, errId, bad]) => {
    setFieldError(inputId, errId, bad);
    if (bad) valid = false;
  });

  if (!valid) {
    showToast("Lengkapi field wajib terlebih dahulu.", "error");
    return;
  }

  if (state.editingAnggotaId != null) {
    const a = findAnggota(state.editingAnggotaId);
    if (a) Object.assign(a, { nim, nama, jabatan });
    showToast("Perubahan anggota disimpan.");
  } else {
    state.anggota.push({ id: nextId++, nim, nama, jabatan });
    showToast("Anggota baru ditambahkan.");
  }

  closeAnggotaModal();
  renderAll();
}

/* ---------- Peserta ---------- */
function populateKegiatanSelect() {
  const select = document.getElementById("pesertaKegiatan");
  const sorted = [...state.kegiatan].sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  select.innerHTML = sorted
    .map(
      (k) =>
        `<option value="${k.id}" ${k.id === state.selectedKegiatanId ? "selected" : ""}>${escapeHtml(k.nama)}</option>`
    )
    .join("");

  // Pastikan selectedKegiatanId masih valid
  if (!findKegiatan(state.selectedKegiatanId) && sorted.length) {
    state.selectedKegiatanId = sorted[0].id;
    select.value = String(state.selectedKegiatanId);
  }
}

function populateAnggotaPesertaSelect() {
  const select = document.getElementById("pesertaAnggota");
  const current = select.value;
  select.innerHTML =
    `<option value="">Pilih anggota</option>` +
    state.anggota
      .map((a) => `<option value="${a.id}">${escapeHtml(a.nama)} — ${escapeHtml(a.nim)}</option>`)
      .join("");
  select.value = current;
}

function renderPeserta() {
  populateKegiatanSelect();
  populateAnggotaPesertaSelect();

  // Anggota (read-only): sembunyikan baris "Tambah peserta"
  const rowTambah = document.getElementById("rowTambahPeserta");
  if (rowTambah) rowTambah.hidden = isAnggota();

  const list = state.peserta[state.selectedKegiatanId] || [];
  const body = document.getElementById("pesertaBody");

  if (!list.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="6">Belum ada peserta untuk kegiatan ini.</td></tr>`;
    return;
  }

  body.innerHTML = list
    .map((p, i) => {
      const a = findAnggota(p.anggotaId);
      if (!a) return "";

      // Kehadiran: dropdown aktif untuk admin, teks biasa untuk anggota
      const kehadiranCell = isAdmin()
        ? `<select class="input" data-act="kehadiran" data-id="${a.id}">
              <option ${p.kehadiran === "Hadir" ? "selected" : ""}>Hadir</option>
              <option ${p.kehadiran === "Belum" ? "selected" : ""}>Belum</option>
              <option ${p.kehadiran === "Tidak Hadir" ? "selected" : ""}>Tidak Hadir</option>
            </select>`
        : `<span>${escapeHtml(p.kehadiran)}</span>`;

      // Aksi: tombol Hapus hanya untuk admin
      const aksiCell = isAdmin()
        ? `<div class="actions">
              <button type="button" class="btn btn-sm btn-danger" data-act="hapus-peserta" data-id="${a.id}">Hapus</button>
            </div>`
        : `<span class="text-secondary">—</span>`;

      return `
        <tr>
          <td class="col-narrow">${i + 1}</td>
          <td>${escapeHtml(a.nim)}</td>
          <td>${escapeHtml(a.nama)}</td>
          <td>${escapeHtml(a.jabatan)}</td>
          <td>${kehadiranCell}</td>
          <td>${aksiCell}</td>
        </tr>`;
    })
    .join("");
}

function tambahPeserta() {
  const select = document.getElementById("pesertaAnggota");
  const anggotaId = Number(select.value);
  if (!anggotaId) {
    showToast("Pilih anggota terlebih dahulu.", "error");
    return;
  }

  const kid = state.selectedKegiatanId;
  if (!state.peserta[kid]) state.peserta[kid] = [];

  if (state.peserta[kid].some((p) => p.anggotaId === anggotaId)) {
    showToast("Anggota tersebut sudah menjadi peserta.", "error");
    return;
  }

  state.peserta[kid].push({ anggotaId, kehadiran: "Belum" });
  select.value = "";
  renderPeserta();
  showToast("Peserta ditambahkan.");
}

function hapusPeserta(anggotaId) {
  const kid = state.selectedKegiatanId;
  state.peserta[kid] = (state.peserta[kid] || []).filter((p) => p.anggotaId !== anggotaId);
  renderPeserta();
  showToast("Peserta dihapus.");
}

function simpanKehadiran() {
  // Sudah tersimpan langsung di state lewat event change;
  // tombol ini memberi feedback eksplisit sesuai wireframe.
  showToast("Kehadiran peserta berhasil disimpan.");
}

/* ---------- Laporan ---------- */
function hitungJumlahPeserta(kegiatanId) {
  // Di aplikasi nyata: GET /kegiatan/:id/peserta → count
  const list = state.peserta[kegiatanId];
  if (list && list.length) return list.length;
  // fallback ke nilai dummy pada data kegiatan
  const k = findKegiatan(kegiatanId);
  return k ? k.jumlahPeserta || 0 : 0;
}

function renderLaporan() {
  let rows = [...state.kegiatan];

  if (state.laporanRows) {
    const { mulai, akhir, kategori, status } = state.laporanRows;
    rows = rows.filter((k) => {
      const okPeriode =
        (!mulai || k.tanggal >= mulai) && (!akhir || k.tanggal <= akhir);
      const okKategori = !kategori || k.kategori === kategori;
      const okStatus = !status || k.status === status;
      return okPeriode && okKategori && okStatus;
    });
  }

  rows.sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  const body = document.getElementById("laporanBody");
  const foot = document.getElementById("laporanFoot");

  if (!rows.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="6">Tidak ada data untuk filter ini.</td></tr>`;
    foot.innerHTML = "";
    return;
  }

  let totalPeserta = 0;
  body.innerHTML = rows
    .map((k, i) => {
      const jml = hitungJumlahPeserta(k.id);
      totalPeserta += jml;
      return `
        <tr>
          <td class="col-narrow">${i + 1}</td>
          <td>${escapeHtml(k.nama)}</td>
          <td>${escapeHtml(k.kategori)}</td>
          <td>${escapeHtml(formatDate(k.tanggal))}</td>
          <td>${escapeHtml(k.status)}</td>
          <td>${jml}</td>
        </tr>`;
    })
    .join("");

  // Baris ringkasan — total DIHITUNG dari baris data yang tampil
  foot.innerHTML = `
    <tr>
      <td colspan="5">Total kegiatan: ${rows.length}</td>
      <td>${totalPeserta}</td>
    </tr>`;
}

/* ---------- Render semua ---------- */
function renderAll() {
  renderDashboard();
  renderKegiatan();
  renderAnggota();
  renderPeserta();
  renderLaporan();
}

/* =========================================================
   5) NAVIGASI & EVENT — perpindahan view + binding
   ========================================================= */

function navigate(view) {
  // Guard hak akses: anggota hanya boleh lihat jadwal kegiatan
  if (!canAccessView(view)) {
    showToast("Anda tidak memiliki akses ke menu tersebut.", "error");
    view = "dashboard";
  }

  // Form kegiatan hanya untuk admin (edit/tambah)
  if (view === "kegiatan-form" && !isAdmin()) {
    view = "dashboard";
  }

  state.currentView = view;

  // Sembunyikan semua view, tampilkan yang dipilih
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  const target = document.getElementById("view-" + view);
  if (target) target.classList.add("active");

  // Indikator menu aktif (form kegiatan menyorot menu Kegiatan)
  const menuKey = view === "kegiatan-form" ? "kegiatan" : view;
  document.querySelectorAll(".menu-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === menuKey);
  });

  // Render ulang view yang relevan
  if (view === "dashboard") renderDashboard();
  if (view === "kegiatan") renderKegiatan();
  if (view === "anggota") renderAnggota();
  if (view === "peserta") renderPeserta();
  if (view === "laporan") renderLaporan();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindEvents() {
  /* ----- Navigasi sidebar ----- */
  document.querySelectorAll(".menu-item").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.view));
  });

  /* ----- Pencarian global (topbar) ----- */
  document.getElementById("btnGlobalSearch").addEventListener("click", () => {
    const q = document.getElementById("globalSearch").value.trim();
    state.kegiatanSearch = q;
    state.kegiatanPage = 1;
    document.getElementById("kegiatanSearch").value = q;
    navigate("kegiatan");
  });

  document.getElementById("globalSearch").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("btnGlobalSearch").click();
  });

  /* ----- Profil ----- */
  document.getElementById("btnProfil").addEventListener("click", () => {
    if (state.auth) {
      document.getElementById("profilNama").textContent = state.auth.nama;
      document.getElementById("profilRole").textContent =
        state.auth.role === "admin" ? "Admin — dapat mengelola data" : "Anggota — hanya melihat jadwal";
      document.getElementById("profilEmail").textContent = state.auth.email;
    }
    document.getElementById("modalProfil").hidden = false;
  });
  document.getElementById("btnTutupProfil").addEventListener("click", () => {
    document.getElementById("modalProfil").hidden = true;
  });
  document.getElementById("btnLogout").addEventListener("click", logout);

  /* ----- Kegiatan: cari / filter / tambah ----- */
  document.getElementById("btnKegiatanSearch").addEventListener("click", () => {
    state.kegiatanSearch = document.getElementById("kegiatanSearch").value;
    state.kegiatanPage = 1;
    renderKegiatan();
  });
  document.getElementById("kegiatanSearch").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("btnKegiatanSearch").click();
  });

  document.getElementById("btnFilterKegiatan").addEventListener("click", () => {
    const panel = document.getElementById("filterKegiatanPanel");
    panel.hidden = !panel.hidden;
  });
  document.getElementById("filterKategori").addEventListener("change", (e) => {
    state.kegiatanFilter.kategori = e.target.value;
    state.kegiatanPage = 1;
    renderKegiatan();
  });
  document.getElementById("filterStatusKegiatan").addEventListener("change", (e) => {
    state.kegiatanFilter.status = e.target.value;
    state.kegiatanPage = 1;
    renderKegiatan();
  });
  document.getElementById("btnResetFilterKegiatan").addEventListener("click", () => {
    state.kegiatanFilter = { kategori: "", status: "" };
    document.getElementById("filterKategori").value = "";
    document.getElementById("filterStatusKegiatan").value = "";
    state.kegiatanPage = 1;
    renderKegiatan();
  });

  document.getElementById("btnTambahKegiatan").addEventListener("click", () => {
    openKegiatanForm(null);
  });

  /* ----- Pagination kegiatan (delegasi) ----- */
  document.getElementById("kegiatanPagination").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn || btn.disabled) return;
    state.kegiatanPage = Number(btn.dataset.page);
    renderKegiatan();
  });

  /* ----- Aksi tabel kegiatan (delegasi: Edit / Hapus) ----- */
  document.getElementById("kegiatanBody").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = Number(btn.dataset.id);

    if (btn.dataset.act === "edit-kegiatan") {
      const k = findKegiatan(id);
      if (k) openKegiatanForm(k);
    }
    if (btn.dataset.act === "hapus-kegiatan") {
      const k = findKegiatan(id);
      if (!k) return;
      if (confirm(`Hapus kegiatan "${k.nama}"?`)) {
        state.kegiatan = state.kegiatan.filter((x) => x.id !== id);
        delete state.peserta[id];
        renderAll();
        showToast("Kegiatan dihapus.");
      }
    }
  });

  /* ----- Form kegiatan ----- */
  document.getElementById("formKegiatan").addEventListener("submit", saveKegiatan);
  document.getElementById("btnBatalKegiatan").addEventListener("click", () => {
    state.editingKegiatanId = null;
    navigate("kegiatan");
  });

  /* ----- Anggota: cari / filter / tambah ----- */
  document.getElementById("btnAnggotaSearch").addEventListener("click", () => {
    state.anggotaSearch = document.getElementById("anggotaSearch").value;
    renderAnggota();
  });
  document.getElementById("anggotaSearch").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("btnAnggotaSearch").click();
  });

  document.getElementById("btnFilterAnggota").addEventListener("click", () => {
    const panel = document.getElementById("filterAnggotaPanel");
    panel.hidden = !panel.hidden;
  });
  document.getElementById("filterJabatan").addEventListener("change", (e) => {
    state.anggotaFilter.jabatan = e.target.value;
    renderAnggota();
  });
  document.getElementById("btnResetFilterAnggota").addEventListener("click", () => {
    state.anggotaFilter = { jabatan: "" };
    document.getElementById("filterJabatan").value = "";
    renderAnggota();
  });

  document.getElementById("btnTambahAnggota").addEventListener("click", () => {
    openAnggotaModal(null);
  });

  document.getElementById("anggotaBody").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = Number(btn.dataset.id);

    if (btn.dataset.act === "edit-anggota") {
      const a = findAnggota(id);
      if (a) openAnggotaModal(a);
    }
    if (btn.dataset.act === "hapus-anggota") {
      const a = findAnggota(id);
      if (!a) return;
      if (confirm(`Hapus anggota "${a.nama}"?`)) {
        state.anggota = state.anggota.filter((x) => x.id !== id);
        renderAll();
        showToast("Anggota dihapus.");
      }
    }
  });

  document.getElementById("formAnggota").addEventListener("submit", saveAnggota);
  document.getElementById("btnBatalAnggota").addEventListener("click", closeAnggotaModal);

  // Tutup modal saat klik area luar
  document.getElementById("modalAnggota").addEventListener("click", (e) => {
    if (e.target.id === "modalAnggota") closeAnggotaModal();
  });
  document.getElementById("modalProfil").addEventListener("click", (e) => {
    if (e.target.id === "modalProfil") e.target.hidden = true;
  });

  /* ----- Peserta ----- */
  document.getElementById("pesertaKegiatan").addEventListener("change", (e) => {
    state.selectedKegiatanId = Number(e.target.value);
    renderPeserta();
  });
  document.getElementById("btnTambahPeserta").addEventListener("click", tambahPeserta);
  document.getElementById("btnSimpanKehadiran").addEventListener("click", simpanKehadiran);

  document.getElementById("pesertaBody").addEventListener("click", (e) => {
    const btn = e.target.closest('[data-act="hapus-peserta"]');
    if (!btn) return;
    hapusPeserta(Number(btn.dataset.id));
  });

  document.getElementById("pesertaBody").addEventListener("change", (e) => {
    const sel = e.target.closest('[data-act="kehadiran"]');
    if (!sel) return;
    const anggotaId = Number(sel.dataset.id);
    const list = state.peserta[state.selectedKegiatanId] || [];
    const row = list.find((p) => p.anggotaId === anggotaId);
    if (row) row.kehadiran = sel.value;
  });

  /* ----- Laporan ----- */
  document.getElementById("btnTampilkanLaporan").addEventListener("click", () => {
    state.laporanRows = {
      mulai: document.getElementById("laporanMulai").value,
      akhir: document.getElementById("laporanAkhir").value,
      kategori: document.getElementById("laporanKategori").value,
      status: document.getElementById("laporanStatus").value,
    };
    renderLaporan();
    showToast("Rekap laporan diperbarui.");
  });

  /* =========================================================
     AUTH — login anggota / admin / daftar / tampilan
     ========================================================= */

  // Tombol "Lihat" / sembunyikan password
  document.querySelectorAll(".auth-lihat").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Lihat" : "Sembunyikan";
    });
  });

  // Pindah antar tampilan auth
  document.getElementById("btnKeAdmin").addEventListener("click", () => showAuthView("admin"));
  document.getElementById("btnKeAnggota").addEventListener("click", () => showAuthView("anggota"));
  document.getElementById("btnKeDaftar").addEventListener("click", () => showAuthView("daftar"));
  document.getElementById("btnKeLoginAnggota").addEventListener("click", () => showAuthView("anggota"));

  // Lupa password (dummy — tanpa backend)
  const lupaHandler = () =>
    showToast("Hubungi admin untuk reset password (fitur dummy).");
  document.getElementById("btnLupaPassword").addEventListener("click", lupaHandler);
  document.getElementById("btnLupaPasswordAdmin").addEventListener("click", lupaHandler);

  // Submit Login Anggota
  document.getElementById("formLoginAnggota").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginAnggotaUser").value;
    const password = document.getElementById("loginAnggotaPass").value;
    const remember = document.getElementById("loginAnggotaRemember").checked;

    if (!username.trim() || !password) {
      showAuthError("anggota", "Username/email dan password wajib diisi.");
      return;
    }

    const user = authenticate(username, password, "anggota");
    if (!user) {
      // Pesan error merah di atas tombol Masuk (sesuai wireframe)
      showAuthError("anggota", "Username atau password salah.");
      return;
    }

    hideAuthError("anggota");
    loginSuccess(user, remember, username.trim());
  });

  // Submit Login Admin
  document.getElementById("formLoginAdmin").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginAdminUser").value;
    const password = document.getElementById("loginAdminPass").value;
    const remember = document.getElementById("loginAdminRemember").checked;

    if (!username.trim() || !password) {
      showAuthError("admin", "Username/email dan password wajib diisi.");
      return;
    }

    const user = authenticate(username, password, "admin");
    if (!user) {
      showAuthError("admin", "Username atau password salah.");
      return;
    }

    hideAuthError("admin");
    loginSuccess(user, remember, username.trim());
  });

  // Submit Daftar (akun anggota baru — dummy in-memory)
  document.getElementById("formDaftar").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("daftarUsername").value.trim();
    const email = document.getElementById("daftarEmail").value.trim();
    const password = document.getElementById("daftarPass").value;

    if (!username || !email || password.length < 4) {
      showAuthError("daftar", "Lengkapi semua data (password min. 4 karakter).");
      return;
    }

    const dup = DUMMY_USERS.some(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
    );
    if (dup) {
      showAuthError("daftar", "Username atau email sudah terdaftar.");
      return;
    }

    DUMMY_USERS.push({ username, email, password, role: "anggota", nama: username });
    showToast("Pendaftaran berhasil! Silakan masuk.");
    showAuthView("anggota");
    document.getElementById("loginAnggotaUser").value = username;
  });
}

/* =========================================================
   INISIALISASI
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  renderAll();

  // Mulai dari layar login (appScreen tersembunyi di HTML)
  document.getElementById("appScreen").hidden = true;
  document.getElementById("authScreen").hidden = false;
  showAuthView("anggota");

  // Pulihkan "Ingat saya" (hanya username, bukan password)
  try {
    const remembered = localStorage.getItem("remember_user");
    const role = localStorage.getItem("remember_role");
    if (remembered) {
      if (role === "admin") {
        showAuthView("admin");
        document.getElementById("loginAdminUser").value = remembered;
        document.getElementById("loginAdminRemember").checked = true;
      } else {
        document.getElementById("loginAnggotaUser").value = remembered;
        document.getElementById("loginAnggotaRemember").checked = true;
      }
    }
  } catch (_) {
    /* abaikan bila localStorage tidak tersedia */
  }
});
