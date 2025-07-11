import axios from "axios";
import { useEffect, useState } from "react";
import { API_URLS } from "../config";
import AuditCard from "../components/AuditCard";

export interface auditInterface {
  id: number;
  action: string;
  perfomedBy: string;
  target: string;
  ipAddress: string;
  createdAt: string;
  user: {
    username: string;
    role: string;
  };
}

const AuditLog = () => {
  const [allAudit, setAllAudit] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(API_URLS.GET_AUDITS(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setAllAudit(response.data.audits);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 mt-30 sm:px-6 lg:px-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
          Recent Activities
        </h1>

        {allAudit.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            No recent activities
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {allAudit.map((audit: auditInterface) => (
              <AuditCard key={audit.id} audit={audit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
