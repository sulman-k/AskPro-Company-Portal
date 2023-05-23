import React, { useEffect, useMemo } from "react";
import { useState } from "react";

const TestComponent = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(12);
  const [c, setC] = useState(5);

  useEffect(() => {
    console.log("No Dependency");
  }, []);

  const memo = useMemo(
    function increasing() {
      console.log("Memo with c: ", c);
      return setC(c * 2);
    },
    [c]
  );
  function increasing() {
    console.log("Memo with c this: ", c);
    return setC(c * 2);
  }

  //   useEffect(() => {
  //     console.log("No Dependency Array");
  //   });

  useEffect(() => {
    console.log("Only a changes");
  }, [a]);

  useEffect(() => {
    console.log("b  changes");
  }, [b]);

  const changeState = () => {
    setA(a + 1);
    setB(b + 1);
    setC(c + 1);
  };
  return (
    <div>
      A: {a}
      <br />
      B: {b}
      <br />
      C: {c}
      <br />
      <h1>{memo}</h1>
      <button onClick={changeState}>Change State</button>
      <button onClick={() => setA(a + 1)}>a</button>
      <button onClick={() => setB(b + 1)}>b</button>
      <button onClick={() => setC(c + 1)}>c</button>
    </div>
  );
};

export default TestComponent;
