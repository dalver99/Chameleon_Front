'use client';

import React, { createContext, useState } from 'react';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [curMark, setCurMark] = useState(null);
  const [markers, setMarkers] = useState([]);

  return (
    <MapContext.Provider value={{ curMark, setCurMark, markers, setMarkers }}>
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
