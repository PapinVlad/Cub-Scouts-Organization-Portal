import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="bg-primary text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/generic-scout-logo.png" alt="Obanshire Cub Scouts Logo" className="h-12 w-12 mr-3" />
          <div>
            <h1 className="text-2xl font-heading font-bold">Obanshire Cub Scouts</h1>
            <p className="text-sm">Adventure, Friendship, Skills</p>
          </div>
        </Link>
        <div className="hidden md:flex space-x-4">
          <a
            href="tel:+441234567890"
            className="flex items-center text-white hover:text-accent transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            +44 (0) 1234 567890
          </a>
          <a
            href="mailto:info@obanshirecubscouts.org"
            className="flex items-center text-white hover:text-accent transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            info@obanshirecubscouts.org
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
