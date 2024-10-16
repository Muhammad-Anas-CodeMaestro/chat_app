'use client'
import { useState } from "react"
import {
  auth,
  createUserWithEmailAndPassword,
  storage,
  uploadBytesResumable,
  getDownloadURL,
  setDoc,
  db,
  doc
} from "@/database/fireBaseConfique";    //Here your file are import from database fireBaseConfique
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'
import upload from "@/database/upload";

const SignUppage = () => {
  const route = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setloading] = useState(false);
  //Here you set the file and url of your image
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  })

  const HandleAvatar = (e) => {         //Your image are handle here when you try for signUp
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const HandleSubmit = (e) => {//The main work here , the function which collect the whole information when you click the submit button
    e.preventDefault()  // Protect for refreshing your page

    setloading(
      true
    )

    createUserWithEmailAndPassword(auth, email, password) //Authentication from firebase
      .then(async (userCredential) => {
        const user = userCredential.user;

        try {
          
          const imgUrl = await upload(avatar.file);

          await setDoc(doc(db, "user", user.uid), {      //create collection in database
            name,
            email,
            userId: user.uid,
            avatar: imgUrl
          });
          
          await setDoc(doc(db, "userchat", user.uid), {
            chats: [ ],
          });

        } catch (e) {
          // console.error("Error adding document: ", e);
          console.error("Error adding document: ", e.message);
        } finally {
          setloading(
            false
          )
        }
        await Swal.fire({
          title: 'sign up successfully! Now you can Login',
          text: email,
          icon: 'success',
          confirmButtonText: 'okay'
        })
        route.push('/signin')
      })
      .catch((error) => {
        Swal.fire({
          title: 'sign up fail!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'okay'
        })

        setloading(
          false
        )
      });
  }

  const HandleChange = () => {
    route.push('signin')
  }

  return (
    <>
      <div className='flex justify-center w-11/12 lg:w-4/5 h-5/6 bg-[rgba(17,25,40,0.75)] backdrop-blur-lg saturate-150 rounded-lg border border-[rgba(255,255,255,0.125)]'>
        <div className="flex items-center flex-col h-full w-80 gap-5 mt-4">
          <h1 className='font-mono text-5xl font-bold'>Sign up</h1>
          <div className='h-full flex flex-col gap-4'>
            <form onSubmit={HandleSubmit} className='flex flex-col gap-4'>
              <label htmlFor="file" className="w-full flex items-center justify-between cursor-pointer underline">
                <img src={avatar.url || "./avatar.png"} alt="" className="w-12 h-12 rounded-lg object-cover opacity-60" />
                Upload an image
              </label>
              <input
                type="file"
                id="file"
                onChange={HandleAvatar}
                className="hidden"
              />
              <input onChange={(e) => setName(e.target.value)} value={name} className="border-gray-800 outline-none text-white flex-1 bg-[rgba(17,25,40,0.5)] rounded-lg p-2" type='text' placeholder='Enter your Name' />
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='border-gray-800 outline-none text-white flex-1 bg-[rgba(17,25,40,0.5)] rounded-lg p-2' type='email' placeholder='enter your email' />
              <input onChange={(e) => setPassword(e.target.value)} value={password} className='border-gray-800 outline-none text-white flex-1 bg-[rgba(17,25,40,0.5)] rounded-lg p-2' type='password' placeholder='enter your password' />
              {
                loading ?
                  (<div>
                    loading...
                  </div>) :
                  <button className='bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600' type='submit'>
                    Sign up
                  </button>
              }
            </form>
            <button onClick={HandleChange} className="text-sm text-gray-400 border-b-2 border-gray-300 gap-2" >Back to Login Page..!</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUppage