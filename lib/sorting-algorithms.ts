// Helper function to create delay
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const swap = async (
  arr: number[],
  setArray: React.Dispatch<React.SetStateAction<number[]>>,
  i: number,
  j: number,
  delayTime: number
): Promise<number[]> => {
  const newArr = [...arr];
  await new Promise((resolve) => setTimeout(resolve, delayTime));
  [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  setArray(newArr); // Update array state
  await new Promise((resolve) => setTimeout(resolve, delayTime));
  return newArr;
};

// Bubble Sort
const bubbleSort = async (
  array: number[],
  setArray: React.Dispatch<React.SetStateAction<number[]>>,
  speed: number,
  setComparisons: React.Dispatch<React.SetStateAction<number>>,
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>,
  setSwappingIndices: React.Dispatch<React.SetStateAction<number[]>>
): Promise<number[]> => {
  let arr = [...array];
  const delayTime = 500 - speed; // Scale delay with speed
  const startTime = Date.now();
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      setSwappingIndices([-1, j, j + 1]);
      await delay(delayTime);
      setComparisons((prev) => prev + 1);
      if (arr[j] > arr[j + 1]) {
        arr = await swap(arr, setArray, j, j + 1, delayTime);
      }
    }
    setSwappingIndices([]);
  }

  setTimeElapsed(Date.now() - startTime); // Set time elapsed
  return arr;
};

// Quick Sort Implementation
const quickSort = async (
  array: number[],
  setArray: React.Dispatch<React.SetStateAction<number[]>>,
  speed: number,
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>,
  setComparisons: React.Dispatch<React.SetStateAction<number>>,
  setSwappingIndices: React.Dispatch<React.SetStateAction<number[]>>
): Promise<number[]> => {
  const delayTime = 500 - speed; // Scale delay with array size
  const startTime = Date.now();
  let arr = [...array];

  const partition = async (low: number, high: number): Promise<number> => {
    const pivot = arr[high];
    setSwappingIndices([high]);
    await delay(delayTime);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        setSwappingIndices([high, i, j]);
        await delay(delayTime);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setSwappingIndices([high]);
        setComparisons((prev) => prev + 1);
        await delay(delayTime);
      }
    }
    setSwappingIndices([high, i + 1, high]);
    await delay(delayTime);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await delay(delayTime);
    setSwappingIndices([]);
    return i + 1;
  };

  const quickSortHelper = async (low: number, high: number): Promise<void> => {
    if (low < high) {
      const pi = await partition(low, high);
      await quickSortHelper(low, pi - 1);
      await quickSortHelper(pi + 1, high);
    }
  };

  await quickSortHelper(0, arr.length - 1);
  setTimeElapsed(Date.now() - startTime);
  return arr;
};

// Heap Sort Implementation
const heapSort = async (
  array: number[],
  arraySize: number,
  setArray: React.Dispatch<React.SetStateAction<number[]>>,
  speed: number,
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>,
  setComparisons: React.Dispatch<React.SetStateAction<number>>
): Promise<number[]> => {
  const delayTime = 500 - speed; // Scale delay with array size
  const startTime = Date.now();
  let arr = [...array];

  const heapify = async (n: number, i: number): Promise<void> => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      setComparisons((prev) => prev + 1);
      await delay(delayTime);
      await heapify(n, largest);
    }
  };

  // Build max heap
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    await heapify(arr.length, i);
  }

  // Extract elements from heap
  for (let i = arr.length - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    setArray([...arr]);
    await delay(delayTime);
    await heapify(i, 0);
  }

  setTimeElapsed(Date.now() - startTime);
  return arr;
};

// Shell Sort
const shellSort = async (
  array: number[],
  arraySize: number,
  setArray: React.Dispatch<React.SetStateAction<number[]>>,
  speed: number,
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>,
  setComparisons: React.Dispatch<React.SetStateAction<number>>
): Promise<number[]> => {
  let arr = [...array];
  const delayTime = Math.max(1, (101 - speed) * (arraySize / 100)); // Scale delay with array size
  const startTime = Date.now();

  for (
    let gap = Math.floor(arr.length / 2);
    gap > 0;
    gap = Math.floor(gap / 2)
  ) {
    for (let i = gap; i < arr.length; i++) {
      const temp = arr[i];
      let j: number;

      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
        setArray([...arr]);
        setComparisons((prev) => prev + 1);
        await delay(delayTime);
      }

      arr[j] = temp;
      setArray([...arr]);
      await delay(delayTime);
    }
  }

  setTimeElapsed(Date.now() - startTime);
  return arr;
};

// Counting Sort
const countingSort = async (
  array: number[],
  arraySize: number,
  setArray: React.Dispatch<React.SetStateAction<number[]>>,
  speed: number,
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>,
  setComparisons: React.Dispatch<React.SetStateAction<number>>
): Promise<number[]> => {
  let arr = [...array];
  const delayTime = Math.max(1, (101 - speed) * (arraySize / 100)); // Scale delay with array size
  const startTime = Date.now();

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count: number[] = Array(range).fill(0);
  const output: number[] = Array(arr.length).fill(0);

  // Count occurrences
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
    setComparisons((prev) => prev + 1);
  }

  // Calculate cumulative count
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  // Build output array
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
    setArray([...output]);
    await delay(delayTime);
  }

  setTimeElapsed(Date.now() - startTime);
  return output;
};

// Selection Sort
const selectionSort = async (
  array: number[],
  arraySize: number,
  setArray: React.Dispatch<React.SetStateAction<number[]>>,
  speed: number,
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>,
  setComparisons: React.Dispatch<React.SetStateAction<number>>,
  setSwappingIndices: React.Dispatch<React.SetStateAction<number[]>>
): Promise<number[]> => {
  let arr = [...array];
  const delayTime = 500 - speed; // Scale delay with array size
  const startTime = Date.now();
  let comparisonsCount = 0; // Initialize comparisons count
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    setSwappingIndices([i]);
    await delay(delayTime);
    for (let j = i + 1; j < arr.length; j++) {
      comparisonsCount++;
      setComparisons(comparisonsCount);

      setSwappingIndices((prev) => [...prev, minIdx, j]);

      await delay(delayTime);

      // Comparison logic
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
      await new Promise((resolve) => setTimeout(resolve, delayTime)); // Delay for animation
      setSwappingIndices((prev) => [i]);
      await delay(delayTime);
    }
    if (minIdx !== i) {
      setSwappingIndices([-1, minIdx, i]); // Set indices for swapping
      await delay(delayTime);

      arr = await swap(arr, setArray, i, minIdx, delayTime);
    }
  }

  setTimeElapsed(Date.now() - startTime);
  setSwappingIndices([]);
  return arr;
};

// Insertion Sort
const insertionSort = async (
  array: number[],
  arraySize: number,
  setArray: React.Dispatch<React.SetStateAction<number[]>>,
  speed: number,
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>,
  setComparisons: React.Dispatch<React.SetStateAction<number>>,
  setSwappingIndices: React.Dispatch<React.SetStateAction<number[]>>
): Promise<number[]> => {
  let arr = [...array];
  const delayTime = 500 - speed; // Scale delay with array size
  const startTime = Date.now();

  for (let i = 1; i < arr.length; i++) {
    let j = i;
    setSwappingIndices([i]);
    await delay(delayTime);
    while (j > 0) {
      setSwappingIndices([i, j - 1, j]);
      await delay(delayTime);
      setComparisons((prev) => prev + 1);
      if (arr[j - 1] > arr[j]) {
        arr = await swap(arr, setArray, j, j - 1, delayTime);
      }
      j--;
      setSwappingIndices([i]);
      await delay(delayTime);
    }
  }

  setTimeElapsed(Date.now() - startTime);
  return arr;
};

// Merge Sort
const merge = async (
  arr: number[],
  setArray: React.Dispatch<React.SetStateAction<number[]>>,
  setComparisons: React.Dispatch<React.SetStateAction<number>>,
  start: number,
  mid: number,
  end: number,
  delayTime: number
): Promise<void> => {
  const left = arr.slice(start, mid + 1);
  const right = arr.slice(mid + 1, end + 1);
  let i = 0,
    j = 0,
    k = start;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    setArray([...arr]);
    setComparisons((prev) => prev + 1);
    await delay(delayTime);
    k++;
  }

  while (i < left.length) {
    arr[k] = left[i];
    setArray([...arr]);
    await delay(delayTime);
    i++;
    k++;
  }

  while (j < right.length) {
    arr[k] = right[j];
    setArray([...arr]);
    await delay(delayTime);
    j++;
    k++;
  }
};

const mergeSort = async (
  array: number[],
  arraySize: number,
  setArray: React.Dispatch<React.SetStateAction<number[]>>,
  speed: number,
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>,
  setComparisons: React.Dispatch<React.SetStateAction<number>>
): Promise<number[]> => {
  const delayTime = 500 - speed; // Scale delay with array size
  const startTime = Date.now();

  const mergeSortHelper = async (
    arr: number[],
    start: number,
    end: number
  ): Promise<void> => {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      await mergeSortHelper(arr, start, mid);
      await mergeSortHelper(arr, mid + 1, end);
      await merge(arr, setArray, setComparisons, start, mid, end, delayTime);
    }
  };

  let arr = [...array];
  await mergeSortHelper(arr, 0, arr.length - 1);
  setTimeElapsed(Date.now() - startTime);
  return arr;
};

export {
  quickSort,
  mergeSort,
  bubbleSort,
  shellSort,
  heapSort,
  insertionSort,
  selectionSort,
  countingSort,
};
