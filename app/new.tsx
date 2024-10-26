"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type SortingAlgorithm = 'quick' | 'heap' | 'shell' | 'counting' | 'bubble' | 'selection' | 'insertion' | 'merge';

const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState<boolean>(false);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('quick');
  const [arraySize, setArraySize] = useState<number>(50);
  const [speed, setSpeed] = useState<number>(50);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [comparisons, setComparisons] = useState<number>(0);
  const stopSortingRef = useRef<boolean>(false);

  // Generate random array
  const generateArray = useCallback((): void => {
    const newArray: number[] = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setTimeElapsed(0);
    setComparisons(0);
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Helper function to create delay with weighted speed
  const delay = (ms: number): Promise<void> => new Promise((resolve, reject) => {
    if (stopSortingRef.current) {
      reject(new Error('Sorting stopped'));
      return;
    }
    // Exponential speed scaling for better control
    const weightedDelay = Math.floor(Math.pow(1.1, (100 - speed)) * 2);
    setTimeout(resolve, weightedDelay);
  });

  // Update array and visualize
  const updateArray = async (arr: number[], delayTime: number = 0): Promise<void> => {
    if (stopSortingRef.current) throw new Error('Sorting stopped');
    setArray([...arr]);
    if (delayTime > 0) await delay(delayTime);
  };

  // Swap function for animations
  const swap = async (arr: number[], i: number, j: number, delayTime: number): Promise<number[]> => {
    if (stopSortingRef.current) throw new Error('Sorting stopped');
    const newArr = [...arr];
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    await updateArray(newArr, delayTime);
    setComparisons(prev => prev + 1);
    return newArr;
  };

  // Shell Sort (Fixed)
  const shellSort = async (): Promise<number[]> => {
    let arr = [...array];
    const startTime = Date.now();

    for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < arr.length; i++) {
        const temp = arr[i];
        let j = i;

        while (j >= gap && arr[j - gap] > temp) {
          arr[j] = arr[j - gap];
          j -= gap;
          await updateArray(arr);
          setComparisons(prev => prev + 1);
        }

        arr[j] = temp;
        await updateArray(arr);
      }
    }

    setTimeElapsed(Date.now() - startTime);
    return arr;
  };

  // Counting Sort (Fixed)
  const countingSort = async (): Promise<number[]> => {
    let arr = [...array];
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

    // Build output array with visualization
    for (let i = 0; i < arr.length; i++) {
      const currentPos = count[arr[i] - min] - 1;
      output[currentPos] = arr[i];
      count[arr[i] - min]--;
      // Create a temporary array for visualization
      const tempArr = [...output];
      for (let j = currentPos + 1; j < arr.length; j++) {
        if (tempArr[j] === 0) tempArr[j] = arr[j];
      }
      await updateArray(tempArr);
    }

    setTimeElapsed(Date.now() - startTime);
    return output;
  };

  // Merge Sort (Fixed)
  const merge = async (arr: number[], start: number, mid: number, end: number): Promise<void> => {
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
      await updateArray(arr);
      setComparisons(prev => prev + 1);
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      await updateArray(arr);
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      await updateArray(arr);
      j++;
      k++;
    }
  };

  const mergeSort = async (): Promise<number[]> => {
    const startTime = Date.now();

    const mergeSortHelper = async (arr: number[], start: number, end: number): Promise<void> => {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSortHelper(arr, start, mid);
        await mergeSortHelper(arr, mid + 1, end);
        await merge(arr, start, mid, end);
      }
    };

    let arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
    setTimeElapsed(Date.now() - startTime);
    return arr;
  };
  // Quick Sort
  const quickSort = async (): Promise<number[]> => {
    const delayTime = 101 - speed;
    const startTime = Date.now();

    const partition = async (arr: number[], low: number, high: number): Promise<number> => {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          await swap(arr, i, j, delayTime);
        }
      }
      await swap(arr, i + 1, high, delayTime);
      return i + 1;
    };

    const quickSortHelper = async (arr: number[], low: number, high: number): Promise<void> => {
      if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
      }
    };

    let arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
    setTimeElapsed(Date.now() - startTime);
    return arr;
  };


  const startSort = async (): Promise<void> => {
    setSorting(true);
    stopSortingRef.current = false;

    try {
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
    } catch (error) {
      if (error.message === 'Sorting stopped') {
        console.log('Sorting was stopped');
      } else {
        console.error('Error during sorting:', error);
      }
    }

    setSorting(false);
    stopSortingRef.current = false;
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
                <span className="text-sm w-12">{arraySize}</span>
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
              <Button
                onClick={() => stopSortingRef.current = true}
                disabled={!sorting}
                variant="destructive"
              >
                Stop Sorting
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

            <div className="h-[calc(100vh-300px)] flex items-end gap-0">
              {array.map((value, idx) => (
                <div
                  key={idx}
                  style={{
                    height: `${(value / maxElement) * 100}%`,
                    width: `${100 / arraySize}%`
                  }}
                  className="bg-blue-500 transition-all duration-100"
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