import React from 'react'

export default function Navbar() {
  return (
    <nav className='flex flex-row gap-2 justify-start p-2 bg-slate-800 text-white'>
        <h2>Scrabble</h2>
        <div className='ml-auto'>Theme</div>
    </nav>
  )
}
