import type { auditInterface } from "../pages/AuditLog";

interface auditProps {
  audit: auditInterface;
}

const AuditCard = (props: auditProps) => {
  const { ipAddress, target, user, action, createdAt } = props.audit;
  return (
    <div className="bg-white rounded-xl shadow-md p-6 m-2 border border-gray-200 w-full hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col gap-2 text-gray-700">
        <div className="text-lg font-semibold text-indigo-600">{action}</div>
        <div>
          <span className="font-medium text-gray-500">Target:</span> {target}
        </div>
        <div>
          <span className="font-medium text-gray-500">Done by:</span>{" "}
          {user.username}
        </div>
        <div>
          <span className="font-medium text-gray-500">Role:</span> {user.role}
        </div>
        <div>
          <span className="font-medium text-gray-500">IP:</span> {ipAddress}
        </div>
        <div>
          <span className="font-medium text-gray-500">Time:</span>{" "}
          {new Date(createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default AuditCard;
