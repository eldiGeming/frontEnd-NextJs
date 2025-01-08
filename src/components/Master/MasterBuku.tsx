"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableBuku from "@/components/Master/TableBuku";

const MasterBuku = () => {
  const [judul, setJudul] = useState("");
  const [pengarang, setPengarang] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [stok, setStok] = useState("");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = localStorage.getItem("authToken");
  const api = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // Pastikan token ada sebelum melanjutkan request
          if (!token) {
            throw new Error("Token tidak ditemukan. Silakan login kembali.");
          }

          const response = await fetch(`${api}buku/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Menambahkan token di header
            },
          });

          if (!response.ok) {
            throw new Error("Gagal mengambil data buku");
          }

          const data = await response.json();
          setJudul(data.judul);
          setPengarang(data.pengarang);
          setTahunTerbit(data.tahun_terbit);
          setStok(data.stok);
        } catch (error:any) {
          alert("Error: " + error.message);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleTambah = async () => {
    if (!judul || !pengarang || !tahunTerbit || !stok) {
      alert("Semua field harus diisi!");
      return;
    }

    const data = {
      judul: judul,
      pengarang: pengarang,
      tahun_terbit: tahunTerbit,
      stok: stok,
    };

    try {
      // Pastikan token ada sebelum melanjutkan request
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      const response = await fetch(`${api}buku`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Menambahkan token di header
        },
        body: JSON.stringify(data), // Mengirimkan data dalam bentuk JSON
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan buku");
      }

      const result = await response.json();
      alert("Buku berhasil ditambahkan!");
      window.location.reload();
      // Reset form
      setJudul("");
      setPengarang("");
      setTahunTerbit("");
      setStok("");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleUpdate = async () => {
    if (!judul || !pengarang || !tahunTerbit || !stok) {
      alert("Semua field harus diisi!");
      return;
    }

    const data = {
      id: id,
      judul: judul,
      pengarang: pengarang,
      tahun_terbit: tahunTerbit,
      stok: stok,
    };

    try {
      // Pastikan token ada sebelum melanjutkan request
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      const response = await fetch(`${api}buku/${id}`, {
        method: "PUT", // Menggunakan PUT untuk update data
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Menambahkan token di header
        },
        body: JSON.stringify(data), // Data yang akan di-update
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui buku");
      }

      const result = await response.json();
      alert("Buku berhasil diubah!");
      window.location.assign("/master/master-buku");
      // Reset form
      setJudul("");
      setPengarang("");
      setTahunTerbit("");
      setStok("");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Master Buku" />

      <div className="sm:grid-cols grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <TableBuku />
          {/* <!-- Input Fields --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Data Buku
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Judul Buku
                </label>
                <input
                  type="text"
                  placeholder="Judul Buku"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Nama Pengarang
                </label>
                <input
                  type="text"
                  placeholder="Nama Pengarang"
                  value={pengarang}
                  onChange={(e) => setPengarang(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Tahun Terbit
                </label>
                <input
                  type="text"
                  placeholder="Quantity"
                  value={tahunTerbit}
                  onChange={(e) => setTahunTerbit(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Alamat
                </label>
                <input
                  type="text"
                  placeholder="Alamat Mahasiswa"
                  value={stok}
                  onChange={(e) => setStok(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>

              <button
                onClick={id ? handleUpdate : handleTambah} // Kondisi untuk memilih fungsi yang akan dijalankan
                className="flex w-50 justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
              >
                {id ? "Update" : "Tambah"}{" "}
                {/* Label tombol berdasarkan ada tidaknya id */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MasterBuku;
