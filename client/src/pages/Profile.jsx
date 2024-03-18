import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';
import { useDispatch } from "react-redux";
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice.js";

export default function Profile() {
  const [image, setImage] = useState(undefined);
  const [imagePercentage, setImagePercentage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFromData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {currentUser, loading, error} = useSelector(state => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if(image){
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async(image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef  = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercentage(Math.round(progress));
        setImageError(false);
      },
    (error) => {
      setImageError(true)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFromData({ ...formData, profilePicture: downloadURL });
      })
    }
    );
  };

  const handleChange = (event) => {
    setFromData({ ...formData, [event.target.id]: event.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch(`api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if(response.ok){
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      }else {
        dispatch(updateUserFailure(data));
        setUpdateSuccess(false);
      }
      console.log(data)
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])}/>
        <img src={formData.profilePicture || currentUser.profilePicture} alt='profile' onClick={() => fileRef.current.click()} className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"/>
        <p className="text-sm self-center">{imageError ? (
          <span className="text-red-700">Error uploading image (file size must be less than 2 MB)</span>
        ) : imagePercentage > 0 && imagePercentage < 100 ? (
          <span className="text-slate-700">{`Uploading: ${imagePercentage} %`}</span>
        ) : (
          imagePercentage === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : ''
        )}</p>
        <input defaultValue={currentUser.username} type="text" id='username' placeholder="Username" className="bg-slate-100 rounded-lg p-3" onChange={handleChange}/>
        <input defaultValue={currentUser.email} type="email" id='email' placeholder="Email" className="bg-slate-100 rounded-lg p-3" onChange={handleChange}/>
        <input type="password" id='password' placeholder="Password" className="bg-slate-100 rounded-lg p-3" onChange={handleChange}/>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80" type="submit">
          {loading ? 'loading...' : 'update'}
        </button>
      </form>
      <div className="flex flex-row justify-between text-red-700 mt-5">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error && 'Something went wrong!'}</p>
      <p className="text-green-700 mt-5">{updateSuccess && 'User updated successfully!'}</p>
    </div>
  )
}
