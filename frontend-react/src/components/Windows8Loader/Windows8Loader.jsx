// src/components/Windows8Loader/Windows8Loader.jsx
import React from 'react';
import './Windows8Loader.css';

const Windows8Loader = () => (
  <div className="windows8">
    {[1, 2, 3, 4, 5].map((n) => (
      <div className="wBall" id={`wBall_${n}`} key={n}>
        <div className="wInnerBall"></div>
      </div>
    ))}
  </div>
);

export default Windows8Loader;