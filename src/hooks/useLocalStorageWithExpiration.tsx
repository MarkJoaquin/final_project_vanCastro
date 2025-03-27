import { useState } from "react"

export const useLocalStorageWithExpiration = (key: string, expirationTime: number) => {
  // Inicializar el estado con el valor almacenado
  const getStoredValue = () => {
    if (typeof window === 'undefined') return null;
    
    const storedData = localStorage.getItem(key)
    if (!storedData) return null;

    try {
      const { value, timestamp } = JSON.parse(storedData)
      const now = Date.now()

      if (now - timestamp < expirationTime) {
        return value
      } else {
        localStorage.removeItem(key)
        return null
      }
    } catch {
      localStorage.removeItem(key)
      return null
    }
  }

  const [value, setValue] = useState<boolean | null>(getStoredValue)

  const saveValue = (newValue: boolean) => {
    const data = {
      value: newValue,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(data))
    setValue(newValue)
  }

  return [value, saveValue] as const
}
