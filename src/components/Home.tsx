import { useRef } from "react";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-zinc-950 h-[50%] w-[50%] md:w-[35%] rounded-xl flex justify-center items-center">
        <div className="flex flex-col  items-center gap-8">
        <input type="text" ref={inputRef} placeholder="Enter a Prompt" className="text-gray-600 text-center border-2 w-[45vw] md:w-[30vw] rounded-md bg-red-50 p-2" />
        <button className="text-gray-500 border-2 border-zinc-500 shadow-md shadow-zinc-600 hover:bg-zinc-700 w-full  md:w-[70%] md:p-1" onClick={()=>{
            const prompt = inputRef.current?.value
            navigate("/dashboard",{state:{prompt}})
        }}>Generate a Website</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
