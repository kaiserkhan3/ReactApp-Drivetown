"use client";
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export const DisplayUserInfo = () => {
  const { userName } = useUserData();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const signOut = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("user");
    }
    router.push("/"); // Redirect to login page after sign out
  };

  // Render nothing on server and before mount to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <>
      {userName && (
        <button
          className="btn btn-outline-primary dropdown-toggle"
          type="button"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-person"></i> {userName}
        </button>
      )}

      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="userDropdown"
      >
        <li>
          <a className="dropdown-item" href="#" onClick={() => signOut()}>
            <i className="bi bi-box-arrow-right"></i> Sign Out
          </a>
        </li>
      </ul>
    </>
  );
};
