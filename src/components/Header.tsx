const Header: React.FC = () => (
  <header className="border-b border-neutral-200 bg-neutral-100 pt-5 pb-8 text-center" role="banner">
    <div className="container mx-auto">
      <h1 className="mb-2.5 text-4xl font-bold text-gray-900">GitHub Repositories Explorer</h1>
      <p className="mt-0 text-lg font-light text-gray-600" aria-label="Site description">
        Search for GitHub users and explore their repositories
      </p>
    </div>
  </header>
)

export default Header
