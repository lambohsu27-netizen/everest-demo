import React from 'react'

function MyDetailView({ datas = {}, func = {}, header = '' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm overflow-hidden">
      {/* Header - Ukuran Teks dikecilkan sedikit (text-xs) */}
      <label className="text-sm-semibold block px-5 py-3 text-gray-900 border-b border-gray-200">
        {header || '-'}
      </label>

      {/* Content */}
      <div className="flex flex-col bg-white">
        {Object.entries(datas).map(([key, value], index) => {
          const processedValue = func[key] ? func[key](value) : value

          return (
            <React.Fragment key={key}>
              {/* Container Baris: justify-between agar value mentok kanan */}
              <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                {/* Kolom Kiri: Label (text-xs) */}
                <p className="text-xs font-normal text-gray-600 shrink-0">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </p>

                {/* Kolom Kanan: Value (text-xs + font-semibold, MENTOK KANAN) */}
                <div className="text-xs font-semibold text-gray-900 text-right">
                  {processedValue}
                </div>
              </div>

              {/* Garis pemisah antar baris */}
              {index < Object.entries(datas).length - 1 && <hr className="border-gray-100 mx-5" />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default MyDetailView
