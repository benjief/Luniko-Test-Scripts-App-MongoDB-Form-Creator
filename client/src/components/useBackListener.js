// Code taken from https://stackoverflow.com/questions/71369320/how-to-controling-browser-back-button-with-react-router-dom-v6
import {useContext, useEffect} from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";

const useBackListener = (callback) => {
  const navigator = useContext(UNSAFE_NavigationContext).navigator;

  useEffect(() => {
    const listener = ({ location, action }) => {
      // console.log("listener", { location, action });
      if (action === "POP") {
        callback({ location, action });
      }
    };

    const unlisten = navigator.listen(listener);
    return unlisten;
  }, [callback, navigator]);
};

export {
  useBackListener
} 