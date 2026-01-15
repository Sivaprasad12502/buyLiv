import React from 'react'
import { useAuth } from '../../auth/AuthContext'
import { FaSearch } from 'react-icons/fa'
import './SearchBar.scss'

const SearchBar = () => {
    const {search,setSearch}=useAuth()
  return (
    <section className="hero">
        <div className="hero-serch">
          <FaSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="searchInput"
          />
        </div>

        {/* <div className="searchBox">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="searchInput"
          />
        </div> */}
      </section>
  )
}

export default SearchBar