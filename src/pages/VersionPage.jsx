// src/pages/VersionPage.jsx
export default function VersionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-brand-700">App Version</h1>
      <p className="text-lg text-gray-700">{__APP_VERSION__}</p>
    </div>
  )
}
