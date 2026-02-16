import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { FiGlobe, FiChevronDown } from 'react-icons/fi'

export default function LanguageButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ]

  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0]

  const changeLanguage = async (lang) => {
    setIsOpen(false)
    // Stay on current page when switching language
    const currentPath = router.pathname
    await router.push(currentPath, currentPath, { locale: lang })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const isRTL = router.locale === 'ar'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-700"
      >
        <FiGlobe className="text-lg text-slate-600 dark:text-slate-300" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <FiChevronDown className={`text-slate-600 dark:text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 backdrop-blur-xl`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                router.locale === lang.code ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className={`text-sm font-medium ${
                router.locale === lang.code 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-700 dark:text-slate-200'
              }`}>
                {lang.name}
              </span>
              {router.locale === lang.code && (
                <span className="ml-auto text-indigo-600 dark:text-indigo-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
