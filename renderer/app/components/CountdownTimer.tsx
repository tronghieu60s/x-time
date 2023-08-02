import { countdownTimer } from '@/core/commonFuncs';
import React, { Fragment, useEffect, useState } from 'react';

type Props = {
  timer: number;
  onEnd?: () => void;
};

export default function CountdownTimer(props: Props) {
  const { timer, onEnd } = props;
  const [remaining, setRemaining] = useState('00:00:00');

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime(timer);
    }, 1000);
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  function updateRemainingTime(countdown) {
    const timer = countdownTimer(countdown * 1000);
    if (isNaN(Number(timer.seconds))) {
      onEnd && onEnd();
      return setRemaining('00:00:00');
    }
    setRemaining(`${timer.hours}:${timer.minutes}:${timer.seconds}`);
  }

  return <Fragment>{remaining}</Fragment>;
}
