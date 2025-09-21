"use client";
import { useUserData } from "@/hooks/useUserData";
import { signOut } from "next-auth/react";

export const DisplayUserInfo = () => {
  const { userName } = useUserData();
  return (
    <>
      <button
        className="btn btn-outline-primary dropdown-toggle"
        type="button"
        id="userDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-person"></i> {userName}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="userDropdown"
      >
        {/* <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-person-circle"></i> Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-gear"></i> Settings
              </a>
            </li> 
            <li>
              <hr className="dropdown-divider" />
            </li>*/}
        <li>
          <a className="dropdown-item" href="#" onClick={() => signOut()}>
            <i className="bi bi-box-arrow-right"></i> Sign Out
          </a>
        </li>
      </ul>
    </>
  );
};
