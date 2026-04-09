import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterFail = () => {
    const navigator=useNavigate();

   
    
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center"> 
            <h1 className="text-3xl font-bold text-red-500">Registration Failed!</h1>
            <p className="text-lg text-gray-700 mt-4">Sorry, there was an error registering for the event.</p>
            <p className="text-gray-700">Please retry again...</p>
            <button className="mt-6 px-4 py-2 bg-gradient-to-br from-[#00BFA6] to-[#1DE9B6] text-white font-bold rounded" onClick={()=>navigator('/events')}>events</button>
        </div>
    );
}

export default RegisterFail;