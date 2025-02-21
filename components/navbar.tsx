import Link from "next/link"

export const Navbar = () => {
  return (
    <nav className="border-b-[1px] bg-[#090b0c] z-[100] border-gray-300/20 py-4 flex justify-between items-center px-2 sticky top-0">
      <Link href="/">
        <h1 className="text-3xl font-bold">InnovateX</h1>
      </Link>
      <button className="px-4 py-2 rounded-full font-semibold bg-[#635dff]">
        <Link href="/signup">
          Signup
        </Link>
      </button>
    </nav>
  )
}