import { Col, InputNumber, Row, Slider, SliderSingleProps, Space } from 'antd';
import { FC, useEffect, useState } from 'react';
import { PointType } from 'types/PointType';
import { kMeans } from '../../utils/k-means';
import { Canvas, CanvasPointType } from '../Canvas/Canvas.tsx';
import { colors } from '../../constants/colors';

import './KMeans.css';

type kMeansPropsType = {
  points: PointType[];
};

const KMeans: FC<kMeansPropsType> = ({ points }) => {
  const [clustersCount, setClustersCount] = useState(3);
  const [iterations, setIterations] = useState(10);
  const [epsilon, setEpsilon] = useState(0.001);
  const [groups, setGroupse] = useState<CanvasPointType[][]>([]);

  const marks: SliderSingleProps['marks'] = {
    1: '1',
    40: '40',
    [clustersCount]: clustersCount.toString(),
  };

  useEffect(() => {
    const res = kMeans(points, clustersCount, iterations, epsilon, (el) => el);
    const cp = Object.keys(res).map((key) =>
      res[key].map((p): CanvasPointType => {
        const color = colors[+key % colors.length];
        return { coords: p, color };
      })
    );
    setGroupse(cp);
  }, [points, clustersCount, iterations, epsilon]);

  return (
    <>
      <Row className='title'>
        <h2>KMeans</h2>
      </Row>
      <Row>
        <Col className={'side'} span={4}>
          <Space className='km-block' direction='vertical'>
            <span>Clusters number</span>
            <Slider
              value={clustersCount}
              onChange={(e) => e && setClustersCount(e)}
              min={1}
              max={40}
              marks={marks}
              tooltip={{ formatter: null }}
            />
          </Space>

          <Space className='km-block' direction='horizontal'>
            <span>Iterations</span>
            <InputNumber
              value={iterations}
              onChange={(e) => e && setIterations(e)}
              min={1}
            />
          </Space>

          <Space className='km-block' direction='horizontal'>
            <span>Epsilon</span>
            <InputNumber
              value={epsilon}
              onChange={(e) => e && setEpsilon(e)}
              min={0.0001}
              max={1}
              step={0.0001}
            />
          </Space>
        </Col>
        <Col className={'content'} span={20}>
          <Canvas id='k-mean' groups={groups} />
        </Col>
      </Row>
    </>
  );
};

export default KMeans;
