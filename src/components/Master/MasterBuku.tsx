"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableBuku from "@/components/Master/TableBuku";

const MasterBuku = () => {
  const [judul, setJudul] = useState<string>("");
  const [pengarang, setPengarang] = useState<string>("");
  const [tahunTerbit, setTahunTerbit] = useState<string>("");
  const [stok, setStok] = useState<number>(0); // Initialized with a default value 0

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id_buku = searchParams.get("id_buku");
  const token = localStorage.getItem("authToken");
  const api = `${process.env.NEXT_PUBLIC_API_BUKU_URL}`;

  useEffect(() => {
    if (id_buku) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${api}findOne/${id_buku}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Gagal mengambil data buku");
          }

          const responseBody = await response.json();
          const data = responseBody.data;

          setJudul(data.judul);
          setPengarang(data.pengarang);

          // Extract only the year from the date string (e.g., '2021-09-09T00:00:00.000Z' => '2021')
          const parsedTahunTerbit = data.tahun_terbit
            ? new Date(data.tahun_terbit).getFullYear().toString() // Extract just the year as string
            : ""; // If no date, set to empty string

          setTahunTerbit(parsedTahunTerbit); // Set the extracted year

          setStok(data.stok);
        } catch (error: any) {
          alert("Error: " + error.message);
        }
      };

      fetchData();
    }
  }, [id_buku]);

  const handleTambah = async () => {
    const data = {
      judul: judul,
      pengarang: pengarang,
      tahun_terbit: tahunTerbit,
      stok: stok,
    };

    try {
      const response = await fetch(`${api}create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Menambahkan token di header
        },
        body: JSON.stringify(data), // Mengirimkan data dalam bentuk JSON
      });

      const result = await response.json();
      alert("Buku berhasil ditambahkan!");
      window.location.reload();
      // Reset form
      setJudul("");
      setPengarang("");
      setTahunTerbit("");
      setStok(0);
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  //handleUpdate
  const handleUpdate = async () => {
    const data = {
      id_buku: id_buku,
      judul: judul,
      pengarang: pengarang,
      tahun_terbit: tahunTerbit,
      stok: stok,
    };

    try {
      const response = await fetch(`${api}update/${id_buku}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Menambahkan token di header
        },
        body: JSON.stringify(data), // Data yang akan di-update
      });
      const result = await response.json();
      alert("Buku berhasil diubah!");
      window.location.assign("/master/master-buku");
      // Reset form
      setJudul("");
      setPengarang("");
      setTahunTerbit("");
      setStok(0);
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
                <select
                  value={tahunTerbit}
                  onChange={(e) => setTahunTerbit(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                >
                  <option value="">Pilih Tahun</option>
                  {Array.from({ length: 100 }, (_, index) => {
                    const year = new Date().getFullYear() - index; // Generate years starting from the current year
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Stok
                </label>
                <input
                  type="number"
                  placeholder="Stok Buku"
                  value={stok}
                  onChange={(e) =>
                    setStok(e.target.value ? parseInt(e.target.value) : 0)
                  } // Convert to number
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>

              <button
                onClick={id_buku ? handleUpdate : handleTambah} // Kondisi untuk memilih fungsi yang akan dijalankan
                className="flex w-50 justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
              >
                {id_buku ? "Update" : "Tambah"}
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
