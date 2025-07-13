import { useTheme } from '@/context/theme-context'
import { ToastContainer } from 'react-toastify'

export function Toast() {
  const { theme } = useTheme()

  return <ToastContainer position="top-right" autoClose={3000} newestOnTop draggable pauseOnHover theme={theme === 'light' ? 'light' : 'dark'} />
}
