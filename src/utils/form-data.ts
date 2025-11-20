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
      value.forEach((item, index) => {
        if (item === undefined || item === null) return

        const itemKey = `${formKey}[${index}]`

        if (item instanceof File) {
          form.append(itemKey, item)
        } else if (typeof item === 'object') {
          objectToFormData(item as Record<string, FormValue>, form, itemKey)
        } else {
          form.append(itemKey, String(item))
        }
      })
      return
    }

    // === Object nested ===
    if (typeof value === 'object') {
      objectToFormData(value as Record<string, FormValue>, form, formKey)
      return
    }

    // === Primitive ===
    if (typeof value === 'boolean') {
      form.append(formKey, value ? 'true' : 'false')
    } else {
      form.append(formKey, String(value))
    }
  })

  return form
}
