import PropTypes from 'prop-types'

export default function RiskSignalCard({
  icon: Icon,
  title,
  count,
  description,
  highlightText,
  color = 'text-brand/900',
  onClick,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
      <section className="pt-5 px-5 space-y-4">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <div className="p-2 bg-white rounded-lg  shadow-shadows/shadow-xs-skeuomorphic">
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <span className={color}>{title}</span>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-bold text-gray-900">
            {count} <span className="text-gray-900 font-bold text-lg">{highlightText}</span>
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </section>

      <div className="p-4 pr-5 border-t border-gray-200 flex justify-end">
        <button
          onClick={onClick}
          className="text-sm font-semibold text-brand/900 transition-colors opacity-90 hover:opacity-100"
        >
          View details
        </button>
      </div>
    </div>
  )
}

RiskSignalCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
  highlightText: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
}

RiskSignalCard.defaultProps = {
  highlightText: '',
  color: 'text-brand/900',
  onClick: () => {},
}
