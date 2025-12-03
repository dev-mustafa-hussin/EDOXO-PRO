"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CalculatorModalProps {
  open: boolean
  onClose: () => void
}

export function CalculatorModal({ open, onClose }: CalculatorModalProps) {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
      return
    }
    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      let result = currentValue

      switch (operation) {
        case "+":
          result = currentValue + inputValue
          break
        case "-":
          result = currentValue - inputValue
          break
        case "×":
          result = currentValue * inputValue
          break
        case "÷":
          result = currentValue / inputValue
          break
      }

      setDisplay(String(result))
      setPreviousValue(result)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = () => {
    if (!operation || previousValue === null) return

    const inputValue = Number.parseFloat(display)
    let result = previousValue

    switch (operation) {
      case "+":
        result = previousValue + inputValue
        break
      case "-":
        result = previousValue - inputValue
        break
      case "×":
        result = previousValue * inputValue
        break
      case "÷":
        result = previousValue / inputValue
        break
    }

    setDisplay(String(result))
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(true)
  }

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[300px]" dir="ltr">
        <DialogHeader>
          <DialogTitle className="text-right">آلة حاسبة</DialogTitle>
        </DialogHeader>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="bg-white rounded-lg p-4 mb-4 text-left text-2xl font-mono overflow-hidden">{display}</div>
          <div className="grid gap-2">
            {buttons.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 gap-2">
                {row.map((btn) => (
                  <Button
                    key={btn}
                    variant={["÷", "×", "-", "+", "="].includes(btn) ? "default" : "outline"}
                    className={`h-12 text-lg ${btn === "0" ? "col-span-2" : ""} ${
                      ["÷", "×", "-", "+", "="].includes(btn) ? "bg-blue-600 hover:bg-blue-700" : ""
                    }`}
                    onClick={() => {
                      if (btn === "C") clear()
                      else if (btn === "=") calculate()
                      else if (["+", "-", "×", "÷"].includes(btn)) performOperation(btn)
                      else if (btn === ".") inputDecimal()
                      else if (btn === "±") setDisplay(String(Number.parseFloat(display) * -1))
                      else if (btn === "%") setDisplay(String(Number.parseFloat(display) / 100))
                      else inputDigit(btn)
                    }}
                  >
                    {btn}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
