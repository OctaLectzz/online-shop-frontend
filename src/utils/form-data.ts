type FormValue = File | boolean | string | number | null | undefined

export function objectToFormData(obj: Record<string, FormValue>): FormData {
  const formData = new FormData()

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value)
      } else if (typeof value === 'boolean') {
        formData.append(key, value.toString())
      } else if (typeof value === 'string' || typeof value === 'number') {
        formData.append(key, value.toString())
      }
    }
  })

  return formData
}
