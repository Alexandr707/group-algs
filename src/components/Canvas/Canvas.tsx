import React, { FC, useEffect, useRef } from 'react';
import { Canvas as Cnv } from '../../classes/Canvas';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../constants/canvasVars';

export type CanvasPointType = {
  coords: [number, number];
  color: string;
};

interface CanvasPropsType
  extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  id: string;
  clearColor?: string;
  currentColor?: string;
  groups: CanvasPointType[][];
}

export const Canvas: FC<CanvasPropsType> = ({
  groups,
  id,
  clearColor = '#1F1F1F',
  currentColor = '#ccc',
  ...props
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const cnv = new Cnv('#' + id, clearColor, currentColor);

    cnv.clearCanvas();

    for (const points of groups)
      for (const point of points) {
        const [x, y] = point.coords;
        cnv.drawPoint(x, y, 2, point.color);
      }
  }, [groups, id, clearColor, currentColor]);

  return (
    <canvas
      ref={canvasRef}
      {...props}
      id={id}
      width={props.width ? props.width : CANVAS_WIDTH}
      height={props.height ? props.height : CANVAS_HEIGHT}
    >
      Извините, ваш браузер нет поддерживает&lt;canvas&gt; элемент.
    </canvas>
  );
};
