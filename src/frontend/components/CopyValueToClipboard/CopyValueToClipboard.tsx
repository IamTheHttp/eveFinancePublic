import React from "react";

export function CopyValueToClipboard(props: {value: any, classNames?: string}) {
  return <div style={{cursor:'copy'}}  onClick={ async (e) => {
    const textToCopy = e.currentTarget.querySelector('.item-value').innerHTML

    const type = 'text/plain';
    const blob = new Blob([textToCopy], { type });

    // @ts-ignore
    const cbi = new window.ClipboardItem({
      [type]: blob
    });

    // @ts-ignore
    await navigator.clipboard.write([cbi]);

  }}>
    <span className={`item-value ${props.classNames}`}>{props.value}</span><span style={{fontSize:'10px', color:'white', display:'inline-block'}}>(copy)</span>
  </div>
}

