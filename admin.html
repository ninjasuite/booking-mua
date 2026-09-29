// ==========================================
// KONFIGURASI UTAMA
// ==========================================
// Ganti dengan URL Web App Google Apps Script milik Anda (akhiran /exec)
const API_URL = "https://script.google.com/macros/s/AKfycbztxrQeDFxxF9sIjfpDJtKGP7r1UptloZ8OHvOjixVDyvln0BLE2XXFxAkX4Fw4IqU8/exec";

// ==========================================
// ELEMEN DOM & STATE
// ==========================================
const filterDateInput = document.getElementById("filterDate") || document.getElementById("bookingDate");
const bookingListContainer = document.getElementById("bookingList") || document.getElementById("bookingContainer");

let allBookings = [];

// Set default tanggal filter ke hari ini saat pertama kali dimuat
const today = new Date().toISOString().split("T")[0];
if (filterDateInput && !filterDateInput.value) {
  filterDateInput.value = today;
}

// ==========================================
// 1. FUNGSI AMBIL DATA DARI GOOGLE SHEETS
// ==========================================
async function fetchAdminBookings() {
  if (!bookingListContainer) return;
  
  bookingListContainer.innerHTML = `
    <div class="text-center py-8 text-gray-500">
      <p class="animate-pulse">Memuat data booking...</p>
    </div>
  `;

  try {
    const response = await fetch(`${API_URL}?action=getAdminBookings`);
    const result = await response.json();

    if (result.bookings && Array.isArray(result.bookings)) {
      allBookings = result.bookings;
      renderBookings(filterDateInput ? filterDateInput.value : today);
    } else {
      bookingListContainer.innerHTML = `
        <p class="text-center text-red-500 py-4">Gagal memproses data dari server.</p>
      `;
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    bookingListContainer.innerHTML = `
      <p class="text-center text-red-500 py-4">Gagal terhubung ke database. Cek koneksi atau URL API.</p>
    `;
  }
}

// ==========================================
// 2. FUNGSI RENDER LIST BOOKING
// ==========================================
function renderBookings(selectedDate) {
  if (!bookingListContainer) return;

  const formattedSelectedDate = normalizeDate(selectedDate);

  // Filter booking berdasarkan tanggal yang dipilih
  const filtered = allBookings.filter(item => {
    return normalizeDate(item.date) === formattedSelectedDate;
  });

  // Jika tidak ada booking pada tanggal tersebut
  if (filtered.length === 0) {
    bookingListContainer.innerHTML = `
      <div class="text-center py-8 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p class="text-lg">Tidak ada booking pada tanggal <span class="font-semibold text-gray-700">${formattedSelectedDate}</span></p>
      </div>
    `;
    return;
  }

  // Render kartu/baris untuk setiap booking
  let html = `<div class="space-y-4">`;

  filtered.forEach(booking => {
    const statusColor = getStatusBadgeColor(booking.status);

    html += `
      <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-md">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-800 text-lg">${escapeHtml(booking.clientName)}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColor}">
              ${escapeHtml(booking.status)}
            </span>
          </div>
          <p class="text-sm text-gray-600">💄 <span class="font-medium">${escapeHtml(booking.serviceName)}</span></p>
          <p class="text-sm text-gray-500">⏰ Jam: <span class="font-semibold text-pink-600">${escapeHtml(booking.timeSlot)}</span></p>
          <p class="text-xs text-gray-400">📱 WA: 
            <a href="https://wa.me/${cleanPhoneNumber(booking.clientPhone)}" target="_blank" class="text-blue-500 hover:underline">
              ${escapeHtml(booking.clientPhone)}
            </a>
          </p>
          <p class="text-xs text-gray-300">ID: ${escapeHtml(booking.bookingId)}</p>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <select 
            onchange="changeStatus('${booking.bookingId}', this.value)"
            class="w-full md:w-auto text-sm border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="Pending Payment" ${booking.status === 'Pending Payment' ? 'selected' : ''}>Pending Payment</option>
            <option value="Confirmed" ${booking.status === 'Confirmed' ? 'selected' : ''}>Confirmed / DP Lunas</option>
            <option value="Completed" ${booking.status === 'Completed' ? 'selected' : ''}>Completed / Selesai</option>
            <option value="Cancelled" ${booking.status === 'Cancelled' ? 'selected' : ''}>Cancelled / Batal</option>
          </select>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  bookingListContainer.innerHTML = html;
}

// ==========================================
// 3. FUNGSI UPDATE STATUS BOOKING
// ==========================================
async function changeStatus(bookingId, newStatus) {
  if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi "${newStatus}"?`)) {
    fetchAdminBookings(); // Reset tampilan ke status semula jika dibatalkan
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "updateStatus",
        bookingId: bookingId,
        newStatus: newStatus
      })
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Status berhasil diperbarui!");
      // Update data di memori lokal dan render ulang
      const booking = allBookings.find(b => b.bookingId === bookingId);
      if (booking) booking.status = newStatus;
      renderBookings(filterDateInput ? filterDateInput.value : today);
    } else {
      alert("Gagal memperbarui status: " + (result.message || "Error server"));
      fetchAdminBookings();
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Terjadi kesalahan jaringan saat memperbarui status.");
    fetchAdminBookings();
  }
}

// ==========================================
// HELPER / UTILITIES
// ==========================================
function normalizeDate(dateStr) {
  if (!dateStr) return "";
  let str = String(dateStr).trim();
  if (str.includes("T")) str = str.split("T")[0];

  if (str.includes("/")) {
    const parts = str.split("/");
    if (parts.length === 3) {
      let m = parts[0].padStart(2, "0");
      let d = parts[1].padStart(2, "0");
      let y = parts[2];
      if (parts[0].length === 4) {
        y = parts[0];
        m = parts[1].padStart(2, "0");
        d = parts[2].padStart(2, "0");
      }
      return `${y}-${m}-${d}`;
    }
  }
  return str;
}

function getStatusBadgeColor(status) {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800 border border-green-200";
    case "Completed":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "Cancelled":
    case "Dibatalkan":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  }
}

function cleanPhoneNumber(phone) {
  if (!phone) return "";
  let cleaned = String(phone).replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return cleaned;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// EVENT LISTENERS
// ==========================================
if (filterDateInput) {
  filterDateInput.addEventListener("change", (e) => {
    renderBookings(e.target.value);
  });
}

// Jalankan pengambilan data saat halaman dibuka
document.addEventListener("DOMContentLoaded", fetchAdminBookings);
