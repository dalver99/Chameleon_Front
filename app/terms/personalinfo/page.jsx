'use client'

import { useEffect, useState } from "react";

export default function Page() {
  const [text, setText] = useState();
  useEffect(() => {
    fetch('/personalinfo.txt')
    .then(res => res.text())
    .then(t => setText(t))
    .catch(e => console.error('Error loading file', e));
  }, []);

  return (
    <>{text}</>
  );
};