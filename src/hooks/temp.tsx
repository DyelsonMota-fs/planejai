import type { SimulationFormData, SimulationRecord } from '@/data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

const readSavedData = () => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
  return storage ? (JSON.parse(storage) as SimulationRecord[]) : []
}

export const useSimulationStorage = () => {
  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
    }

    const savedData = readSavedData()
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...savedData, record]))

    return id
  }

  const getAllFormData = () => {
    return readSavedData()
  }

  const getFormData = (id: string): SimulationRecord | null => {
    const savedData = readSavedData()
    return savedData.find((record) => record.id === id) || null
  }

  const updateSimulation = (id: string, data: SimulationRecord) => {
    const savedData = readSavedData()
    const updated = savedData.map((record) => (record.id === id ? { ...data } : record))

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  const deleteSimulation = (id: string) => {
    const savedData = readSavedData()
    const filtered = savedData.filter((record) => record.id !== id)

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered))
  }

  return { saveFormData, getAllFormData, getFormData, updateSimulation, deleteSimulation }
}
