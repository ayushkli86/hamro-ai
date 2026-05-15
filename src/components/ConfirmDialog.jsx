export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition cursor-pointer bg-transparent">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition cursor-pointer">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
