import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function App({ Component, pageProps }) {
  const router = useRouter()
  
  // Add RTL support for Arabic
  useEffect(() => {
    const direction = router.locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = direction
    document.documentElement.lang = router.locale
  }, [router.locale])
  return (
    <>
      <Component {...pageProps} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}

export default appWithTranslation(App)
