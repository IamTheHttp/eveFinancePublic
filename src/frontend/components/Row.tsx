import React from "react";

function Row(props: {children: React.ReactNode}) {
  return <div className='row'>
    {props.children}
  </div>
}

export {Row}