import { Link } from 'react-router-dom'
import {
  Lightbulb02,
  LayoutAlt01,
  Palette,
  Code01,
  CheckCircle,
  Pin01,
} from '@untitled-ui/icons-react' // ganti lucide-react ➜ untitled-ui

function WelcomePageBoilerPlate() {
  // tombol navigasi
  const menus = [
    {
      path: '/component-review',
      label: 'Component Review',
      icon: <LayoutAlt01 className="size-5" />,
    },
    { path: '/styling', label: 'Styling Guide', icon: <Palette className="size-5" /> },
    { path: '/forms', label: 'Forms', icon: <CheckCircle className="size-5" /> },
    { path: '/hooks', label: 'Custom Hooks', icon: <Code01 className="size-5" /> },
    { path: '/version', label: 'App Version', icon: <Pin01 className="size-5" /> },
  ]

  const features = [
    'Responsive layout out-of-the-box',
    'Pre-configured ESLint + Prettier',
    'Dark-mode theming built-in',
    'Atomic design folder structure',
  ]

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-gradient-to-br
                     from-fuchsia-500 via-indigo-600 to-blue-700 text-white"
    >
      {/* ornamen kilau */}
      <Lightbulb02 className="absolute -top-10 -left-10 size-[36rem] opacity-[0.07] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-10 px-6 py-20">
        {/* HERO */}
        <h1 className="text-center text-5xl font-extrabold tracking-tight drop-shadow-lg">
          Welcome&nbsp;
          <span className="whitespace-nowrap bg-white/10 px-4 py-1 rounded-lg">
            to Your Boilerplate
          </span>
        </h1>

        <p className="max-w-2xl text-center text-lg font-light text-white/90">
          A shining starting point for blazing-fast web apps. Explore ready-made components, styling
          guidelines, and developer utilities — everything you need to ship features quickly and
          beautifully.
        </p>

        {/* tombol navigasi */}
        <div className="flex flex-wrap justify-center gap-4">
          {menus.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className="group relative flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3
                         text-sm font-semibold shadow-lg backdrop-blur transition-all
                         hover:bg-white/20 hover:shadow-xl active:scale-[.98]
                         focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              {icon}
              {label}

              {/* efek kilau radial */}
              <span
                className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-md transition-opacity group-hover:opacity-40"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(255,255,255,.6), transparent 70%)',
                }}
              />
            </Link>
          ))}
        </div>

        {/* daftar fitur */}
        <section className="max-w-3xl w-full grid sm:grid-cols-2 gap-6 pt-10">
          {features.map((feat, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-white/10 p-4 shadow-md backdrop-blur-sm"
            >
              <CheckCircle className="mt-0.5 size-5 flex-shrink-0 text-white" />
              <p className="text-sm font-medium text-white/90">{feat}</p>
            </div>
          ))}
        </section>

        {/* footer */}
        <footer className="pt-12 text-center text-xs text-white/60">
          MIT Licensed • Crafted with 💖 & TailwindCSS
        </footer>
      </div>
    </main>
  )
}

export default WelcomePageBoilerPlate
