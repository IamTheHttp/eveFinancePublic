import React from "react";

function Panel(props: { children: React.ReactNode, columns: number, title?:string, id?:string, style?:Record<string, any> }) {
  return (
    <div className={`col-lg-${props.columns}`}>
      <div className='panel' id={props.id} style={props.style}>
        <h3 className='panel__title'>{props.title}</h3>
        <div className='panel__content'>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export {Panel}