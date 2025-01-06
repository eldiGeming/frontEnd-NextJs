"use client";
import Link from "next/link";
import React from "react";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Sign In
        </h1>

        <SigninWithPassword />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <Link href="master/master-user" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
