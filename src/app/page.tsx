import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8">
      <main className="flex flex-col items-center gap-12">
        {/* Welcome Message */}
        <h1 className="text-4xl font-bold text-center">Welcome to Movieliely</h1>
        <p className="text-lg text-center max-w-md">
          Get started by exploring our features. Log in to access your dashboard and add
          to your favorite the move.
        </p>

        {/* Login Button */}
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
        >
          Log In
        </Link>
      </main>

      <footer className="mt-16 flex gap-6 items-center justify-center">
        This app made by irfan septian
      </footer>
    </div>
  );
}
