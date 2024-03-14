import React, { useState, useEffect } from "react";

const SortingVisualizer = () => {
    const [bars, setBars] = useState([]);
    const [sortingAlgorithm, setSortingAlgorithm] = useState('');
    const [isSorting, setIsSorting] = useState(false);



    useEffect(() => {
        resetArray();
    }, []);


    let audioCtx = null;

    function playNote(freq) {
        if (audioCtx == null) {
            audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
        }
        const dur = 0.1;
        const osc = audioCtx.createOscillator();
        osc.frequency.value = freq;
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
        const node = audioCtx.createGain();
        node.gain.value = 0.1;
        node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
        osc.connect(node);
        node.connect(audioCtx.destination);
    }


    function resetArray() {
        const array = [];
        for (let i = 0; i < 100; i++) {
            array.push({
                value: randomIntFromInterval(5, 400),
                color: 'steelblue' // Initial color
            });
        }
        setBars(array);
    }

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    async function handleSort() {
        setIsSorting(true);

        switch (sortingAlgorithm) {
            case 'bubbleSort':
                await bubbleSort();
                break;
            default:
                console.error("No sorting algorithm selected");
        }

        setIsSorting(false);
    }

    async function bubbleSort() {
        let arr = [...bars];
        let swapped;
        do {
            swapped = false;
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i].value > arr[i + 1].value) {
                    // Update colors for comparison
                    setBars([
                        ...arr.slice(0, i),
                        { ...arr[i], color: 'red' },
                        { ...arr[i + 1], color: 'red'},
                        ...arr.slice(i + 2)
                    ]); 
                    playNote(bars[i].value * 2);

                    // Swap elements
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    setBars([...arr]);
                    playNote(bars[i].value * 2 + 100);

                    await new Promise(resolve => setTimeout(resolve, 13));

                    
                    swapped = true;
                }
            }
        } while (swapped);

        // All elements sorted
        setBars(arr.map(item => ({ ...item, color: 'green' })));
    }

    return (
        <div className="visualizer-container">
            <div className="bars-container">
                {bars.map((bar, index) => (
                    <div
                        key={index}
                        
                        style={{ height: `${bar.value}px`, background: `${bar.color}`}}
                    ></div>
                ))}
            </div>

            <div className="controls">
                <button onClick={resetArray}>Generate New Array</button>
                <select value={sortingAlgorithm} onChange={(e) => setSortingAlgorithm(e.target.value)}>
                    <option value={null} >Select Algorithm</option>
                    <option value="bubbleSort">Bubble Sort</option>
                </select>
                <button onClick={handleSort} disabled={isSorting}>Sort!</button>
            </div>
        </div>
    );
};

export default SortingVisualizer;
