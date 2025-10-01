import { IconPaint } from "@tabler/icons-react";

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <IconPaint size={24} className="text-gray-800" />
      <span className="text-xl font-bold text-gray-900">Tattoo App</span>
    </div>
  );
}
