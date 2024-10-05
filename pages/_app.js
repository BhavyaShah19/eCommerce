import "@/styles/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { useRouter } from 'next/router'
import LoadingBar from 'react-top-loading-bar'
export default function App({ Component, pageProps }) {
     const [cart, setCart] = useState({})
     const [subTotal, setsubTotal] = useState(0)
     const [user, setuser] = useState({ value: null })
     const [key, setkey] = useState()
     const [progress, setProgress] = useState(0)
     const router = useRouter()
     useEffect(() => {
          router.events.on('routeChangeStart', ()=>{
               setProgress(40)
          })
          router.events.on('routeChangeComplete', ()=>{
               setProgress(100)
          })
          console.log("Hey I am a useEffect from app.js")

          try {
               if (localStorage.getItem("Cart")) {
                    setCart(JSON.parse(localStorage.getItem("Cart")))
                    saveCart(JSON.parse(localStorage.getItem("Cart")))
               }
          } catch (error) {
               console.error(error)
               localStorage.clear();
          }
          const myuser = JSON.parse(localStorage.getItem('myuser'))
          if (myuser) {
               setuser({ value: myuser.token,email:myuser.email })
          }
          setkey(Math.random())

     }, [router.query])
     const logout = () => {
          localStorage.removeItem('myuser');
          setuser({ value: null })
          setkey(Math.random())
          router.push('/')
     }
     const buyNow = (itemCode, qty, price, name, size, variant) => {
          // saveCart({})
          let myCart={}
          myCart[itemCode]= { qty:1, price, name, size, variant } 
          setCart(myCart)
          saveCart(myCart)
          router.push('/checkout')
     }
     const saveCart = (myCart) => {
          localStorage.setItem("Cart", JSON.stringify(myCart))
          let subT = 0
          let keys = Object.keys(myCart)
          for (let i = 0; i < keys.length; i++) {
               subT += myCart[keys[i]].price * myCart[keys[i]].qty
          }
          setsubTotal(subT)
     }
     const addToCart = (itemCode, qty, price, name, size, variant) => {
          let myCart = cart
          if(Object.keys(cart).length==0){
               setkey(Math.random())
          }
          if (itemCode in cart) {
               myCart[itemCode].qty = cart[itemCode].qty + qty;
          }
          else {
               myCart[itemCode] = { qty: 1, price, name, size, variant }
          }
          setCart(myCart)
          saveCart(myCart)
     }
     const clearCart = () => {
          setCart({})
          saveCart({})
     }
     const removeFromCart = (itemCode, qty, price, name, size, variant) => {
          let myCart = cart
          if (itemCode in cart) {
               myCart[itemCode].qty = cart[itemCode].qty - qty;
          }
          else {
               myCart[itemCode].qty = { qty: 1, price, name, size, variant }
          }
          if (myCart[itemCode].qty <= 0) {
               delete myCart[itemCode]
          }
          setCart(myCart)
          saveCart(myCart)
     }
     return <>
          <LoadingBar
               color='#ff2d85'
               progress={progress}
               waitingTime={400}
               onLoaderFinished={() => setProgress(0)}
          />
          {key && <Navbar logout={logout} user={user} key={key} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} />}
          <Component buyNow={buyNow} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps} />
          <Footer />
     </>
}