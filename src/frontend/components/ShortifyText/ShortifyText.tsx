import React from "react";

/**
 * Shotifies a text by showing the last 6 characters.
 * Adds an onclick event to alert the full text
 * @param props
 * @constructor
 */
export function ShortifyText(props: {value: any}) {
  return <div style={{cursor:'info'}}  onClick={ async (e) => {
    alert(props.value);
  }}>
    <span className={'item-value'}>...{props.value.slice(-6)}</span>
  </div>
}

