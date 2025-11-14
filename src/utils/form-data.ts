type Primitive = string | number | boolean | null | undefined | File
type FormValue = Primitive | FormValue[] | { [key: string]: FormValue }

export function objectToFormData(obj: Record<string, FormValue>, form: FormData = new FormData(), namespace?: string): FormData {
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    const formKey = namespace ? `${namespace}[${key}]` : key

    // === File ===
    if (value instanceof File) {
      form.append(formKey, value)
      return
    }

    // === Array ===
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        const arrayKey = `${formKey}[${i}]`
        if (v instanceof File) {
          form.append(`${formKey}[]`, v)
        } else if (typeof v === 'object' && v !== null) {
          objectToFormData(v as Record<string, FormValue>, form, arrayKey)
        } else if (v !== undefined && v !== null) {
          form.append(`${formKey}[]`, String(v))
        }
      })
      return
    }

    // === Object nested ===
    if (typeof value === 'object') {
      objectToFormData(value as Record<string, FormValue>, form, formKey)
      return
    }

    // === Primitive values ===
    if (typeof value === 'boolean') {
      form.append(formKey, value ? 'true' : 'false')
    } else {
      form.append(formKey, String(value))
    }
  })

  return form
}
