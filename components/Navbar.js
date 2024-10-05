import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { FaCartArrowDown } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { useRef } from 'react';
import { AiTwotonePlusCircle } from "react-icons/ai";
import { BsBagCheckFill } from "react-icons/bs";
import { HiOutlineMinusCircle } from "react-icons/hi2";
import { RiAccountCircleFill } from "react-icons/ri";
import { useRouter } from 'next/router';



const Navbar = ({ logout, user, cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const [dropdown, setDropdown] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  const router = useRouter();
  useEffect(() => {
    Object.keys(cart).length !== 0 && setSidebar(true)
    let exempted = ['/checkout', '/order', '/orders', '/myaccount']
    if (exempted.includes(router.pathname)) {
      setSidebar(false)
    }
  }, [])

  // console.log(cart, addToCart, removeFromCart, clearCart, subTotal)
  const toggleCart = () => {
    setSidebar(!sidebar)
    // if (ref.current.classList.contains('translate-x-full')) {
    //   ref.current.classList.remove('translate-x-full')
    //   ref.current.classList.add('translate-x-0')
    // }
    // else if (!ref.current.classList.contains('translate-x-full')) {
    //   ref.current.classList.remove('translate-x-0')
    //   ref.current.classList.add('translate-x-full')
    // }
  }
  const ref = useRef()
  return (
    <>
      {!sidebar && <span onMouseOver={() => {
        setDropdown(true)
      }} onMouseLeave={() => {
        setDropdown(false)
      }} className='fixed right-9 top-4 z-30 cursor-pointer'>
        {dropdown && <div className="absolute right-5 z-30 bg-white border shadow-lg top-5 rounded-md px-5 w-32 py-4">
          <ul>
            <Link href={'/myaccount'}><li className='py-1 text-sm  font-bold hover:text-pink-700' >My Account</li></Link>
            <Link href={'/orders'}><li className='py-1 text-sm  font-bold hover:text-pink-700' >My Orders</li></Link>
            <li onClick={logout} className='py-1 text-sm font-bold  hover:text-pink-700' >Logout</li>
          </ul>
        </div>}
        {user.value && <RiAccountCircleFill className='text-xl md:text-2xl mx-2' />}

      </span>}
      <div className={`flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-xl sticky top-0 z-10 bg-white ${!sidebar && 'overflow-hidden'}`}>
        <div className="logo hidden md:block mr-auto md:mx-5">
          <Link href={'/'} > <Image width={200} height={40} src="/logo.png" alt="" />
          </Link>
        </div>
        <div className="nav">
          <ul className="flex items-center space-x-5 font-bold md:text-md">
            <Link href={'/tshirts'}><li>Tshirts</li></Link>
            <Link href={'/hoodies'}><li>Hoodies</li> </Link>
            <Link href={'/stickers'}><li>Stickers</li>  </Link>
            <Link href={'/mugs'}><li>Mugs</li> </Link>
          </ul>
        </div>
        <div className="cart absolute items-center right-0 top-4 mx-5 cursor-pointer flex">

          {!user.value && <Link href={'/login'}><button className='bg-pink-600 px-2 py-1 rounded-md text-sm text-white mx-2'>Login</button></Link>}


          <FaCartArrowDown onClick={toggleCart} className='text-xl md:text-2xl' />
        </div>
        <div ref={ref} className={`w-72 h-[100vh] sideCart overflow-y-scroll absolute top-0 bg-pink-100 px-8 py-10 transition-all ${sidebar ? 'right-0' : '-right-96'}`}>
          <h2 className='font-bold text-xl text-center'>
            Shopping Cart
          </h2>
          <span onClick={toggleCart} className='absolute top-2 right-2 cursor-pointer text-2xl text-pink-500'><AiFillCloseCircle /></span>
          <ol className='list-decimal font-semibold'>
            {Object.keys(cart).length == 0 && <div className='my-4 font-semibold'>Your cart is Empty!</div>}
            {Object.keys(cart).map((item) => {
              return <li key={item}>
                <div className="item flex my-5">
                  <div className='w-2/3 font-semibold'>{cart[item].name},({cart[item].size}/{cart[item].variant})</div>
                  <div className='flex items-center justify-center w-1/3 text-lg font-semibold'><HiOutlineMinusCircle onClick={() => {
                    removeFromCart(item, 1, cart[item].price, cart[item].name, cart[item].size, cart[item].variant)
                  }} className='cursor-pointer text-pink-500' /><span className='mx-2 text-sm'>{cart[item].qty}</span><AiTwotonePlusCircle className='cursor-pointer' onClick={() => {
                    addToCart(item, 1, cart[item].price, cart[item].name, cart[item].size, cart[item].variant)
                  }} /></div>
                </div>
              </li>
            })}
          </ol>
          <div className="flex">


            <Link href={'/checkout'}><button disabled={Object.keys(cart).length === 0} className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg-1"><BsBagCheckFill className='m-1' />Checkout</button></Link>

            <button disabled={Object.keys(cart).length === 0} onClick={clearCart} className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg-1">Clear Cart</button>
          </div>
        </div>
      </div>
    </>
  )
}


export default Navbar
