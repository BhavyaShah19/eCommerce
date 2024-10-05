import React from 'react'
import { useRouter } from 'next/router'
import Order from '@/models/Order'
import mongoose from 'mongoose'
import { useState } from 'react'

const MyOrder = ({ order,clearCart }) => {
  const router = useRouter()
  const [date, setDate] =useState()
  useEffect(() => {
    const d=new Date(order.createdAt)
    setDate(d)
    if(router.query.clearCart==1){
      clearCart()
    }
  }, [])
  const products = order.products
  console.log(order)
  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">CodesWear.com</h2>
              <h1 className="text-gray-900 text-xl md:text-3xl title-font font-medium mb-4">Order Id:{order.orderId}</h1>
              <p className="leading-relaxed mb-4">Your Order has been successfully placed.</p>
              <p className="leading-relaxed mb-4">Order placed on:{date && date.toLocaleString("hi-IN")} </p>
              <p>Your payment Status is <span className='font-semibold text-slate-600'>{order.status}</span></p>
              <div className="flex mb-4">
                <a className="flex-grow py-2  text-center text-lg px-1">Item Description</a>
                <a className="flex-grow text-center border-gray-300 py-2 text-lg px-1">Quantity</a>
                <a className="flex-grow text-center border-gray-300 py-2 text-lg px-1">Item Total</a>
              </div>


              {Object.keys(products).map((item) => {
                return <div key={item} className="flex border-t border-gray-200 py-2">
                  <span className="text-gray-500">{products[item].name}/({products[item].size}/{products[item].variant}) </span>
                  <span className="m-auto text-gray-900">{products[item].qty}</span>
                  <span className="m-auto text-gray-900">₹{products[item].price} X {products[item].qty}=₹{products[item].price} * {products[item].qty}</span>
                </div>
              })}


              <div className="flex flex-col my-8">
                <span className="title-font font-medium text-2xl text-gray-900">SubTotal:₹{order.amount}</span>
                <div className="my-6">


                  <button className="flex mx-0 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">Track Order</button>
                </div>
                {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                  <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                  </svg>
                </button> */}
              </div>
            </div>
            <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://dummyimage.com/400x400" />
          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }

  let order = await Order.findById(context.query.id)

  return {
    props: { order: JSON.parse(JSON.stringify(order)) }
  }
}
export default MyOrder
