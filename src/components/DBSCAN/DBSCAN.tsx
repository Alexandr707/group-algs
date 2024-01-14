import { FC, useEffect, useState } from 'react';
import { Col, InputNumber, Row, Slider, SliderSingleProps, Space } from 'antd';

import { Canvas, CanvasPointType } from '../Canvas/Canvas';
import { colors } from '../../constants/colors';
import { NOISE, dbscan } from '../../utils/dbscan';
import { PointType } from 'types/PointType';

type DBSCANPropsType = {
  points: PointType[];
};

export const DBSCAN: FC<DBSCANPropsType> = ({ points }) => {
  const [density, setDensity] = useState(2);
  const [eps, setEps] = useState(15);
  const [groups, setGroups] = useState<CanvasPointType[][]>([]);

  const marks: SliderSingleProps['marks'] = {
    2: '2',
    30: '30',
    [density]: density.toString(),
    100: {
      style: { color: '#f50' },
      label: <strong>100°C</strong>,
    },
  };

  useEffect(() => {
    const result = dbscan(points, eps, density, (el) => el);

    const gr: CanvasPointType[][] = Object.keys(result).map((key) =>
      result[key].map((p): CanvasPointType => {
        const color =
          p.cluster === NOISE ? '#333' : colors[p.cluster % colors.length];
        return {
          coords: p.point,
          color,
        };
      })
    );
    setGroups(gr);
  }, [points, eps, density]);

  return (
    <Row>
      <Col className={'side'} span={4}>
        <Space direction='vertical'>
          <div>
            Epsilum{' '}
            <InputNumber
              value={eps}
              onChange={(val) => val && setEps(val)}
              min={1}
            />
          </div>
          <Slider
            value={density}
            onChange={(val) => val && setDensity(val)}
            min={2}
            max={30}
            tooltip={{ formatter: null }}
            marks={marks}
          />
        </Space>
      </Col>
      <Col className={'content'} span={20}>
        <Canvas id='dbscan' groups={groups} />
      </Col>
    </Row>
  );
};
