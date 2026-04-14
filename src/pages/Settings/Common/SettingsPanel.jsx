import { useEffect, useState } from 'react'
import { ArrowLeft, XClose } from '@untitled-ui/icons-react'
import PropTypes from 'prop-types'

export default function SettingsPanel({ children, onBack, onClose, backLabel = 'Back' }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const animate = (callback) => {
    setIsVisible(false)
    setTimeout(callback, 300)
  }

  return (
    <div
      className={`fixed inset-0 z-[60] flex pt-2 pl-2 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-tl-[40px] border-l border-t border-gray-200 bg-white pt-8 shadow-xl">
        <header className="mb-6 flex flex-col gap-6 px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => animate(onBack)}
              className="flex items-center gap-2 text-sm font-semibold text-brand/700 transition-colors hover:text-brand/900"
            >
              <ArrowLeft size={20} />
              {backLabel}
            </button>
            <button
              onClick={() => animate(onClose)}
              className="rounded-lg bg-white p-2 text-gray-400 transition-colors hover:text-gray-600"
            >
              <XClose size={20} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-8 pb-12">{children}</main>
      </div>
    </div>
  )
}

SettingsPanel.propTypes = {
  children: PropTypes.node.isRequired,
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  backLabel: PropTypes.string,
}
