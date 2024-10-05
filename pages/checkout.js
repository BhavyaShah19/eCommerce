import { React, useState, useEffect } from 'react'
import { AiTwotonePlusCircle } from "react-icons/ai";
import { BsBagCheckFill } from "react-icons/bs";
import { HiOutlineMinusCircle } from "react-icons/hi2";
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import { Bounce, Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = ({ cart, clearCart, subTotal, removeFromCart, addToCart }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [address, setAddress] = useState('')
  const [disable, setDisable] = useState(true)
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [user, setUser] = useState({ value: null })

  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem('myuser'))
    if (myuser && myuser.token) {
      setUser(myuser)
      setEmail(myuser.email)
      fetchData(myuser.token)
    }
  }, [])

  useEffect(() => {
    if (name.length > 3 && email.length > 3 && phone.length > 3 && pincode.length > 3 && address.length > 3) {
      setDisable(false)
    }
    else {
      setDisable(true)
    }
  }, [name, email, phone, pincode, address])

  const fetchData = async (token) => {
    let data = { token: token }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })

    let res = await a.json()
    console.log(res)
    setName(res.name)
    setAddress(res.address)
    setPhone(res.phone)
    setPincode(res.pincode)
    getPincode(res.pincode)
  }

  const getPincode = async (pin) => {
    let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
    let pinJson = await pins.json()
    if (Object.keys(pinJson).includes(pin)) {
      setState(pinJson[pin][1]);
      setCity(pinJson[pin][0])
    }
    else {
      setState('');
      setCity('');
    }
  }

  const handleChange = async (e) => {

    if (e.target.name == 'name') setName(e.target.value);
    else if (e.target.name == 'email') setEmail(e.target.value);
    else if (e.target.name == 'phone') setPhone(e.target.value);
    else if (e.target.name == 'pincode') {
      setPincode(e.target.value);
      if (e.target.value.length == 6) {
        getPincode(e.target.value)
      }
      else {
        setState('');
        setCity('');
      }
    }
    else if (e.target.name == 'address') setAddress(e.target.value);
  }

  const initiatePayment = async () => {
    let oid = Math.floor(Math.random() * Date.now());
    // console.log(oid)

    const data = { cart, subTotal, oid, email: email, name, address, pincode, phone }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })

    let txnRes = await a.json()
    if (txnRes.success) {
      let txnToken = txnRes.txnToken
      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
          "orderId": oid, /* update order id */
          "token": txnToken, /* update token value */
          "tokenType": "TXN_TOKEN",
          "amount": subTotal /* update amount */
        },
        "handler": {
          "notifyMerchant": function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          }
        }
      };


      // initialze configuration using init method

      window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
        // after successfully updating configuration, invoke JS Checkout
        window.Paytm.CheckoutJS.invoke();
      }).catch(function onError(error) {
        console.log("error => ", error);
      });
    }
    else {
      console.log(txnRes.error)
      if (txnRes.cartClear) {

        clearCart()
      }
      toast.error(txnRes.error, {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    }
  }
  return (
    <div className='container px-2 sm:m-auto min-h-screen'>
      <ToastContainer />
      <Head>
        <title>Checkout-CodesWear.com</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" /></Head>
      <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`} />
      <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      <h2 className='font-semibold text-xl '>1. Delivery Details</h2>
      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            {user && user.token ? <input value={user.email} type="text" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly={true} /> : <input value={email} onChange={handleChange} type="text" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />}

          </div>
        </div>
      </div>
      <div>
        <div className="px-2 w-full">
          <div className="mb-4">
            <label htmlFor="Address" className="leading-7 text-sm text-gray-600">Address</label>
            <textarea value={address} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" name="address" id="Address" cols="30" rows="2"></textarea>
          </div>
        </div>
      </div>
      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
            <input placeholder='Your 10 digit phone number' onChange={handleChange} value={phone} type="text" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">

            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input onChange={handleChange} value={pincode} type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />



          </div>
        </div>
      </div>
      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input onChange={handleChange} value={state} type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600">District</label>
            <input onChange={handleChange} value={city} type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>

      <h2 className='font-semibold text-xl '>2. Review Cart Items</h2>
      <div className="sideCart bg-pink-100 p-8 m-4">
        <ol className='list-decimal font-semibold'>
          {Object.keys(cart).length == 0 && <div className='my-4 font-semibold'>Your cart is Empty!</div>}
          {Object.keys(cart).map((item) => {
            return <li key={item}>
              <div className="item flex my-5">
                <div className='font-semibold'>{cart[item].name}({cart[item].size}/{cart[item].variant})</div>
                <div className='flex items-center justify-center w-1/3 text-lg font-semibold'><HiOutlineMinusCircle onClick={() => {
                  removeFromCart(item, 1, cart[item].price, cart[item].name, cart[item].size, cart[item].variant)
                }} className='cursor-pointer text-pink-500' /><span className='mx-2 text-sm'>{cart[item].qty}</span><AiTwotonePlusCircle className='cursor-pointer' onClick={() => {
                  addToCart(item, 1, cart[item].price, cart[item].name, cart[item].size, cart[item].variant)
                }} /></div>
              </div>
            </li>
          })}

        </ol>
        <span className="font-bold">SubTotal:₹{subTotal}</span>

      </div>
      <div className="mx-4">
        <Link href={'/checkout'}><button disabled={disable} onClick={initiatePayment} className="disabled:bg-pink-300  flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg-1"><BsBagCheckFill className='m-1' />Pay ₹{subTotal}</button></Link>
      </div>
    </div>
  )
}

export default Checkout
