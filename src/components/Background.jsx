import React from 'react';

const Background = () => {
  return (
    <div className='fixed z-[2] w-full h-screen'>
      <nav className='absolute top-[-5%] w-full py-10 flex justify-center text-zinc-700 text-2xl font-semibold'>
        Documents.
      </nav>
      <h1 className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[13vw] font-bold tracking-tight leading-[1.1] text-zinc-800'>
        Docs.
      </h1>
    </div>
  );
};

export default Background;
