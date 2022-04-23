import React, {useEffect, useRef, useState} from "react";
import {FORMS} from "./forms.interfaces";

export function EditableValue(props: FORMS["COMPONENTS"]["EditableValue"]) {
  const {initialValue, onChange} = props;

  const [isFocused, setIsFocused] = useState(false);
  const [fieldValue, setFieldValue] = useState(initialValue);

  function saveChanges(value: number | string) {
    setIsFocused(false);
    if (value !== initialValue) {
      onChange(value);
    }
  }

  const spanRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    function blurOnClickOut(e: MouseEvent) {
      if (e.target === spanRef.current || e.target === inputRef.current) {
        // Do nothing if the click was on the span or on the input
      } else {
        saveChanges(fieldValue);
      }
    }

    function blurOnEnter(e: KeyboardEvent) {
      if (e.key === "Enter") {
        saveChanges(fieldValue);
      }
    }


    document.addEventListener('click', blurOnClickOut);
    document.addEventListener('keyup', blurOnEnter);

    return () => {
      document.removeEventListener('click', blurOnClickOut);
      document.removeEventListener('keyup', blurOnEnter);
    }
  }, [fieldValue]);

  if (!isFocused) {
    return (<span
      style={{display:"inline-block", width:"30%"}}
      ref={spanRef}
      onClick={() => {
        // delay the state change by one tick to allow the onClick methods to catch up
        setTimeout(() => {
          setIsFocused(true);
          // @ts-ignore
          inputRef?.current?.focus();
        });
      }}
    >{fieldValue}</span>)
  } else {
    return <input
      ref={inputRef}
      style={{maxWidth: '30%'}}
      onChange={(e) => {
        setFieldValue(e.target.value);
      }}
      defaultValue={fieldValue}
    />
  }
}
