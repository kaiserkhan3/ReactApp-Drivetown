"use client";
import React, { useEffect, useState } from "react";
import { getAllNotifications } from "@/actions/notification-action";

function exportToCSV(data: any[], columns: string[], filename: string) {
  const csvRows = [columns.join(",")];
  data.forEach((row) => {
    const values = columns.map((col) => `"${row[col] ?? ""}"`);
    csvRows.push(values.join(","));
  });
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

const columns = ["action", "category", "updatedDate"];

function AllRecentActivities() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getAllNotifications();
      setNotifications(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            background: "#f5f5f5",
            cursor: "pointer",
          }}
          onClick={() =>
            exportToCSV(notifications, columns, "notifications.csv")
          }
        >
          Export to CSV
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            {/* Download SVG icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </span>
        </button>
      </div>
      <table className="table table-bordered table-striped table-hover">
        <thead className="table-dark">
          <tr>
            {columns.map((col) => (
              <th key={col} scope="col">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length}>Loading...</td>
            </tr>
          ) : notifications.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>No data found</td>
            </tr>
          ) : (
            notifications.map((item, idx) => (
              <tr key={idx}>
                <td>{item.action}</td>
                <td>{item.category}</td>
                <td>{item.updatedDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AllRecentActivities;
