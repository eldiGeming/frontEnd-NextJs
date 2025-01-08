"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const TablePeminjaman = () => {
  const [peminjamanData, setPeminjamanData] = useState([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const token = localStorage.getItem("authToken");
  const api = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

  // Fetch data dari API
  useEffect(() => {
    const fetchPeminjamanData = async () => {
      try {
        const response = await fetch(`${api}peminjaman`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Gagal mengambil data peminjaman");
        }
        const data = await response.json();
        setPeminjamanData(data);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchPeminjamanData();
  }, []);

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("authToken"); // Mengambil token dari localStorage
    if (!token) {
      console.error("No token found. Redirecting to login page.");
      window.location.href = "http://localhost:3000/";
      return; // Stop further execution
    }

    try {
      // Mengirim permintaan PUT untuk memperbarui status peminjaman
      const response = await fetch(`${api}peminjaman/${id}`, {
        method: "PUT", // Metode PUT untuk memperbarui status peminjaman
        headers: {
          "Content-Type": "application/json", // Menandakan bahwa body yang dikirimkan dalam format JSON
          Authorization: `Bearer ${token}`, // Menambahkan token di header
        },
      });

      // Mengecek jika response gagal
      if (!response.ok) {
        throw new Error("Gagal memperbarui status peminjaman");
      }

      // Menangani response dari server
      const result = await response.json();
      alert(result.message); // Menampilkan pesan sukses dari backend

      // Optional: Menyegarkan halaman atau mengalihkan ke halaman lain
      window.location.reload();
    } catch (error: any) {
      // Menangani error jika terjadi masalah dalam permintaan
      alert("Error: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "-"; // Jika format tanggal tidak valid, kembalikan "-"

    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    // Menggunakan toLocaleDateString dengan format bulan 3 huruf kapital
    const formattedDate = date.toLocaleDateString("id-ID", options);

    // Mengubah bulan menjadi huruf kapital (JAN, FEB, MAR, ...)
    return formattedDate.replace(/([A-Za-z]{3})/, (match) =>
      match.toUpperCase(),
    );
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Data Peminjaman
      </h4>

      <div className="flex flex-col">
        {/* Header tabel */}
        <div className="grid grid-cols-6 sm:grid-cols-6">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">No</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Peminjam
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Judul Buku
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Tanggal Pinjam
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Tanggal Kembali
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Aksi
            </h5>
          </div>
        </div>

        {/* Data tabel */}
        {peminjamanData.map((peminjaman: any, index) => (
          <div
            className={`grid grid-cols-6 sm:grid-cols-6 ${index === peminjaman.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"}`}
            key={peminjaman.id}
          >
            <div className="flex items-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {index + 1}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {peminjaman.mahasiswa.nama}
              </p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {peminjaman.buku.judul}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {formatDate(peminjaman.tgl_pinjam)}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {peminjaman.tgl_kembali === "0000-00-00"
                  ? "-"
                  : formatDate(peminjaman.tgl_kembali)}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 px-2 py-4">
              {peminjaman.status === "Dikembalikan" ? (
                <span className="text-gray-500">SUDAH DIKEMBALIKAN</span> // Teks jika status "Dikembalikan"
              ) : (
                <button
                  className="hover:text-primary"
                  onClick={() => handleUpdate(peminjaman.id)} // Panggil handleUpdate jika status bukan "Dikembalikan"
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.99935 6.87492C8.27346 6.87492 6.87435 8.27403 6.87435 9.99992C6.87435 11.7258 8.27346 13.1249 9.99935 13.1249C11.7252 13.1249 13.1243 11.7258 13.1243 9.99992C13.1243 8.27403 11.7252 6.87492 9.99935 6.87492ZM8.12435 9.99992C8.12435 8.96438 8.96382 8.12492 9.99935 8.12492C11.0349 8.12492 11.8743 8.96438 11.8743 9.99992C11.8743 11.0355 11.0349 11.8749 9.99935 11.8749C8.96382 11.8749 8.12435 11.0355 8.12435 9.99992Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.99935 2.70825C6.23757 2.70825 3.70376 4.96175 2.23315 6.8723L2.20663 6.90675C1.87405 7.3387 1.56773 7.73652 1.35992 8.20692C1.13739 8.71064 1.04102 9.25966 1.04102 9.99992C1.04102 10.7402 1.13739 11.2892 1.35992 11.7929C1.56773 12.2633 1.87405 12.6611 2.20664 13.0931L2.23316 13.1275C3.70376 15.0381 6.23757 17.2916 9.99935 17.2916C13.7611 17.2916 16.2949 15.0381 17.7655 13.1275L17.792 13.0931C18.1246 12.6612 18.431 12.2633 18.6388 11.7929C18.8613 11.2892 18.9577 10.7402 18.9577 9.99992C18.9577 9.25966 18.8613 8.71064 18.6388 8.20692C18.431 7.73651 18.1246 7.33868 17.792 6.90673L17.7655 6.8723C16.2949 4.96175 13.7611 2.70825 9.99935 2.70825ZM3.2237 7.63475C4.58155 5.87068 6.79132 3.95825 9.99935 3.95825C13.2074 3.95825 15.4172 5.87068 16.775 7.63475C17.1405 8.10958 17.3546 8.3933 17.4954 8.71204C17.627 9.00993 17.7077 9.37403 17.7077 9.99992C17.7077 10.6258 17.627 10.9899 17.4954 11.2878C17.3546 11.6065 17.1405 11.8903 16.775 12.3651C15.4172 14.1292 13.2074 16.0416 9.99935 16.0416C6.79132 16.0416 4.58155 14.1292 3.2237 12.3651C2.8582 11.8903 2.64412 11.6065 2.50333 11.2878C2.37173 10.9899 2.29102 10.6258 2.29102 9.99992C2.29102 9.37403 2.37173 9.00993 2.50333 8.71204C2.64412 8.3933 2.8582 8.10958 3.2237 7.63475Z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablePeminjaman;
