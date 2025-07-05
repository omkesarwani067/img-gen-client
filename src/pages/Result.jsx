// import React, { useContext, useState } from 'react';
// import { assets } from '../assets/assets';
// import { motion } from "framer-motion";
// import { AppContext } from '../context/AppContext';
// import MetaBalls from '../Components/MetaBalls';

// const Result = () => {
//   const [image, setImage] = useState(assets.sample_img_1);
//   const [isImageLoaded, setIsImageLoaded] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [input, setInput] = useState('');

//   const { generateImage } = useContext(AppContext);

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (input) {
//       const newImage = await generateImage(input);
//       if (newImage) {
//         setIsImageLoaded(true);
//         setImage(newImage);
//       }
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-black bg-gradient-to-b from-black-100 to-green-800">
//       {/* Two Animated MetaBalls side by side */}
//       <div className="absolute inset-0 z-0 pointer-events-none flex">
//         <MetaBalls
//           color="#00ffff"
//           cursorBallColor="#ffffff"
//           enableTransparency={true}
//           ballCount={25}
//           clumpFactor={1.5}
//           animationSize={40}
//           speed={0.4}
//           enableMouseInteraction={true}
//           className="w-1/2" // Half width for left MetaBalls
//         />
//         <MetaBalls
//           color="#ff00ff"
//           cursorBallColor="#ffffff"
//           enableTransparency={true}
//           ballCount={25}
//           clumpFactor={1.5}
//           animationSize={40}
//           speed={0.4}
//           enableMouseInteraction={true}
//           className="w-1/2" // Half width for right MetaBalls
//         />
//       </div>

//       {/* Foreground UI */}
//       <motion.form
//         initial={{ opacity: 0.2, y: 100 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//         onSubmit={onSubmitHandler}
//         className="relative z-10 flex flex-col justify-center items-center w-full px-4"
//       >
//         <div>
//           <div className="relative">
//             <img src={image} alt="Generated" className='max-w-sm rounded shadow-lg' />
//             <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} />
//           </div>
//           <p className={!loading ? 'hidden' : 'text-white mt-2'}>Loading...</p>
//         </div>

//         {!isImageLoaded && (
//           <div className='flex w-full max-w-xl bg-neutral-700/80 backdrop-blur text-white text-sm p-1 mt-10 rounded-full'>
//             <input
//               onChange={e => setInput(e.target.value)}
//               value={input}
//               type="text"
//               placeholder='Describe what you want to generate'
//               className='flex-1 bg-transparent outline-none px-4 placeholder-white'
//             />
//             <button
//               type='submit'
//               className='bg-zinc-900 px-6 sm:px-10 py-2 rounded-full'
//             >
//               Generate
//             </button>
//           </div>
//         )}

//         {isImageLoaded && (
//           <div className='flex gap-4 flex-wrap justify-center text-white text-sm mt-10'>
//             <button
//               onClick={() => setIsImageLoaded(false)}
//               className='border border-zinc-900 bg-white text-black px-8 py-3 rounded-full'
//             >
//               Generate Another
//             </button>
//             <a
//               href={image}
//               download
//               className='bg-zinc-900 px-10 py-3 rounded-full'
//             >
//               Download
//             </a>
//           </div>
//         )}
//       </motion.form>
//     </div>
//   );
// };

// export default Result;
// 

// update 2 with moving loading
import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { motion } from "framer-motion";
import { AppContext } from '../context/AppContext';
import MetaBalls from '../Components/MetaBalls';

const LoadingLetters = () => {
  const text = 'Loading';
  const angleOffset = 360 / text.length;

  return (
    <div className="relative mx-auto mt-6"
      style={{
        width: '64px',
        height: '64px',
      }}
    >
      {text.split('').map((letter, index) => {
        const angle = angleOffset * index;
        return (
          <span
            key={index}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transformOrigin: '0 50%',
              transform: `rotate(${angle}deg) translate(24px) rotate(-${angle}deg)`,
              animation: `spin 1.5s linear infinite`,
              animationDelay: `${index * 0.15}s`,
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
              userSelect: 'none',
            }}
          >
            {letter}
          </span>
        );
      })}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg) translate(24px) rotate(0deg); }
            100% { transform: rotate(360deg) translate(24px) rotate(-360deg); }
          }

          @media (max-width: 640px) {
            div[style] {
              width: 48px !important;
              height: 48px !important;
            }
            div[style] span {
              font-size: 12px !important;
              transform: rotate(var(--angle)) translate(18px) rotate(calc(-1 * var(--angle)));
            }
          }
        `}
      </style>
    </div>
  );
};

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input) {
      const newImage = await generateImage(input);
      if (newImage) {
        setIsImageLoaded(true);
        setImage(newImage);
      }
    }

    setLoading(false);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-black bg-gradient-to-b from-black-50 to-green-800 px-4">
      {/* Two Animated MetaBalls side by side */}
      <div className="absolute inset-0 z-0 pointer-events-none flex">
        <MetaBalls
          color="#00ffff"
          cursorBallColor="#ffffff"
          enableTransparency={true}
          ballCount={25}
          clumpFactor={1.5}
          animationSize={40}
          speed={0.4}
          enableMouseInteraction={true}
          className="w-1/2"
        />
        <MetaBalls
          color="#ff00ff"
          cursorBallColor="#ffffff"
          enableTransparency={true}
          ballCount={25}
          clumpFactor={1.5}
          animationSize={40}
          speed={0.4}
          enableMouseInteraction={true}
          className="w-1/2"
        />
      </div>

      {/* Foreground UI */}
      <motion.form
        initial={{ opacity: 0.2, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        onSubmit={onSubmitHandler}
        className="relative z-10 flex flex-col justify-center items-center w-full max-w-md"
      >
        <div className="relative w-full">
          <img
            src={image}
            alt="Generated"
            className="w-full max-w-full rounded shadow-lg object-contain max-h-[60vh] mx-auto"
          />
        </div>

        {loading && <LoadingLetters />}

        {!isImageLoaded && !loading && (
          <div className="flex w-full bg-neutral-700/80 backdrop-blur text-white text-sm p-1 mt-10 rounded-full">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Describe what you want to generate"
              className="flex-1 bg-transparent outline-none px-4 placeholder-white"
            />
            <button
              type="submit"
              className="bg-zinc-900 px-6 sm:px-10 py-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              Generate
            </button>
          </div>
        )}

        {isImageLoaded && !loading && (
          <div className="flex gap-4 flex-wrap justify-center text-white text-sm mt-10">
            <button
              onClick={() => setIsImageLoaded(false)}
              className="border border-zinc-900 bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              Generate Another
            </button>
            <a
              href={image}
              download
              className="bg-zinc-900 px-10 py-3 rounded-full hover:bg-zinc-800 transition-colors"
            >
              Download
            </a>
          </div>
        )}
      </motion.form>
    </div>
  );
};

export default Result;
