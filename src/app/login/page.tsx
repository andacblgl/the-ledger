import { login, signup } from './actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams
  const message = params?.message

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-200">
      <div className="w-full max-w-md p-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-serif text-primary mb-3">Enter the Archive</h1>
          <p className="text-sm text-stone-400 font-sans tracking-wide">
            Authenticate to access your provisions and tasting notes.
          </p>
        </header>

        <form className="flex flex-col space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest uppercase text-stone-500" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="curator@archive.com"
              className="w-full bg-transparent border-b border-stone-800 py-2 px-1 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-stone-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest uppercase text-stone-500" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-stone-800 py-2 px-1 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-stone-700"
            />
          </div>

          {message && (
            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded p-3 text-center">
              {message}
            </div>
          )}

          <div className="pt-6 flex flex-col gap-4">
            <button
              formAction={login}
              className="w-full py-3 px-4 bg-primary/90 hover:bg-primary text-stone-900 font-medium rounded shadow-sm transition-all text-sm tracking-wide"
            >
              Unlock the Ledger
            </button>
            <button
              formAction={signup}
              className="w-full py-3 px-4 bg-stone-900 border border-stone-800 hover:border-stone-600 text-stone-300 font-medium rounded shadow-sm transition-all text-sm tracking-wide"
            >
              Request Access (Sign Up)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
