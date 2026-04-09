import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterSuccess = () => {
    const navigator=useNavigate();

    useEffect(()=>{
        const timer=setTimeout(()=>{
            navigator('/');
        },3000)

        return ()=>clearTimeout(timer);
    },[])
    
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center"> 
            <h1 className="text-3xl font-bold text-green-500">Registration Successful!</h1>
            <p className="text-lg text-gray-700 mt-4">Thank you for registering for the event.</p>
            <p className="text-gray-700">redirecting to home page....</p>
        </div>
    );
}

export default RegisterSuccess;