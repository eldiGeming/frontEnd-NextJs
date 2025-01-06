"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TablePeminjaman from "@/components/Master/TablePeminjaman";

const TransaksiPeminjaman = () => {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [bukuList, setBukuList] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState("");
  const [selectedBuku, setSelectedBuku] = useState("");
  const [tglPinjam, setTglPinjam] = useState("");
  const [tglKembali, setTglKembali] = useState("");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = localStorage.getItem("authToken");

  // Fetch data mahasiswa
  useEffect(() => {
    const fetchMahasiswaData = async () => {
      try {
        const response = await fetch("http://localhost:4000/mahasiswa", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.error("Unauthorized: Redirecting to homepage.");
          window.location.href = "http://localhost:3000/";
          return; // Stop further execution
        }

        if (!response.ok) {
          throw new Error("Gagal mengambil data mahasiswa");
        }

        const data = await response.json();
        setMahasiswaList(data);
        console.log("Token:", token);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchMahasiswaData();
  }, []);

  // Fetch data buku
  useEffect(() => {
    const fetchBukuData = async () => {
      try {
        const response = await fetch("http://localhost:4000/buku", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.error("Unauthorized: Redirecting to homepage.");
          window.location.href = "http://localhost:3000/";
          return; // Stop further execution
        }
        if (!response.ok) {
          throw new Error("Gagal mengambil data buku");
        }
        const data = await response.json();
        setBukuList(data);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchBukuData();
  }, []);

  // Handle pemilihan mahasiswa
  const handleSelectMahasiswa = (e) => {
    const selectedIdMhs = e.target.value; // Ini adalah mahasiswa.id
    console.log(selectedIdMhs); // Pastikan ini mencetak id yang benar
    setSelectedMahasiswa(selectedIdMhs);
  };

  // Handle pemilihan buku
  const handleSelectBuku = (e) => {
    const selectedIdBuku = e.target.value; // Ini adalah mahasiswa.id
    console.log(selectedIdBuku); // Pastikan ini mencetak id yang benar
    setSelectedBuku(selectedIdBuku);
  };

  const handleTambah = async () => {
    // Validasi input
    if (!selectedMahasiswa || !selectedBuku || !tglPinjam) {
      const missingFields = [];
      if (!selectedMahasiswa) missingFields.push("NIM Mahasiswa");
      if (!selectedBuku) missingFields.push("ID Buku");
      if (!tglPinjam) missingFields.push("Tanggal Pinjam");

      alert(
        `Semua field harus diisi! Field yang belum diisi:\n- ${missingFields.join("\n- ")}`,
      );
      return;
    }

    const data = {
      nim: selectedMahasiswa,
      id_buku: selectedBuku,
      tgl_pinjam: tglPinjam,
    };

    try {
      // Menghindari masalah referensi dengan structuredClone
      const safeData = structuredClone(data);
      const response = await fetch("http://localhost:4000/peminjaman", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Menambahkan token ke header
        },
        body: JSON.stringify(safeData),
      });

      // Cek apakah respons sukses
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error ||
          errorData.message ||
          "Gagal menambahkan peminjaman";
        throw new Error(errorMessage);
      }

      // Proses setelah data berhasil dikirim
      const result = await response.json();
      alert("Peminjaman berhasil ditambahkan!");

      // Reload halaman untuk memperbarui data
      window.location.reload();

      // Reset form
      setSelectedMahasiswa("");
      setSelectedBuku("");
      setTglPinjam("");
      setTglKembali("");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Master Peminjaman" />

      <div className="sm:grid-cols grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <TablePeminjaman />
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Data Peminjaman
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Nama Peminjam
                </label>
                <select
                  value={selectedMahasiswa}
                  onChange={handleSelectMahasiswa}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                >
                  <option value="">-- Pilih Mahasiswa --</option>
                  {mahasiswaList.map((mahasiswa) => (
                    <option key={mahasiswa.id} value={`${mahasiswa.nim}`}>
                      {mahasiswa.nim} - {mahasiswa.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Buku yang Dipinjam
                </label>
                <select
                  value={selectedBuku}
                  onChange={handleSelectBuku}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                >
                  <option value="">-- Pilih Buku --</option>
                  {bukuList.map((buku) => (
                    <option key={buku.id_buku} value={`${buku.id_buku}`}>
                      {buku.judul}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Tanggal Pinjam
                </label>
                <input
                  type="date"
                  placeholder="Tanggal Pinjam"
                  value={tglPinjam}
                  onChange={(e) => setTglPinjam(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>

              <button
                onClick={handleTambah}
                className="flex w-50 justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
              >
                {"Pinjam"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransaksiPeminjaman;
