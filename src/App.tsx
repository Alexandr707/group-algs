import { useEffect, useState } from 'react';
import { Col, InputNumber, Layout, Row } from 'antd';

import { DBSCAN } from './components/DBSCAN/DBSCAN.tsx';
import generatePoints from './utils/generatePoints';
import { PointType } from 'types/PointType';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants/canvasVars';

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
        <Col className='side'>
          Points count&nbsp;
          <InputNumber
            value={num}
            onChange={(val) => val && setNum(val)}
            min={3}
          />
        </Col>
      </Row>
      <DBSCAN points={points} />
      <Row>
        <Col className={'side'} span={4}>
          2
        </Col>
        <Col className={'content'} span={20}>
          4
        </Col>
      </Row>
    </Layout>
  );
}

export default App;

