export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center absolute inset-0">
      <svg
        className="animate-spin h-12 w-12 text-blue-500 dark:text-blue-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
        Cargando...
      </p>
    </div>
  );
};