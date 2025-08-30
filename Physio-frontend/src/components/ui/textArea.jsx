export function Textarea({ className = "", ...props }) {
    return (
      <textarea
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none ${className}`}
        {...props}
      />
    );
  }