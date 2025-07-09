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
        console.log(response.data);
        setAllAudit(response.data.audits);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 sm:w-100 lg:w-250 md:w-200 px-4 md:px-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Recent Activities
      </h1>

      {allAudit.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No recent activities
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6 max-w-4xl mx-auto">
          {allAudit.map((audit: auditInterface) => (
            <AuditCard key={audit.id} audit={audit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLog;
