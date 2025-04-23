"use client";

import { use } from "react";
import Link from "next/link";

// Define the type for the searchParams prop (as a Promise)
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Update the function signature to accept props
export default function ErrorPage(props: { searchParams: SearchParams }) {
  // Use the 'use' hook to resolve the searchParams promise
  const searchParams = use(props.searchParams);
  const error = searchParams?.error;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Authentication Error
        </h1>

        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <p className="text-gray-800">
            {/* Ensure error is treated as string or string[] */}
            {error === "Configuration"
              ? "There is a problem with the server configuration. Please contact the administrator."
              : typeof error === "string"
                ? error
                : "An unknown error occurred during authentication."}
          </p>
        </div>

        <div className="flex justify-between">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Return Home
          </Link>

          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
