import { createContext, useContext, useState } from "react"

const SelectContext = createContext()

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children }) {
  const { setOpen } = useContext(SelectContext)

  return (
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className="border rounded px-3 py-2 w-full flex justify-between items-center"
    >
      {children}
    </button>
  )
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext)

  return (
    <span className="text-sm text-gray-700">
      {value || <span className="text-gray-400">{placeholder}</span>}
    </span>
  )
}

export function SelectContent({ children }) {
  const { open } = useContext(SelectContext)

  if (!open) return null

  return (
    <div className="absolute mt-1 w-full border rounded bg-white shadow">
      {children}
    </div>
  )
}

export function SelectItem({ value, children }) {
  const { onValueChange, setOpen } = useContext(SelectContext)

  return (
    <div
      onClick={() => {
        onValueChange(value)
        setOpen(false)
      }}
      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
    >
      {children}
    </div>
  )
}
