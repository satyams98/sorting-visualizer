import React from 'react';

const ArrayBars: React.FC<{
    array: number[];
    arraySize: number;
    maxElement: number;
    swappingIndices: number[] | null; // Changed to accommodate three indices
}> = ({
    array,
    arraySize,
    maxElement,
    swappingIndices
}) => {
        return (
            <div className="h-64 flex items-end gap-1">
                {array.map((value, idx) => (
                    <div
                        key={idx}
                        style={{
                            height: `${(value / maxElement) * 100}%`,
                            width: `${100 / arraySize}%`,
                            fontSize: `${Math.max(0.4 * (100 / arraySize), 12)}px`,
                        }}
                        className={`
                        flex items-center justify-center text-white
                        transform transition-all duration-300 ease-in-out
                        ${swappingIndices && swappingIndices[0] === idx // Pivot
                                ? 'bg-yellow-500 scale-110 translate-y-2' // Different style for pivot
                                : swappingIndices && swappingIndices[1] === idx // First swapping element
                                    ? 'bg-red-500 scale-110 translate-y-2'
                                    : swappingIndices && swappingIndices[2] === idx // Second swapping element
                                        ? 'bg-green-500 scale-110 translate-y-2'
                                        : 'bg-blue-500'
                            }
                        hover:brightness-110
                        motion-safe:hover:scale-105
                        ${swappingIndices && (swappingIndices[0] === idx || swappingIndices[1] === idx || swappingIndices[2] === idx)
                                ? 'shadow-lg ring-2 ring-white ring-opacity-50'
                                : ''
                            }
                    `}
                    >
                        {value}
                    </div>
                ))}
            </div>
        );
    };

export default ArrayBars;
