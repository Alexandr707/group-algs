// Функция для расчета квадрата расстояния между двумя точками
function squareDistance(point1: [number, number], point2: [number, number]) {
  return (
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  );
}

// Функция инициализации случайных центроидов
function initRandomCentroids<T>(
  points: KMKPointType<T>[],
  k: number
): CentroidType<T>[] {
  const centroids = [];
  for (let i = 0; i < k; i++) {
    const index = Math.floor(Math.random() * points.length);
    const point = { ...points[index] };
    point.clusterIndex = i + 1;
    const { coords, clusterIndex } = point;
    centroids.push({ coords, clusterIndex });
  }
  return centroids;
}

// Функция обновления центроидов и принадлежности объектов к кластерам
/**
 * поиск ближайшего кластера .
 * метод возвращает метку ближайшего кластера
 */
function updateCluster<T>(
  centroids: CentroidType<T>[],
  point: KMKPointType<T>
) {
  let closestCentroidIndex = -1;
  let minDistance = Number.MAX_VALUE;
  for (const centroid of centroids) {
    const distance = squareDistance(centroid.coords, point.coords);
    if (distance < minDistance) {
      minDistance = distance;
      closestCentroidIndex = centroids.indexOf(centroid);
    }
  }
  return centroids[closestCentroidIndex].clusterIndex || -1;
}

interface KMKPointType<T> {
  data: T;
  coords: [number, number];
  clusterIndex: number;
}

interface CentroidType<T> extends Omit<KMKPointType<T>, 'data'> {}

/**
 * Основная функция K-means
 *
 *
 * алгоритм k-средних, разбивает массив точек __data__ на кластеры,
 * точнее к каждому елеменьу массива добавляет свойство __clusterIndex__,
 * означающее к какому кластеру относится элемент.
 *
 *
 * @param {[x:number, y: number][]} data массив точек
 * @param {number} k число клачтеров
 * @param {number} maxIterations максимальное число итераций
 * @param {number} epsilon минимальное отклонение, при достижении которого алгоритм останавливается до maxIterations
 * @returns
 */
export function kMeans<T>(
  data: T[],
  k: number,
  maxIterations: number,
  epsilon: number,
  getCoords: (d: T) => [number, number]
) {
  const points: KMKPointType<T>[] = data.map((d) => ({
    data: d,
    coords: getCoords(d),
    clusterIndex: -1,
  }));

  if (points.length <= k || maxIterations <= 0) {
    return { '-1': data };
  }

  let initCentroids = initRandomCentroids(points, k);
  let iterations = 0;
  let changes = data.length;
  while (iterations < maxIterations && !converged(points, changes, epsilon)) {
    iterations += 1;
    changes = 0;
    for (const datum of points) {
      /** получение метки ближайшего кластера, и помечаем точку меткой */
      const cidx = updateCluster(initCentroids, datum);
      if (cidx !== datum.clusterIndex) {
        changes += 1;
        datum.clusterIndex = cidx;
      }
    }

    const newCentroids = getNewCentroids(points);

    initCentroids = newCentroids;
  }

  return points.reduce<{ [key: string]: T[] }>((acc, el) => {
    if (!acc[el.clusterIndex]) acc[el.clusterIndex] = [];
    acc[el.clusterIndex].push(el.data);
    return acc;
  }, {});
}
/** если количество изменений метки кластера точек меньше  __epsilon * points.length__
 * значит алгоритм достиг допустимого отклонения
 * и можнл завершать расчет не дожидаясь максимального числа итерааций
 */
function converged<T>(
  points: KMKPointType<T>[],
  changes: number,
  epsilon: number
) {
  return changes < epsilon * points.length;
}

/**
 * вычисление координат центров кластеров
 */
function getNewCentroids<T>(data: KMKPointType<T>[]): CentroidType<T>[] {
  const groupse = data.reduce<{ [key: string]: KMKPointType<T>[] }>(
    (acc, el) => {
      if (!acc[el.clusterIndex]) acc[el.clusterIndex] = [];
      acc[el.clusterIndex].push(el);
      return acc;
    },
    {}
  );

  const newCentroids = Object.values(groupse).map((groupe) => {
    let sum_x = 0;
    let sum_y = 0;
    const clusterIndex = groupe[0].clusterIndex;
    for (const datum of groupe) {
      sum_x += datum.coords[0];
      sum_y += datum.coords[1];
    }

    const coords: [number, number] = [
      sum_x / groupe.length,
      sum_y / groupe.length,
    ];
    const result: CentroidType<T> = { coords, clusterIndex };
    result.clusterIndex = clusterIndex;

    return result;
  });

  return newCentroids;
}
