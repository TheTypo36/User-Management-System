import type { auditInterface } from "../pages/AuditLog";

interface auditProps {
  audit: auditInterface;
}

const AuditCard = (props: auditProps) => {
  const { ipAddress, target, user, action, createdAt } = props.audit;
  return (
    <div className="flex flex-row w-10 h-full bg-gray-400 p-2 m-2 text-purple-500">
      <div>{action}</div>
      <div>{target}</div>
      <div>Done by: {user.username}</div>
      <div>ip: {ipAddress}</div>
      <div>permission: {user.role}</div>
      <div>time: {createdAt}</div>
    </div>
  );
};

export default AuditCard;
