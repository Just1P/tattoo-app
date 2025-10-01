interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`text-sm text-red-600 bg-red-50 p-3 rounded-md ${className}`}
    >
      {message}
    </div>
  );
}
