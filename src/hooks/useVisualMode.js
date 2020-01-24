import { useState } from "react";


export default function useVisualMode(initialMode) {
  let [mode, setMode] = useState(initialMode);
  let [history, setHistory] = useState([initialMode]);
  
  const transition = function(newMode, replace = false) {
    if (replace) {
      mode = setMode(newMode);
      history.pop();
      setHistory([...history, newMode]);
    } else {
      mode = setMode(newMode);
      setHistory([...history, newMode]); 
    }
  }

  const back = function() {
    if (history.length > 1) {
      history.pop()
      mode = setMode(history[history.length - 1]);
    }
  }
  
  return { 
    mode,
    transition,
    back };
} 