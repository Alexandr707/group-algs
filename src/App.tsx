import { useEffect, useState } from 'react';
import { Col, InputNumber, Layout, Row, Space } from 'antd';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants/canvasVars';
import { DBSCAN } from './components/DBSCAN/DBSCAN.tsx';
import generatePoints from './utils/generatePoints';
import KMeans from './components/KMeans/KMeans.tsx';
import { PointType } from 'types/PointType';

import './App.css';

function App() {
  const [num, setNum] = useState(30);
  const [points, setPoints] = useState<PointType[]>([]);

  useEffect(() => {
    const pointsList = generatePoints(num, CANVAS_WIDTH, CANVAS_HEIGHT);
    setPoints(pointsList);
  }, [num]);

  return (
    <Layout>
      <Row>
        <Col
          className='side'
          span={4}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Space direction='horizontal' className='space-between'>
            <span>Points count</span>
            <InputNumber
              value={num}
              onChange={(val) => val && setNum(val)}
              min={3}
            />
          </Space>
        </Col>
      </Row>
      <DBSCAN points={points} />
      <KMeans points={points} />
    </Layout>
  );
}

export default App;

