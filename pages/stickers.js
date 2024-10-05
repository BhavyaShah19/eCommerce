import Link from 'next/link'
import React from 'react'
import Product from "@/models/Product";
import mongoose from 'mongoose';
const Stickers = ({ products }) => {
  // console.log(products)
  return (
    <div>
      <section className="text-gray-600 body-font min-h-screen ">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4 justify-center mx-5">
            {Object.keys(products).length===0 && <p>Sorry!The Stickers are out of stock.New stock is coming soon,Stay Tuned!</p>} 
            {Object.keys(products).map((item) => {

              return <Link key={products[item]._id} href={`product/${products[item].slug}`} className="lg:w-1/4 text md:w-1/2 p-4 text w-full">
                <div className="block relative h-48 rounded overflow-hidden" >
                  <img alt="ecommerce" className="object-cover object-center m-auto h-full block" src={products[item].img} />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Stickers</h3>
                  <h2 className="text-gray-900 title-font text-lg font-medium">{products[item].title}</h2>
                  <p className="mt-1">{products[item].price}</p>
                  <div className="mt-1">
                    {products[item].size.includes('S') && <span className='border px-1 border-gray mx-1'>S</span>}
                    {products[item].size.includes('M') && <span className='border px-1 border-gray mx-1'>M</span>}
                    {products[item].size.includes('L') && <span className='border px-1 border-gray mx-1'>L</span>}
                    {products[item].size.includes('XL') && <span className='border px-1 border-gray mx-1'>XL</span>}
                    {products[item].size.includes('XXL') && <span className='border px-1 border-gray mx-1'>XXL</span>}
                  </div>
                  <div className="mt-1">
                    {products[item].color.includes('red') &&
                      <button className="border-2 border-red-700 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                    }  
                    {products[item].color.includes('green') &&
                      <button className="border-2 border-green-700 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                    }
                    {products[item].color.includes('blue') &&
                      <button className="border-2 border-blue-700 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                    }
                    {products[item].color.includes('purple') &&
                      <button className="border-2 border-purple-700 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                    }
                  </div>
                </div>
              </Link>
            })}
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

  let products = await Product.find({ category: "sticker" })
  let stickers = {};
  for (let item of products) {
    if (item.title in stickers) {
      if (!stickers[item.title].color.includes(item.color) && item.availableQty > 0) {
        stickers[item.title].color.push(item.color);
      }
      if (!stickers[item.title].size.includes(item.size) && item.availableQty > 0) {
        stickers[item.title].size.push(item.size);
      }
    }
    else {
      stickers[item.title] = JSON.parse(JSON.stringify(item));
      if (item.availableQty > 0) {
        stickers[item.title].color = [item.color];
        stickers[item.title].size = [item.size];
      }
    }
  }
  return {
    props: { products: JSON.parse(JSON.stringify(stickers)) }
  }
}

export default Stickers
