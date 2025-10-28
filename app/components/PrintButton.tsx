"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5
                 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-blue-600"
      aria-label="Print this page"
      title="Print (Ctrl/Cmd+P)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M17 7V3H7v4h10Zm0 2H7c-1.657 0-3 1.343-3 3v4h3v5h10v-5h3v-4c0-1.657-1.343-3-3-3Zm-2 10H9v-3h6v3Z" />
      </svg>
      Print
    </button>
  );
}
