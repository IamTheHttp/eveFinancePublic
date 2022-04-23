import React from "react";

function Page(props: {children: React.ReactNode, title?: string}) {
  return <div className='container-fluid page'>
    <h1>{props.title}</h1>
    {props.children}
  </div>
}

export {Page}