// ==========================================
// KONFIGURASI UTAMA
// ==========================================
// Ganti dengan URL Google Apps Script milik Anda (akhiran /exec)
const API_URL = "https://script.google.com/macros/s/AKfycbyp3pLdEGZILTvsE2AQBVuuKlTR3w1Q_dzr7tVtvuJNZmlJNm5E-2hO6VJ5lKCOXbZ7/exec"; 

// Ganti dengan nomor WhatsApp pacar Anda (format 62... tanpa tanda + atau 0)
const GF_WA_NUMBER = "6281234567890"; 

// Daftar pilihan jam operasional harian yang tersedia
const ALL_SLOTS = ["08:00", "10:00", "13:00", "15:00", "18:00"];

// ==========================================
// INISIALISASI ELEMEN DOM
// ==========================================
const serviceSelect = document.getElementById("serviceSelect");
const bookingDate = document.getElementById("bookingDate");
const timeSlot = document.getElementById("timeSlot");
const bookingForm = document.getElementById("bookingForm");
const submitBtn = document.getElementById("submitBtn");

// Batasi tanggal minimal agar tidak bisa memilih tanggal yang sudah lewat
const today = new Date().toISOString().split("T")[0];
bookingDate.min = today;

// ==========================================
// 1. MEMUAT DAFTAR LAYANAN DARI DATABASE
// ==========================================
async function fetchServices() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    serviceSelect.innerHTML = '<option value="">-- Pilih Layanan --</option>';
    if (data.services && data.services.length > 0) {
      data.services.forEach(s => {
        const option = document.createElement("option");
        option.value = s.name;
        option.textContent = `${s.name} - Rp ${Number(s.price).toLocaleString("id-ID")}`;
        serviceSelect.appendChild(option);
      });
    } else {
      serviceSelect.innerHTML = '<option value="">-- Tidak Ada Layanan --</option>';
    }
  } catch (err) {
    console.error("Error fetching services:", err);
    alert("Gagal memuat daftar layanan. Pastikan koneksi internet lancar dan API URL benar.");
  }
}

// Panggil fungsi saat halaman pertama kali dibuka
fetchServices();

// ==========================================
// 2. CEK KETERSEDIAAN SLOT JAM (DOUBLE BOOKING GUARD)
// ==========================================
bookingDate.addEventListener("change", async () => {
  const selectedDate = bookingDate.value;
  if (!selectedDate) return;

  timeSlot.disabled = true;
  timeSlot.innerHTML = '<option value="">Mengecek ketersediaan jam...</option>';

  try {
    // Ambil slot jam yang sudah terisi dari database Google Sheets
    const res = await fetch(`${API_URL}?action=getBookedSlots&date=${selectedDate}`);
    const data = await res.json();
    const bookedSlots = data.bookedSlots || [];

    timeSlot.innerHTML = '<option value="">-- Pilih Jam --</option>';
    
    // Buat opsi jam & disable jam yang sudah dibooking
    ALL_SLOTS.forEach(slot => {
      const isBooked = bookedSlots.includes(slot);
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = isBooked ? `${slot} (Sudah Dibooking)` : slot;
      option.disabled = isBooked;
      timeSlot.appendChild(option);
    });

    timeSlot.disabled = false;
  } catch (err) {
    console.error("Error fetching slots:", err);
    alert("Gagal mengecek ketersediaan jam.");
    timeSlot.innerHTML = '<option value="">Gagal memuat jam</option>';
  }
});

// ==========================================
// 3. PROSES SUBMIT BOOKING & WHATSAPP REDIRECT
// ==========================================
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Disable tombol agar user tidak menekan berkali-kali
  submitBtn.disabled = true;
  submitBtn.textContent = "Memproses Booking...";

  const payload = {
    clientName: document.getElementById("clientName").value.trim(),
    clientPhone: document.getElementById("clientPhone").value.trim(),
    serviceName: serviceSelect.value,
    date: bookingDate.value,
    timeSlot: timeSlot.value
  };

  try {
    // 1. Kirim data booking ke Google Apps Script
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const responseData = await res.json();

    // 2. Cek jika terjadi bentrok jam (Double Booking Server-Side)
    if (responseData.status === "already_booked") {
      alert(responseData.message);
      submitBtn.disabled = false;
      submitBtn.textContent = "Konfirmasi & Kirim Bukti via WhatsApp";
      
      // Refresh ketersediaan jam untuk tanggal tersebut
      bookingDate.dispatchEvent(new Event('change'));
      return;
    }

    // 3. Cek jika terjadi error sistem lain dari backend
    if (responseData.status === "error") {
      alert("Terjadi kesalahan: " + responseData.message);
      submitBtn.disabled = false;
      submitBtn.textContent = "Konfirmasi & Kirim Bukti via WhatsApp";
      return;
    }

    // 4. Jika booking berhasil disimpan, arahkan ke WhatsApp
    const message = `Halo! Saya ingin konfirmasi booking makeup:\n\n` +
      `*Nama:* ${payload.clientName}\n` +
      `*No. WA:* ${payload.clientPhone}\n` +
      `*Layanan:* ${payload.serviceName}\n` +
      `*Tanggal:* ${payload.date}\n` +
      `*Jam:* ${payload.timeSlot}\n\n` +
      `Saya akan segera mengirimkan bukti transfer pembayaran. Terima kasih!`;

    const waUrl = `https://wa.me/${GF_WA_NUMBER}?text=${encodeURIComponent(message)}`;

    // Redirect pelanggan langsung ke WhatsApp
    window.location.href = waUrl;

  } catch (err) {
    console.error("Error submitting booking:", err);
    alert("Terjadi kesalahan koneksi saat menyimpan booking. Silakan coba lagi.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Konfirmasi & Kirim Bukti via WhatsApp";
  }
});
