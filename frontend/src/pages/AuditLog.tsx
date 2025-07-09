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
        setAllAudit(response.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);
  return (
    <div>
      <h1>Recent Activites</h1>
      {allAudit.length === 0 ? (
        <div>no recent Activites</div>
      ) : (
        <div className="w-full h-full flex flex-col">
          {allAudit.map((audit: auditInterface) => (
            <AuditCard audit={audit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLog;
