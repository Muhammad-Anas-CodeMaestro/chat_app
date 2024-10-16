"use client"
import { auth, signInWithEmailAndPassword } from "@/database/fireBaseConfique";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

const SignInPage = () => {
  const route = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const HandleClick = () => {
    route.push('/signup');
  }

  const HandleSubmit = (e) => {
    e.preventDefault();
    setLoading(
      true
    )
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        setLoading(
          false
        )
        await Swal.fire({
          title: 'Login successfully!',
          text: email,
          icon: 'success',
          confirmButtonText: 'okay'
        })
        route.push('/homePage')
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          title: 'error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'okay'
        })
        setLoading(
          false
        )
      });
  }
  
  return (
    <>
      <div className='flex justify-center w-11/12 lg:w-4/5 h-5/6 bg-[rgba(17,25,40,0.75)] backdrop-blur-lg saturate-150 rounded-lg border border-[rgba(255,255,255,0.125)]'>
        <div className="flex items-center flex-col h-full w-80 gap-5 mt-4">
          <h1 className='font-mono text-5xl font-bold'>Log in</h1>
          <div className='h-full flex flex-col gap-4'>
            <form className='flex flex-col gap-4' onSubmit={HandleSubmit}>
              <input className='border-gray-800 outline-none text-white flex-1 bg-[rgba(17,25,40,0.5)] rounded-lg p-2' type='email' placeholder='enter your email' onChange={(e) => { setEmail(e.target.value) }} value={email} />
              <input className='border-gray-800 outline-none text-white flex-1 bg-[rgba(17,25,40,0.5)] rounded-lg p-2' type='password' placeholder='enter your password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
              {
                loading ? (
                  <div>
                    loading...
                  </div>
                ) :
                  <button className='bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600' type='submit'>
                    Login
                  </button>
              }
            </form>
            <button onClick={HandleClick} className="text-sm text-gray-400 border-b-2 border-gray-300 gap-2" > Create a New Account ?</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignInPage