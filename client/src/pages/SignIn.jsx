import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInSuccess, signInStart, signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error, errorMsg} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(signInStart());
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if(data.success === false){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error));
      console.log(error)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='email' placeholder='Email' id='email' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <input type='password' placeholder='Password' id='password' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <button type='submit' disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80' >
          {loading ? 'Loading...': 'Sign In'}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't Have an account?</p>
        <Link to='/sign-up'><span className='text-blue-500 uppercase'>Sign up</span></Link>
      </div>
      <p className="text-red-600">{error ? errorMsg || 'Something went wrong' : ""}</p>
    </div>
  )
}

