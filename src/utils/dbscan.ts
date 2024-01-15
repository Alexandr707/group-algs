interface GetCoordsCB<T> {
  (data: T): [number, number];
}

interface DistanceFn {
  (a: [number, number], b: [number, number]): number;
}

export const NOISE = -2;

type DBSCAN_Point = {
  point: [number, number];
  cluster?: number;
};

interface GroupType<T> {
  [key: string]: T[];
}

function squareDistanse(p1: [number, number], p2: [number, number]) {
  return Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2);
}

/**
 * метод объеденяет точки в группы основываясь на парамеирах плотности
 * @param data массив точек
 * @param eps отклонение (максимальное растояние)
 * @param min_points минимальное число точек
 * @param getCoords колбэк, извлекает координаты из переданного элемента массива
 * @param getDist метод для расчета дистанции
 */
export function dbscan<T>(
  data: T[],
  eps: number,
  min_points: number,
  getCoords: GetCoordsCB<T>,
  getDist = squareDistanse
) {
  const dataMap = new Map<DBSCAN_Point, T>();
  for (const elem of data) {
    dataMap.set({ point: getCoords(elem) }, elem);
  }

  const points = Array.from(dataMap.keys());

  let c = 0; //метка кластера
  for (const point of points) {
    if (point.cluster === NOISE) continue;
    if (point.cluster !== undefined) continue;

    // список всех соседей к данной точки
    const neighbors = rangeQuery(points, point, eps, getDist);
    if (neighbors.length < min_points) {
      point.cluster = NOISE;
      continue;
    }

    // если точка удовлетворяет условиям min_points, помечаем ее меткой кластера
    // и далее проверяем ее соседей по той жже схеме
    c += 1;
    point.cluster = c;

    const seed = neighbors;
    let index = 0;
    let seed_point = seed[index];
    // проверка соседей точки
    while (seed_point) {
      if (seed_point.cluster === NOISE) {
        seed_point.cluster = c;
        index++;
        seed_point = seed[index];
        continue;
      }
      if (seed_point.cluster !== undefined) {
        index++;
        seed_point = seed[index];
        continue;
      }

      seed_point.cluster = c;
      let neighbors_2 = rangeQuery(points, seed_point, eps, getDist);
      //если соседняя точка удовлетворяет условиям плотности
      //добавляем ее новых соседей в конец маассива seed
      if (neighbors_2.length >= min_points) {
        neighbors_2 = neighbors_2.filter((nb) => !seed.includes(nb));
        seed.push(...neighbors_2);
      }

      index++;
      seed_point = seed[index];
    }
  }

  const groups: GroupType<T> = {};
  points.forEach((p) => {
    if (!p.cluster) p.cluster = -3;
    if (!groups[p.cluster]) groups[p.cluster] = [];
    groups[p.cluster].push(dataMap.get(p)!);
  });

  return groups;
}

/**
 * поиск всех соседей точки, которые удовлетворяют условиям плотности
 */
function rangeQuery(
  points: DBSCAN_Point[],
  point: DBSCAN_Point,
  eps: number,
  getDist: DistanceFn
) {
  const neighbors = [];
  const _eps = eps * eps;
  for (const p2 of points) {
    const dist = getDist(point.point, p2.point);
    if (dist && dist < _eps) neighbors.push(p2);
  }
  return neighbors;
}
