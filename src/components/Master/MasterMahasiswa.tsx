"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableMahasiswa from "@/components/Master/TableMahasiswa";

const MasterMahasiswa = () => {
  const [nimMhs, setNimMhs] = useState<string>("");
  const [namaMhs, setNamaMhs] = useState<string>("");
  const [kelasMhs, setKelasMhs] = useState<string>("");
  const [alamatMhs, setAlamatMhs] = useState<string>("");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("nim");
  const token = localStorage.getItem("authToken");
  const api = `${process.env.NEXT_PUBLIC_API_MAHASISWA_URL}`;

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // Lakukan pemanggilan API dengan header Authorization
          const response = await fetch(`${api}findOne/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 401) {
            // If the response is 401, redirect to the login page
            window.location.href = "/";
            return; // Exit the function early
          }
          const responseBody = await response.json();
          const data = responseBody.data;
          console.log(data);
          setNimMhs(data.nim);
          setNamaMhs(data.nama);
          setKelasMhs(data.kelas);
          setAlamatMhs(data.alamat);
        } catch (error: any) {
          alert("Error: " + error.message);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleTambah = async () => {
    const data = {
      nim: nimMhs,
      nama: namaMhs,
      kelas: kelasMhs,
      alamat: alamatMhs,
    };

    try {
      const response = await fetch(`${api}create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Menambahkan token di header
        },
        body: JSON.stringify(data),
      });
      if (response.status === 401) {
        // If the response is 401, redirect to the login page
        window.location.href = "/";
        return; // Exit the function early
      }
      const result = await response.json();
      alert("Mahasiswa berhasil ditambahkan!");
      window.location.reload();

      // Reset form
      setNimMhs("");
      setNamaMhs("");
      setKelasMhs("");
      setAlamatMhs("");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleUpdate = async () => {
    const data = {
      nim: nimMhs,
      nama: namaMhs,
      kelas: kelasMhs,
      alamat: alamatMhs,
    };

    try {
      const response = await fetch(`${api}update/${id}`, {
        method: "PATCH", // Menggunakan PUT untuk update data
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Menambahkan token di header
        },
        body: JSON.stringify(data),
      });
      if (response.status === 401) {
        // If the response is 401, redirect to the login page
        window.location.href = "/";
        return; // Exit the function early
      }
      const result = await response.json();
      alert("Mahasiswa berhasil diubah!");
      window.location.assign("/master/master-mahasiswa");

      // Reset form
      setNimMhs("");
      setNamaMhs("");
      setKelasMhs("");
      setAlamatMhs("");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Master Mahasiswa" />

      <div className="sm:grid-cols grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <TableMahasiswa />
          {/* <!-- Input Fields --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Data Mahasiswa
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Nomor Induk Mahasiswa
                </label>
                <input
                  type="text"
                  placeholder="Nomor Induk Mahasiswa"
                  value={nimMhs}
                  onChange={(e) => setNimMhs(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Nama Mahasiswa
                </label>
                <input
                  type="text"
                  placeholder="Nama Mahasiswa"
                  value={namaMhs}
                  onChange={(e) => setNamaMhs(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Kelas
                </label>
                <input
                  type="text"
                  placeholder="Kelas"
                  value={kelasMhs}
                  onChange={(e) => setKelasMhs(e.target.value)}
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
                  value={alamatMhs}
                  onChange={(e) => setAlamatMhs(e.target.value)}
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

export default MasterMahasiswa;
