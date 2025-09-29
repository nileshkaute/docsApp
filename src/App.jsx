import React from 'react';
import Background from './components/Background';
import Forground from './components/Forground';

const App = () => {
  return (
    <div className='relative w-full h-screen flex bg-zinc-900'>
      <Background />
      <Forground />
    </div>
  );
};

export default App;
