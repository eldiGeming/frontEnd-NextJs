"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const MasterUser = () => {
  const [namaUser, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const api = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

  const handleTambah = async () => {
    if (!namaUser || !username || !password) {
      alert("Semua field harus diisi!");
      return;
    }

    const data = {
      nama: namaUser,
      username: username,
      password: password,
    };

    try {
      const response = await fetch(`${api}user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan User");
      }

      const result = await response.json();
      alert("User berhasil ditambahkan!");
        window.location.href = "/auth/signin";
      // Reset form
      setNama("");
      setUsername("");
      setPassword("");
    } catch (error:any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Master User" />

      <div className="mx-auto mt-6 max-w-4xl px-4">
        {/* Card container */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Tambah Data User
            </h3>
          </div>

          <div className="space-y-6">
            {/* Nama Lengkap Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={namaUser}
                onChange={(e) => setNama(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Username Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleTambah}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MasterUser;
