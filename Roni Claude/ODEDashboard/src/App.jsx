import { RouterProvider } from 'react-router-dom'
import { ClientProvider } from './context/ClientContext.jsx'
import { router } from './routes.jsx'

export default function App() {
  return (
    <ClientProvider>
      <RouterProvider router={router} />
    </ClientProvider>
  )
}
