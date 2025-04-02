import { toast } from "sonner";
import { CheckCircle, XCircle, Info } from "lucide-react";

export function showToast(title, description, type = "info") {
  let icon = null;
  let borderColor = "";
  let titleColor = "";
  let descColor = "text-gray-700";

  switch (type) {
    case "success":
      icon = <CheckCircle className="text-green-600 w-5 h-5 mt-1" />;
      borderColor = "border-green-200";
      titleColor = "text-green-700";
      break;
    case "error":
      icon = <XCircle className="text-red-600 w-5 h-5 mt-1" />;
      borderColor = "border-red-200";
      titleColor = "text-red-700";
      break;
    case "info":
    default:
      icon = <Info className="text-blue-600 w-5 h-5 mt-1" />;
      borderColor = "border-blue-200";
      titleColor = "text-blue-700";
      break;
  }

  toast(
    <div className="flex items-start space-x-3">
      {icon}
      <div>
        <p className={`font-semibold text-base ${titleColor}`}>{title}</p>
        <p className={`text-sm ${descColor}`}>{description}</p>
      </div>
    </div>,
    {
      className: `!bg-white !text-black border ${borderColor} shadow rounded-md max-w-fit px-4 py-3`,
    }
  );
}

// showToast("Thành công rồi!", "Giao dịch đã được xử lý", "success");
// showToast("Thành công rồi!", "Giao dịch đã được xử lý", "error");
// showToast("Thành công rồi!", "Giao dịch đã được xử lý", "info");
