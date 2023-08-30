import React from 'react';

export default function GameSvg({ gameData, color }) {
  const gameArray = JSON.parse(gameData);

  const padding = 3;
  const width = 100;

  const lines = [
    [[0, width / 3], [width, width / 3]],
    [[0, 2 * width / 3], [width, 2 * width / 3]],
    [[width / 3, 0], [width / 3, width]],
    [[2 * width / 3, 0], [2 * width / 3, width]]
  ];

  return (
    <svg width={width+2*padding} height={width+2*padding} viewBox={`${-(padding)} ${-(padding)} ${width+2*padding} ${width+2*padding}`}>
      {/* Rectangle outlining the SVG */}
      <rect x="0" y="0" width={width} height={width} fill="none" stroke={color} strokeWidth="2" />

      {/* Vertical and horizontal lines */}
      {lines.map(([[x1, y1], [x2, y2]], index) => (
        <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} />
      ))}

      {/* Squares based on array values */}
      {gameArray.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell.value ? (
            <rect
              key={`${rowIndex}-${colIndex}`}
              y={(width / 9) * rowIndex}
              x={(width / 9) * colIndex}
              width={width / 9}
              height={width / 9}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
}
