import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'

export const Route = createFileRoute('/exams/cbt')({
  component: CBTExamPage,
})

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

const MOCK_QUESTIONS: Question[] = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  text: `Question ${index + 1}: What is the primary output of executing a standard database migration using Drizzle Kit in a modern full-stack web application?`,
  options: [
    'A) Compiles TypeScript directly into binary executable machine code',
    'B) Generates and executes SQL migration statements against the target database schema',
    'C) Automatically provisions a remote cloud server instance on Netlify',
    'D) Purges all browser local storage and resets environment variables',
  ],
  correctAnswer: 1,
}))

function CBTExamPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<Record<number, boolean>>({})
  const [timeLeft, setTimeLeft] = useState(3600)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [calcInput, setCalcInput] = useState('0')

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const currentQuestion = MOCK_QUESTIONS[currentIndex]

  const handleCalcBtn = (val: string) => {
    if (val === 'C') {
      setCalcInput('0')
    } else if (val === '=') {
      try {
        setCalcInput(eval(calcInput).toString())
      } catch {
        setCalcInput('Error')
      }
    } else {
      setCalcInput((prev) => (prev === '0' ? val : prev + val))
    }
  }

  return (
    <div className="flex justify-center bg-zinc-950 min-h-screen text-zinc-100">
      <div className="w-full max-w-md flex flex-col h-screen bg-zinc-900 border-x border-zinc-800 relative shadow-2xl">
        <header className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/60">
              ⏱ {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
              className="px-2.5 py-1 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700 text-zinc-200 transition shadow-xs"
            >
              🧮 Calc
            </button>
            <span className="text-xs text-zinc-400 font-mono font-semibold">
              {currentIndex + 1} / 40
            </span>
          </div>
        </header>

        {isCalculatorOpen && (
          <div className="absolute top-16 left-4 right-4 z-20 bg-zinc-900 border border-zinc-700 p-4 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-zinc-400">EXAM CALCULATOR</span>
              <button onClick={() => setIsCalculatorOpen(false)} className="text-xs text-rose-400 hover:underline">Close</button>
            </div>
            <div className="bg-zinc-950 text-right p-2.5 rounded-lg mb-3 text-xl font-mono text-emerald-400 border border-zinc-800 truncate">
              {calcInput}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', 'C', '=', '+'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcBtn(btn)}
                  className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-wider uppercase font-bold text-zinc-400">
              Question {currentQuestion.id} of 40
            </span>
            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium border transition ${
                flagged[currentQuestion.id]
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {flagged[currentQuestion.id] ? 'Flagged 🚩' : 'Flag Question'}
            </button>
          </div>

          <p className="text-sm font-medium leading-relaxed text-zinc-100 bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/80">
            {currentQuestion.text}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentQuestion.id] === idx
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQuestion.id, idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-zinc-100 border-zinc-100 text-zinc-950 font-semibold shadow-md'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] shrink-0 border font-bold ${
                    isSelected ? 'bg-zinc-950 text-zinc-100 border-zinc-950' : 'border-zinc-700 text-zinc-400 bg-zinc-900'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="pt-0.5">{opt.slice(3)}</span>
                </button>
              )
            })}
          </div>
        </main>

        <footer className="p-4 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between gap-3">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs font-semibold transition"
          >
            Previous
          </button>

          <Drawer.Root>
            <Drawer.Trigger asChild>
              <button className="px-4 py-2.5 bg-zinc-100 hover:bg-white active:bg-zinc-200 text-zinc-950 rounded-xl text-xs font-bold shadow-lg transition">
                Questions Grid
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50" />
              <Drawer.Content className="bg-zinc-900 border-t border-zinc-800 flex flex-col rounded-t-[24px] h-[75vh] fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto outline-none shadow-2xl">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-700 my-3" />
                <div className="px-5 pb-3 border-b border-zinc-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Question Palette</h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Answered vs Unanswered Overview</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                    {Object.keys(answers).length} / 40 Answered
                  </span>
                </div>
                
                <div className="p-5 overflow-y-auto grid grid-cols-5 gap-3">
                  {MOCK_QUESTIONS.map((q) => {
                    const isAnswered = answers[q.id] !== undefined
                    const isCurrent = currentIndex + 1 === q.id
                    
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(q.id - 1)}
                        className={`h-11 rounded-xl text-xs font-mono font-bold transition flex flex-col items-center justify-center border relative shadow-xs ${
                          isAnswered
                            ? 'bg-zinc-950 text-zinc-100 border-zinc-700' 
                            : 'bg-zinc-100 text-zinc-950 border-white hover:bg-white'
                        } ${isCurrent ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-900' : ''}`}
                      >
                        {q.id}
                        {flagged[q.id] && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-1 ring-zinc-900" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>

          <button
            disabled={currentIndex === MOCK_QUESTIONS.length - 1}
            onClick={() => setCurrentIndex((prev) => Math.min(MOCK_QUESTIONS.length - 1, prev + 1))}
            className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs font-semibold transition"
          >
            Next
          </button>
        </footer>
      </div>
    </div>
  )
}