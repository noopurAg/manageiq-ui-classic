import { useRef, useEffect } from 'react';

var useIsMounted = function useIsMounted() {
  var isMounted = useRef(false);
  useEffect(function () {
    isMounted.current = true;
    return function () {
      return isMounted.current = false;
    };
  }, []);
  return isMounted;
};

export default useIsMounted;