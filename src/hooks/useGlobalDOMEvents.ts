import {createEffect} from 'react'

type Props = {
  [key in keyof WindowEventMap]?: EventListenerOrEventListenerObject
}

export default function useGlobalDOMEvents(props: Props) {
  return createEffect(() => {
    for (const [eventKey, fn] of Object.entries(props)) {
      window.addEventListener(eventKey, fn, false);
    }
    return () => {
      for (const [eventKey, fn] of Object.entries(props)) {
        window.removeEventListener(eventKey, fn, false);
      }
    }
  }, []);
}
