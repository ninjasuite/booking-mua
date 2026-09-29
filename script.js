// Ganti dengan URL Google Apps Script dari Langkah 2
const API_URL = "https://script.google.com/macros/s/AKfycbyp3pLdEGZILTvsE2AQBVuuKlTR3w1Q_dzr7tVtvuJNZmlJNm5E-2hO6VJ5lKCOXbZ7/exec"; 

// Ganti dengan nomor WA pacar (format internasional tanpa tanda + atau 0 depan)
const GF_WA_NUMBER = "62895401035264"; 

// Daftar slot jam operasional harian
const ALL_SLOTS = ["08:00", "10:00", "13:00", "15:00", "18:00"];

const serviceSelect = document.getElementById("serviceSelect");
const bookingDate = document.getElementById("bookingDate");
const timeSlot = document.getElementById("timeSlot");
const bookingForm = document.getElementById("bookingForm");
const submitBtn = document.getElementById("submitBtn");

// Batasi tanggal minimal hari ini
bookingDate.min = new Date().toISOString().split("T")[0];

// Load Layanan saat halaman dibuka
async function fetchServices() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    serviceSelect.innerHTML = '<option value="">-- Pilih Layanan --</option>';
    data.services.forEach(s => {
      const option = document.createElement("option");
      option.value = s.name;
      option.textContent = `${s.name} - Rp ${Number(s.price).toLocaleString("id-ID")}`;
      serviceSelect.appendChild(option);
    });
  } catch (err) {
    alert("Gagal memuat daftar layanan.");
  }
}
fetchServices();

// Cek Slot Jam yang Tersedia berdasarkan Tanggal
bookingDate.addEventListener("change", async () => {
  const selectedDate = bookingDate.value;
  if (!selectedDate) return;

  timeSlot.disabled = true;
  timeSlot.innerHTML = '<option value="">Mengecek ketersediaan jam...</option>';

  try {
    const res = await fetch(`${API_URL}?action=getBookedSlots&date=${selectedDate}`);
    const data = await res.json();
    const bookedSlots = data.bookedSlots || [];

    timeSlot.innerHTML = '<option value="">-- Pilih Jam --</option>';
    
    ALL_SLOTS.forEach(slot => {
      const isBooked = bookedSlots.includes(slot);
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = isBooked ? `${slot} (Sudah Dibooking)` : slot;
      option.disabled = isBooked; // Disable slot jika sudah dipesan
      timeSlot.appendChild(option);
    });

    timeSlot.disabled = false;
  } catch (err) {
    alert("Gagal mengecek ketersediaan jam.");
  }
});

// Handle Submit Booking
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Memproses Booking...";

  const payload = {
    clientName: document.getElementById("clientName").value,
    clientPhone: document.getElementById("clientPhone").value,
    serviceName: serviceSelect.value,
    date: bookingDate.value,
    timeSlot: timeSlot.value
  };

  try {
    // 1. Simpan ke Google Sheets via Google Apps Script
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    // 2. Buat Pesan WhatsApp
    const message = `Halo! Saya ingin konfirmasi booking makeup:\n\n` +
      `*Nama:* ${payload.clientName}\n` +
      `*No. WA:* ${payload.clientPhone}\n` +
      `*Layanan:* ${payload.serviceName}\n` +
      `*Tanggal:* ${payload.date}\n` +
      `*Jam:* ${payload.timeSlot}\n\n` +
      `Saya akan segera mengirimkan bukti transfer pembayaran. Terima kasih!`;

    const waUrl = `https://wa.me/${GF_WA_NUMBER}?text=${encodeURIComponent(message)}`;

    // 3. Redirect ke WhatsApp
    window.location.href = waUrl;

  } catch (err) {
    alert("Terjadi kesalahan saat menyimpan booking.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Konfirmasi & Kirim Bukti via WhatsApp";
  }
});
