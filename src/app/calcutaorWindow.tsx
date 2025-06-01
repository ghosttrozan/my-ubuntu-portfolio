"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiX, FiMinus, FiMaximize2 } from "react-icons/fi";
import { useCalculatorStore } from '../store/calculatorWindowStore'


export default function CalculatorWindow() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 200, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const toggleCalculator = useCalculatorStore((state) => state.toggleCalculator);

  const handleButtonClick = (value: string) => {
    if (display === "0" && value !== ".") {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const handleOperation = (op: string) => {
    if (operation && previousValue !== null) {
      const result = calculate(previousValue, parseFloat(display), operation);
      setPreviousValue(result);
      setDisplay(String(result));
    } else {
      setPreviousValue(parseFloat(display));
    }
    setOperation(op);
    setDisplay("0");
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return a / b;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate(previousValue, parseFloat(display), operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
  };

  const handleDelete = () => {
    if (display.length === 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  const handleDrag = (event: any, info: any) => {
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y
    });
  };

  return (
    <motion.div
      drag
      dragConstraints={{
        top: -window.innerHeight + 400,
        left: -window.innerWidth + 300,
        right: window.innerWidth - 300,
        bottom: window.innerHeight - 400
      }}
      dragElastic={0.05}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={`fixed bg-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-600 flex flex-col z-20 ${
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      }`}
      style={{ width: 300, height: 400 }}
    >
      {/* Window Header */}
      <motion.div
        className="bg-gray-700 h-8 flex items-center justify-between px-3 cursor-move touch-none"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          <button onClick={() => toggleCalculator()} className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition">
            <FiX className="text-xs opacity-0 hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition">
            <FiMinus className="text-xs opacity-0 hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition">
            <FiMaximize2 className="text-xs opacity-0 hover:opacity-100" />
          </button>
        </div>
        <div className="text-xs text-gray-300">Calculator</div>
        <div className="w-8"></div>
      </motion.div>

      {/* Calculator Display */}
      <div className="bg-gray-900 p-4 h-20 flex flex-col items-end justify-center">
        <div className="text-gray-400 text-xs h-4">
          {previousValue !== null ? `${previousValue} ${operation}` : ""}
        </div>
        <div className="text-white text-2xl font-mono truncate w-full text-right">
          {display}
        </div>
      </div>

      {/* Calculator Buttons */}
      <div className="grid grid-cols-4 gap-1 p-2 flex-1 bg-gray-800">
        {/* Row 1 */}
        <button
          onClick={handleClear}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded active:bg-gray-500"
        >
          AC
        </button>
        <button
          onClick={handleDelete}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded active:bg-gray-500"
        >
          DEL
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded active:bg-gray-500">
          %
        </button>
        <button
          onClick={() => handleOperation("÷")}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded active:bg-orange-700"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleButtonClick("7")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded active:bg-gray-400"
        >
          7
        </button>
        <button
          onClick={() => handleButtonClick("8")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded active:bg-gray-400"
        >
          8
        </button>
        <button
          onClick={() => handleButtonClick("9")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded active:bg-gray-400"
        >
          9
        </button>
        <button
          onClick={() => handleOperation("×")}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded active:bg-orange-700"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleButtonClick("4")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded active:bg-gray-400"
        >
          4
        </button>
        <button
          onClick={() => handleButtonClick("5")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded active:bg-gray-400"
        >
          5
        </button>
        <button
          onClick={() => handleButtonClick("6")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded active:bg-gray-400"
        >
          6
        </button>
        <button
          onClick={() => handleOperation("-")}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded active:bg-orange-700"
        >
          -
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleButtonClick("1")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded active:bg-gray-400"
        >
          1
        </button>
        <button
          onClick={() => handleButtonClick("2")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded active:bg-gray-400"
        >
          2
        </button>
        <button
          onClick={() => handleButtonClick("3")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded active:bg-gray-400"
        >
          3
        </button>
        <button
          onClick={() => handleOperation("+")}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded active:bg-orange-700"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleButtonClick("0")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded col-span-2 active:bg-gray-400"
        >
          0
        </button>
        <button
          onClick={() => handleButtonClick(".")}
          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded active:bg-gray-400"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded active:bg-orange-700"
        >
          =
        </button>
      </div>
    </motion.div>
  );
}   