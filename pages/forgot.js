import Link from 'next/link'
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { Bounce, Slide, ToastContainer, toast } from 'react-toastify';
const Forgot = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cpassword, setCpassword] = useState('')
    useEffect(() => {
        if (localStorage.getItem('token')) {
            router.push('/')
        }
        // console.log(router)
    }, [])

    const handleChange = async (e) => {
        if (e.target.name == 'password') setPassword(e.target.value)
        if (e.target.name == 'cpassword') setCpassword(e.target.value)
        if (e.target.name == 'email') setEmail(e.target.value)
    }
    const resetPassword = async () => {
        if (password == cpassword) {
            const data = { password, sendMail: false }
            let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(data),
            })
            let res = await a.json()
            if (res.success) {
                toast.success('Password has been changed', {
                    position: "bottom-center",
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
            else {
                console.log("some error has occured")
            }
        }
        else {
            toast.error('Passwords do not match', {
                position: "bottom-center",
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

    const sendResetEmail = async () => {
        const data = { email, sendMail: true }
        let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        })


        let res = await a.json()
        if (res.success) {
            toast.success('Password reset instructions have been sent to your email', {
                position: "bottom-center",
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
        else {
            console.log("some error has occured")
        }
    }
    return (
        <div className="flex min-h-screen items-start justify-center pt-28 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>

                    <h2 className="mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Forgot Password
                    </h2>
                    <p className="mt-10 text-center text-sm text-gray-500">
                        Or
                        <Link href={'/login'} className="mx-2 font-semibold leading-6 text-pink-600 hover:text-pink-500">
                            Login
                        </Link>
                    </p>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                    {router.query.token && <div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">

                            </label>
                            <div className="mt-2">
                                <input onChange={handleChange}
                                    id="password"
                                    value={password}
                                    placeholder='New Password'
                                    name="password"
                                    type="password"
                                    autoComplete="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full border py-2 px-3 border-gray-300 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder-gray-500  rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="cpassword" className="block text-sm font-medium leading-6 text-gray-900">

                            </label>
                            <div className="mt-2">
                                <input onChange={handleChange}
                                    id="cpassword"
                                    value={cpassword}
                                    placeholder='Confirm New Password'
                                    name="cpassword"
                                    type="cpassword"
                                    autoComplete="cpassword"
                                    required
                                    className="appearance-none rounded-none relative block w-full border py-2 px-3 border-gray-300 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder-gray-500  rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                />
                            </div>
                        </div>


                        <div>
                            <button onClick={resetPassword}
                                type="submit"
                                className="my-4 flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                            >
                                Continue
                            </button>
                        </div>
                        {password != cpassword &&
                            <span className='text-red-600'>Passwords don't match</span>
                        }
                        {password && password == cpassword &&
                            <span className='text-green-600'>Passwords  match</span>
                        }


                    </div>}
                    {!router.query.token && <div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">

                            </label>
                            <div className="mt-2">
                                <input onChange={handleChange}
                                    id="email"
                                    value={email}
                                    placeholder='Email Address'
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>



                        <div>
                            <button onClick={sendResetEmail}
                                type="submit"
                                className="my-4 flex w-full justify-center rounded-md bg-pink-600 focus:outline-none px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                            >
                                Continue
                            </button>
                        </div>






                    </div>}






                </div>
            </div>
        </div>
    )
}

export default Forgot
