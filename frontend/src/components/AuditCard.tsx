import type { auditInterface } from "../pages/AuditLog";

interface auditProps {
  audit: auditInterface;
}

const getCardStyle = (action: string) => {
  switch (action) {
    case "Create_User":
      return {
        bg: "bg-green-100",
        border: "border-green-400",
        accent: "text-green-700",
      };
    case "Deactivate_user":
      return {
        bg: "bg-red-100",
        border: "border-red-400",
        accent: "text-red-700",
      };
    case "Updated_User":
      return {
        bg: "bg-yellow-100",
        border: "border-yellow-400",
        accent: "text-yellow-800",
      };
    default:
      return {
        bg: "bg-blue-100",
        border: "border-blue-400",
        accent: "text-blue-700",
      };
  }
};

const AuditCard = ({ audit }: auditProps) => {
  const { ipAddress, target, user, action, createdAt } = audit;
  const { bg, border, accent } = getCardStyle(action);

  return (
    <div
      className={`rounded-lg border-l-4 p-4 w-full shadow-sm text-sm ${bg} ${border}`}
    >
      <div className="grid grid-cols-2 gap-4 text-blue-700 font-medium">
        <div className="flex flex-col gap-1">
          <div className={`font-semibold ${accent}`}>{action}</div>
          <div>
            <span className="font-medium text-gray-600">By:</span>{" "}
            {user.username}
          </div>
          <div>
            <span className="font-medium text-gray-600">Role:</span>{" "}
            <span className="capitalize">{user.role.toLowerCase()}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div>
            <span className="font-medium text-gray-600">Target:</span>{" "}
            {target || "—"}
          </div>
          <div>
            <span className="font-medium text-gray-600">IP:</span>{" "}
            {ipAddress || "—"}
          </div>
          <div>
            <span className="font-medium text-gray-600">Time:</span>{" "}
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditCard;
