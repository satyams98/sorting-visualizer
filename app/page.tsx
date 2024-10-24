"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type SortingAlgorithm = 'quick' | 'heap' | 'shell' | 'counting' | 'bubble' | 'selection' | 'insertion' | 'merge';

interface SortingState {
  array: number[];
  sorting: boolean;
  algorithm: SortingAlgorithm;
  arraySize: number;
  speed: number;
  timeElapsed: number;
  comparisons: number;
}

const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState<boolean>(false);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('quick');
  const [arraySize, setArraySize] = useState<number>(100);
  const [speed, setSpeed] = useState<number>(50);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [comparisons, setComparisons] = useState<number>(0);

  // Generate random array
  const generateArray = useCallback((): void => {
    const newArray: number[] = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100000) + 1
    );
    setArray(newArray);
    setTimeElapsed(0);
    setComparisons(0);
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Helper function to create delay
  const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

  // Swap function for animations
  const swap = async (arr: number[], i: number, j: number, delayTime: number): Promise<number[]> => {
    const newArr = [...arr];
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    setArray(newArr);
    setComparisons(prev => prev + 1);
    await delay(delayTime);
    return newArr;
  };

  // Bubble Sort
  const bubbleSort = async (): Promise<number[]> => {
    let arr = [...array];
    const delayTime = Math.max(1, (101 - speed) * (arraySize / 100));  // Scale delay with array size
    const startTime = Date.now();

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          arr = await swap(arr, j, j + 1, delayTime);
        }
      }
    }

    setTimeElapsed(Date.now() - startTime);
    return arr;
  };

  // Quick Sort Implementation
  const quickSort = async (): Promise<number[]> => {
    const delayTime = Math.max(1, (101 - speed) * (arraySize / 100));  // Scale delay with array size
    const startTime = Date.now();
    let arr = [...array];

    const partition = async (low: number, high: number): Promise<number> => {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          setComparisons(prev => prev + 1);
          await delay(delayTime);
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await delay(delayTime);
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
  const heapSort = async (): Promise<number[]> => {
    const delayTime = Math.max(1, (101 - speed) * (arraySize / 100));  // Scale delay with array size
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
        setComparisons(prev => prev + 1);
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
  const shellSort = async (): Promise<number[]> => {
    let arr = [...array];
    const delayTime = Math.max(1, (101 - speed) * (arraySize / 100));  // Scale delay with array size
    const startTime = Date.now();

    for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < arr.length; i++) {
        const temp = arr[i];
        let j: number;

        for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
          arr[j] = arr[j - gap];
          setArray([...arr]);
          setComparisons(prev => prev + 1);
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
  const countingSort = async (): Promise<number[]> => {
    let arr = [...array];
    const delayTime = Math.max(1, (101 - speed) * (arraySize / 100));  // Scale delay with array size
    const startTime = Date.now();

    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count: number[] = Array(range).fill(0);
    const output: number[] = Array(arr.length).fill(0);

    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
      count[arr[i] - min]++;
      setComparisons(prev => prev + 1);
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
  const selectionSort = async (): Promise<number[]> => {
    let arr = [...array];
    const delayTime = Math.max(1, (101 - speed) * (arraySize / 100));  // Scale delay with array size
    const startTime = Date.now();

    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        arr = await swap(arr, i, minIdx, delayTime);
      }
    }

    setTimeElapsed(Date.now() - startTime);
    return arr;
  };

  // Insertion Sort
  const insertionSort = async (): Promise<number[]> => {
    let arr = [...array];
    const delayTime = Math.max(1, (101 - speed) * (arraySize / 100));  // Scale delay with array size
    const startTime = Date.now();

    for (let i = 1; i < arr.length; i++) {
      let j = i;
      while (j > 0 && arr[j - 1] > arr[j]) {
        arr = await swap(arr, j, j - 1, delayTime);
        j--;
      }
    }

    setTimeElapsed(Date.now() - startTime);
    return arr;
  };

  // Merge Sort
  const merge = async (arr: number[], start: number, mid: number, end: number, delayTime: number): Promise<void> => {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      setArray([...arr]);
      setComparisons(prev => prev + 1);
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

  const mergeSort = async (): Promise<number[]> => {
    const delayTime = Math.max(1, (101 - speed) * (arraySize / 100));  // Scale delay with array size
    const startTime = Date.now();

    const mergeSortHelper = async (arr: number[], start: number, end: number): Promise<void> => {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSortHelper(arr, start, mid);
        await mergeSortHelper(arr, mid + 1, end);
        await merge(arr, start, mid, end, delayTime);
      }
    };

    let arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
    setTimeElapsed(Date.now() - startTime);
    return arr;
  };

  const startSort = async (): Promise<void> => {
    setSorting(true);

    switch (algorithm) {
      case 'quick':
        await quickSort();
        break;
      case 'heap':
        await heapSort();
        break;
      case 'shell':
        await shellSort();
        break;
      case 'counting':
        await countingSort();
        break;
      case 'bubble':
        await bubbleSort();
        break;
      case 'selection':
        await selectionSort();
        break;
      case 'insertion':
        await insertionSort();
        break;
      case 'merge':
        await mergeSort();
        break;
      default:
        break;
    }

    setSorting(false);
  };

  const maxElement = Math.max(...array);

  return (
    <div className="min-h-screen p-4">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Advanced Sorting Algorithm Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 flex-wrap">
              <Select value={algorithm} onValueChange={(value: SortingAlgorithm) => setAlgorithm(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">Quick Sort</SelectItem>
                  <SelectItem value="heap">Heap Sort</SelectItem>
                  <SelectItem value="shell">Shell Sort</SelectItem>
                  <SelectItem value="counting">Counting Sort</SelectItem>
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                  <SelectItem value="insertion">Insertion Sort</SelectItem>
                  <SelectItem value="merge">Merge Sort</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm">Size:</span>
                <Slider
                  value={[arraySize]}
                  onValueChange={([value]) => setArraySize(value)}
                  min={10}
                  max={500}
                  step={10}
                  disabled={sorting}
                />
                <span className="text-sm w-8">{arraySize}</span>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm">Speed:</span>
                <Slider
                  value={[speed]}
                  onValueChange={([value]) => setSpeed(value)}
                  min={1}
                  max={100}
                  disabled={sorting}
                />
                <span className="text-sm w-8">{speed}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={generateArray} disabled={sorting}>
                Generate New Array
              </Button>
              <Button onClick={startSort} disabled={sorting}>
                Start Sorting
              </Button>
            </div>

            {timeElapsed > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Time taken: {(timeElapsed / 1000).toFixed(2)}s | Comparisons: {comparisons}
                </AlertDescription>
              </Alert>
            )}

            <div className="h-64 flex items-end gap-1">
              {array.map((value, idx) => (
                <div
                  key={idx}
                  style={{
                    height: `${(value / maxElement) * 100}%`,
                    width: `${100 / arraySize}%`
                  }}
                  className="bg-blue-500 transition-all duration-75"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SortingVisualizer;