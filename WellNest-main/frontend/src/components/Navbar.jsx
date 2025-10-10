import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import wellnest_logo from '/wellnest_logo.png';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0(); // Auth0 hooks

  // Toggle function for mobile menu
  const handleNav = () => {
    setNav(!nav);
  };

  // Navigation items with links
  const navItems = [
    { id: 1, text: 'Home', link: '/' },
    { id: 2, text: 'Profile', link: '/loggedin/profile' },
    { id: 2, text: 'Dashboard', link: '/loggedin/dashboard' },
    { id: 3, text: 'Chatbot', link: 'https://wellnest-chat-bot.onrender.com/', external: true },
  ];

  return (
    <div className='fixed flex justify-between items-center h-12 sm:h-16 w-full mx-auto px-16 text-white bg-white shadow'>
      {/* Logo */}
      <img src={wellnest_logo} alt="logo" className="w-[12vw] sm:w-[8vw]" />

      {/* Desktop Navigation */}
      <ul className='hidden md:flex py-2'>
        {navItems.map(item => (
          <li key={item.id} className='hover:bg-[#acdeff] rounded-xl mx-12 my-2 p-2 px-4 text-black text-lg cursor-pointer duration-300 hover:text-black'>
            {item.external ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer">{item.text}</a>
            ) : (
              <Link to={item.link}>{item.text}</Link>
            )}
          </li>
        ))}

        {/* Logout Button */}
        {isAuthenticated ? (
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="ml-4 px-4 my-2 text-lg bg-[#29b5f6] text-white rounded-lg hover:bg-blue-800 duration-300"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="ml-4 bg-[#29b5f6] my-2 text-lg text-white rounded-lg hover:bg-blue-800 duration-300"
          >
            Login
          </button>
        )}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden cursor-pointer'>
        {nav ? <AiOutlineClose size={25} className="text-blue-500" /> : <AiOutlineMenu size={25} className="text-blue-500" />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={`fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-gray-900 bg-[#000300] ease-in-out duration-500 ${
          nav ? 'left-0' : 'left-[-100%]'
        }`}
      >
        {/* Mobile Logo */}
        <h1 className='w-full text-3xl font-bold text-[#fff] m-4'>Wellnest</h1>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li key={item.id} className='p-4 border-b border-gray-600 rounded-xl hover:bg-gray-800 duration-300 hover:text-white cursor-pointer'>
            {item.external ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={handleNav}>
                {item.text}
              </a>
            ) : (
              <Link to={item.link} onClick={handleNav}>
                {item.text}
              </Link>
            )}
          </li>
        ))}

        {/* Logout Button in Mobile Menu */}
        {isAuthenticated ? (
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="m-4 px-4 bg-[#29b5f6] text-white rounded-lg hover:bg-blue-800 duration-300"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="m-4 px-4 bg-[#29b5f6] text-white rounded-lg hover:bg-blue-800 duration-300"
          >
            Login
          </button>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
