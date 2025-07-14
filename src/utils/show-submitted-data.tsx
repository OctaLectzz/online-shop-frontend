import { toast } from 'react-toastify'

export function showSubmittedData(data: unknown, title: string = 'You submitted the following values:') {
  toast.success(title + JSON.stringify(data, null, 2))
}
