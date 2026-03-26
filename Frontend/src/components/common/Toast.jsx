export default function Toast({ msg, type }) {
  return (
    <div
      className={`fixed bottom-6 right-6 bg-surface border rounded-xl px-5 py-3 text-sm shadow-xl z-50 animate-in slide-in-from-bottom-2 ${
        type === "success" ? "border-l-4 border-green" : "border-l-4 border-red"
      }`}
    >
      {type === "success" ? "✅" : "❌"} {msg}
    </div>
  );
}