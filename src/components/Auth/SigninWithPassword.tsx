"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const api = `${process.env.NEXT_PUBLIC_API_USERS_URL}`;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { username, password } = e.target.elements;

    try {
      const response = await fetch(`${api}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });
      const data = await response.json();

      // Save token to localStorage
      if (data.data.token) {
        localStorage.setItem("authToken", data.data.token);
      }

      // Redirect to /master/master-buku
      window.location.href = "/dashboard";
    } catch (error) {
      alert("Username/Password salah");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your username"
            name="username" // Fixed the name to 'username'
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="password"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="password"
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary py-3 text-white"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
