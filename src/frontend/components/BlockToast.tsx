import React from 'react';

function BlockToast({message}: { message?: string }) {
  return <h1 className='block-toast'>{message ? message : 'Loading...'}</h1>
}

export {BlockToast};