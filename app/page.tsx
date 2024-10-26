"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SortingAlgorithm } from '@/lib/types';
import { quickSort, bubbleSort, shellSort, insertionSort, mergeSort, heapSort, countingSort, selectionSort }
  from '@/lib/sorting-algorithms';
import ArrayBars from '@/components/ArrayBars';

const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState<boolean>(false);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('quick');
  const [arraySize, setArraySize] = useState<number>(70);
  const [speed, setSpeed] = useState<number>(50);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [comparisons, setComparisons] = useState<number>(0);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);

  // Generate random array
  const generateArray = useCallback((): void => {
    const newArray: number[] = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setTimeElapsed(0);
    setComparisons(0);
    setSwappingIndices([]);
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);


  const startSort = async (): Promise<void> => {
    setSorting(true);
    setComparisons(0);
    setTimeElapsed(0);
    switch (algorithm) {
      case 'quick':
        await quickSort(array, setArray, speed, setTimeElapsed, setComparisons, setSwappingIndices);
        break;
      case 'heap':
        await heapSort(array, arraySize, setArray, speed, setTimeElapsed, setComparisons);
        break;
      case 'shell':
        await shellSort(array, arraySize, setArray, speed, setTimeElapsed, setComparisons);
        break;
      case 'counting':
        await countingSort(array, arraySize, setArray, speed, setTimeElapsed, setComparisons);
        break;
      case 'bubble':
        await bubbleSort(array, setArray, speed, setComparisons, setTimeElapsed, setSwappingIndices);
        break;
      case 'selection':
        await selectionSort(array, arraySize, setArray, speed, setTimeElapsed, setComparisons, setSwappingIndices);
        break;
      case 'insertion':
        await insertionSort(array, arraySize, setArray, speed, setTimeElapsed, setComparisons, setSwappingIndices);
        break;
      case 'merge':
        await mergeSort(array, arraySize, setArray, speed, setTimeElapsed, setComparisons);
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
                  max={70}
                  step={1}
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

            <ArrayBars array={array} arraySize={arraySize} maxElement={maxElement}
              swappingIndices={swappingIndices} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SortingVisualizer;