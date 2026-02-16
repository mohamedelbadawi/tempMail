import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiMail, FiCopy, FiRefreshCw, FiTrash2, FiClock, FiUser, FiCheck, FiSettings, FiMenu, FiX, FiInbox, FiStar, FiCode, FiFileText, FiGlobe } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import LanguageButton from '../components/LanguageButton'

// Use local API routes to avoid CORS issues
const API_URL = '/api'

export default function Home() {
  const { t, i18n } = useTranslation('common')
  const router = useRouter()
  const isRTL = router.locale === 'ar'
  const [emailAddress, setEmailAddress] = useState('')
  const [customName, setCustomName] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [emails, setEmails] = useState([])
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isCheckingName, setIsCheckingName] = useState(false)
  const [nameAvailable, setNameAvailable] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(null)
  const [savedEmails, setSavedEmails] = useState([])
  const [showSaved, setShowSaved] = useState(false)
  const [readEmails, setReadEmails] = useState(new Set())
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastEmailCount, setLastEmailCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [emailViewMode, setEmailViewMode] = useState('html') // 'html' or 'text'
  const [manualEmail, setManualEmail] = useState('')
  const [useManualEmail, setUseManualEmail] = useState(false)
  
  // Use ref to track deleted emails to avoid closure issues
  const deletedEmailsRef = useRef(new Set())

  // Language switcher
  const changeLanguage = (lang) => {
    router.push(router.pathname, router.asPath, { locale: lang })
  }

  // Load saved data from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load saved emails
      const saved = localStorage.getItem('savedEmails')
      if (saved) {
        try {
          setSavedEmails(JSON.parse(saved))
        } catch (e) {
          console.error('Error loading saved emails:', e)
        }
      }

      // Load auto-refresh setting
      const savedAutoRefresh = localStorage.getItem('autoRefreshEnabled')
      if (savedAutoRefresh !== null) {
        setAutoRefreshEnabled(savedAutoRefresh === 'true')
      }

      // Load refresh interval
      const savedInterval = localStorage.getItem('refreshInterval')
      if (savedInterval) {
        setRefreshInterval(Number(savedInterval))
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('autoRefreshEnabled', autoRefreshEnabled)
    }
  }, [autoRefreshEnabled])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshInterval', refreshInterval)
    }
  }, [refreshInterval])

  // Smart auto-refresh with visibility detection
  useEffect(() => {
    if (!emailAddress || !autoRefreshEnabled || refreshInterval === 0) {
      return
    }

    // Initial fetch
    fetchEmails()

    let interval = null

    const startRefresh = () => {
      if (interval) clearInterval(interval)
      interval = setInterval(fetchEmails, refreshInterval * 1000)
      setAutoRefresh(interval)
    }

    const stopRefresh = () => {
      if (interval) clearInterval(interval)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden - stop refreshing to save requests
        stopRefresh()
      } else {
        // Tab visible - fetch immediately and resume
        fetchEmails()
        startRefresh()
      }
    }

    // Start refresh
    startRefresh()

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stopRefresh()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [emailAddress, autoRefreshEnabled, refreshInterval])

  // Note: GPTMail API doesn't have name availability check
  // We'll just let users try and see if it works
  useEffect(() => {
    if (customName.length >= 3) {
      setNameAvailable(true) // Assume available
    } else {
      setNameAvailable(null)
    }
  }, [customName])

  const saveEmailToList = (email) => {
    const newSaved = [...savedEmails]
    const exists = newSaved.find(e => e.address === email)
    
    if (!exists) {
      newSaved.unshift({
        address: email,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      })
      
      // Keep only last 10 emails
      if (newSaved.length > 10) {
        newSaved.pop()
      }
      
      setSavedEmails(newSaved)
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedEmails', JSON.stringify(newSaved))
      }
    } else {
      // Update last used time
      exists.lastUsed = new Date().toISOString()
      setSavedEmails([...newSaved])
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedEmails', JSON.stringify(newSaved))
      }
    }
  }

  const generateEmail = async () => {
    setLoading(true)
    try {
      // If using manual email, just set it directly
      if (useManualEmail && manualEmail) {
        setEmailAddress(manualEmail)
        saveEmailToList(manualEmail)
        toast.success('Email address added!')
        
        // Fetch emails immediately with the new address
        await fetchEmails(true, manualEmail)
        
        setLoading(false)
        return
      }

      // Otherwise generate from API
      const response = await axios.post(`${API_URL}/generate-email`, {
        prefix: isCustom && customName ? customName : null
      })
      
      if (response.data.success) {
        const newEmail = response.data.data.email
        setEmailAddress(newEmail)
        saveEmailToList(newEmail)
        toast.success('Email address generated and saved!')
        
        // Fetch emails immediately with the new address
        await fetchEmails(true, newEmail)
      } else {
        toast.error(response.data.error || 'Failed to generate email')
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate email')
    }
    setLoading(false)
  }

  const switchToEmail = async (email) => {
    setEmailAddress(email.address)
    saveEmailToList(email.address)
    setEmails([])
    setSelectedEmail(null)
    setShowSaved(false)
    setReadEmails(new Set()) // Reset read status when switching
    deletedEmailsRef.current = new Set() // Reset deleted emails when switching
    toast.success(`Switched to ${email.address}`)
    
    // Fetch emails for the switched address immediately
    await fetchEmails(true, email.address)
  }

  const removeSavedEmail = async (emailToRemove) => {
    const newSaved = savedEmails.filter(e => e.address !== emailToRemove)
    setSavedEmails(newSaved)
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedEmails', JSON.stringify(newSaved))
    }
    
    // If removing the currently active email, switch to another one
    if (emailAddress === emailToRemove && newSaved.length > 0) {
      // Switch to the first saved email
      await switchToEmail(newSaved[0])
      toast.success('Switched to another saved email')
    } else {
      toast.success('Email removed from saved list')
    }
  }

  const fetchEmails = async (forceRefresh = false, emailToFetch = null) => {
    const targetEmail = emailToFetch || emailAddress
    if (!targetEmail) return
    
    // Prevent duplicate simultaneous requests
    if (isRefreshing && !forceRefresh) return
    
    setIsRefreshing(true)
    
    try {
      const response = await axios.get(`${API_URL}/emails`, {
        params: { email: targetEmail }
      })
      
      if (response.data.success) {
        // Transform GPTMail format to our format and filter out deleted emails
        const transformedEmails = response.data.data.emails
          .filter(email => {
            const isDeleted = deletedEmailsRef.current.has(String(email.id))
            if (isDeleted) {
              console.log('Filtering out deleted email:', email.id)
            }
            return !isDeleted
          })
          .map(email => ({
            id: email.id,
            _id: email.id, // For compatibility
            sender: email.from_address,
            subject: email.subject,
            text: email.content,
            html: email.has_html ? email.html_content : null, // Only use HTML if has_html is true
            receivedAt: new Date(email.timestamp * 1000).toISOString(),
            isRead: readEmails.has(email.id), // Check if marked as read
            recipient: email.email_address
          }))
        
        // Check for actually NEW emails (not just count difference)
        if (emails.length > 0) {
          const existingIds = new Set(emails.map(e => e.id))
          const newEmails = transformedEmails.filter(e => !existingIds.has(e.id))
          
          if (newEmails.length > 0) {
            toast.success(`${newEmails.length} new email${newEmails.length > 1 ? 's' : ''}!`)
          }
        }
        
        setEmails(transformedEmails)
        setLastEmailCount(transformedEmails.length)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error('Error fetching emails:', error)
      if (!error.response || error.response.status >= 500) {
        toast.error('Failed to fetch emails. Check connection.')
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  const manualRefresh = () => {
    fetchEmails(true) // Force refresh
  }

  const viewEmail = async (emailId) => {
    try {
      const response = await axios.get(`${API_URL}/email/${emailId}`)
      
      if (response.data.success) {
        // Mark email as read
        setReadEmails(prev => new Set([...prev, emailId]))
        
        // Transform to our format
        const email = response.data.data
        
        // Reset view mode to HTML when opening a new email
        setEmailViewMode('html')
        
        setSelectedEmail({
          _id: email.id,
          id: email.id,
          sender: email.from_address,
          recipient: email.email_address,
          subject: email.subject,
          text: email.content,
          html: email.has_html ? email.html_content : null, // Only use HTML if has_html is true
          receivedAt: new Date(email.timestamp * 1000).toISOString(),
          isRead: true
        })
        
        // Update the email in the list to show as read
        setEmails(prevEmails => 
          prevEmails.map(e => 
            e.id === emailId ? { ...e, isRead: true } : e
          )
        )
      } else {
        toast.error('Failed to load email')
      }
    } catch (error) {
      toast.error('Failed to load email')
    }
  }

  const deleteEmail = async (emailId) => {
    try {
      console.log('=== DELETE EMAIL STARTED ===')
      console.log('Deleting email:', emailId)
      console.log('Current emails count:', emails.length)
      console.log('Selected email:', selectedEmail?._id)
      
      // Convert to string for consistent comparison
      const emailIdStr = String(emailId)
      
      // Mark as deleted locally FIRST to prevent it from reappearing
      deletedEmailsRef.current.add(emailIdStr)
      console.log('Added to deletedEmailsRef:', emailIdStr)
      console.log('Deleted emails set:', Array.from(deletedEmailsRef.current))
      
      // Find the next email to view BEFORE removing
      const currentIndex = emails.findIndex(e => 
        String(e.id) === emailIdStr || String(e._id) === emailIdStr
      )
      
      console.log('Current index:', currentIndex)
      
      let nextEmail = null
      
      if (currentIndex !== -1) {
        // Try to get next email, or previous if it was the last one
        if (currentIndex < emails.length - 1) {
          nextEmail = emails[currentIndex + 1]
        } else if (currentIndex > 0) {
          nextEmail = emails[currentIndex - 1]
        }
      }
      
      console.log('Next email:', nextEmail?._id || nextEmail?.id)
      
      // Immediately remove from local state
      const updatedEmails = emails.filter(e => 
        String(e.id) !== emailIdStr && String(e._id) !== emailIdStr
      )
      
      console.log('Updated emails count:', updatedEmails.length)
      
      setEmails(updatedEmails)
      setLastEmailCount(updatedEmails.length)
      
      // Remove from read emails set
      setReadEmails(prev => {
        const newSet = new Set(prev)
        newSet.delete(emailIdStr)
        return newSet
      })
      
      // Check if we're deleting the currently selected email
      const isSelectedEmail = selectedEmail && (
        String(selectedEmail.id) === emailIdStr || 
        String(selectedEmail._id) === emailIdStr
      )
      
      console.log('Is selected email:', isSelectedEmail)
      
      // Switch to next email or close - only if deleting the selected email
      if (isSelectedEmail) {
        setSelectedEmail(null) // Clear immediately
        
        if (nextEmail) {
          console.log('Switching to next email:', nextEmail._id || nextEmail.id)
          setTimeout(() => {
            viewEmail(nextEmail._id || nextEmail.id)
          }, 50)
        }
      }
      
      toast.success(t('notifications.emailDeleted'))
      console.log('=== DELETE EMAIL COMPLETED ===')
      
      // Delete from server in background
      axios.delete(`${API_URL}/email/${emailId}`).catch(err => {
        console.error('Server delete error:', err)
      })
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete email')
    }
  }

  const deleteAllEmails = async () => {
    if (!confirm(t('confirmations.deleteAll'))) return
    
    try {
      const response = await axios.delete(`${API_URL}/emails/clear`, {
        params: { email: emailAddress }
      })
      
      if (response.data.success) {
        // Immediately clear local state
        setEmails([])
        setSelectedEmail(null)
        setReadEmails(new Set())
        deletedEmailsRef.current = new Set() // Clear deleted tracking
        
        toast.success(`Deleted ${response.data.data.count} emails`)
        
        // Force immediate refresh to confirm empty inbox
        await fetchEmails(true)
      } else {
        toast.error('Failed to delete emails')
      }
    } catch (error) {
      console.error('Delete all error:', error)
      toast.error('Failed to delete emails')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success(t('notifications.emailCopied'))
  }

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{t('app.title')}</title>
        <meta name="title" content={t('app.title')} />
        <meta name="description" content={t('app.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`https://noxilmail.com/app`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t('app.title')} />
        <meta property="og:description" content={t('app.description')} />
        <meta property="og:site_name" content="Noxil Mail" />
        
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#6366f1" />
      </Head>

      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col`}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-2 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <FiMail className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">{t('landing.brandName')}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('landing.brandTagline')}</p>
              </div>
            </div>
            
            {/* Language Button for Sidebar */}
            <div className="lg:hidden mr-2">
              <LanguageButton />
            </div>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <FiX className="text-xl text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Generate Email Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            {/* Manual Email Option */}
            <label className="flex items-center mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useManualEmail}
                onChange={(e) => {
                  setUseManualEmail(e.target.checked)
                  if (e.target.checked) {
                    setIsCustom(false)
                  }
                }}
                className="mr-2 w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Use specific email
              </span>
            </label>

            {useManualEmail ? (
              <div className="mb-3">
                <input
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value.trim())}
                  placeholder="Enter full email (e.g., user@domain.com)"
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            ) : (
              <>
                <label className="flex items-center mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCustom}
                    onChange={(e) => setIsCustom(e.target.checked)}
                    className="mr-2 w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {t('sidebar.custom')}
                  </span>
                </label>

                {isCustom && (
                  <div className="relative mb-3">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''))}
                      placeholder={t('sidebar.customPlaceholder')}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                    {customName.length >= 3 && nameAvailable && (
                      <div className="absolute right-2 top-2">
                        <FiCheck className="text-green-500 text-lg" />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <button
              onClick={generateEmail}
              disabled={loading || (isCustom && !useManualEmail && (!nameAvailable || customName.length < 3)) || (useManualEmail && !manualEmail)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium rounded-lg transition shadow-lg shadow-blue-500/20"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              <span>{loading ? t('sidebar.processing') : useManualEmail ? t('sidebar.addEmailButton') : emailAddress ? t('sidebar.newEmail') : t('sidebar.generateButton')}</span>
            </button>
          </div>

          {/* Current Email Display */}
          {emailAddress && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {t('sidebar.activeEmail')}
                </span>
                <button
                  onClick={() => copyToClipboard(emailAddress)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  title={t('actions.copy')}
                >
                  <FiCopy className="text-sm text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <p className="text-xs font-mono text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-900 p-2 rounded leading-relaxed">
                {emailAddress}
              </p>
            </div>
          )}

          {/* Saved Emails */}
          {savedEmails.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowSaved(!showSaved)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center space-x-2">
                  <FiStar className="text-yellow-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t('sidebar.savedEmails')}</span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    {savedEmails.length}
                  </span>
                </div>
                <FiMenu className={`text-gray-500 transition-transform ${showSaved ? 'rotate-90' : ''}`} />
              </button>
              
              {showSaved && (
                <div className="max-h-64 overflow-y-auto">
                  {savedEmails.map((saved, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 border-t border-gray-100 dark:border-gray-700 ${
                        emailAddress === saved.address
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-gray-800 dark:text-white truncate">
                            {saved.address}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {formatDistanceToNow(new Date(saved.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {emailAddress !== saved.address && (
                            <button
                              onClick={() => switchToEmail(saved)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition whitespace-nowrap"
                            >
                              {t('actions.switch')}
                            </button>
                          )}
                          <button
                            onClick={() => removeSavedEmail(saved.address)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition"
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Email List */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <FiInbox className="text-gray-600 dark:text-gray-300" />
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  {t('sidebar.inbox')}
                </h2>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                  {emails.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={manualRefresh}
                  disabled={isRefreshing}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition disabled:opacity-50"
                  title={t('sidebar.refresh')}
                >
                  <FiRefreshCw className={`text-sm ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  title={t('sidebar.settings')}
                >
                  <FiSettings className="text-sm" />
                </button>
                {emails.length > 0 && (
                  <button
                    onClick={deleteAllEmails}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition"
                    title={t('sidebar.deleteAll')}
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('settings.title')}</h3>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings.autoRefresh')}</span>
                    <input
                      type="checkbox"
                      checked={autoRefreshEnabled}
                      onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </label>
                  {autoRefreshEnabled && (
                    <select
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="10">10 {t('settings.seconds')}</option>
                      <option value="15">15 {t('settings.seconds')}</option>
                      <option value="30">30 {t('settings.seconds')}</option>
                      <option value="60">60 {t('settings.seconds')}</option>
                      <option value="120">120 {t('settings.seconds')}</option>
                      <option value="300">300 {t('settings.seconds')}</option>
                    </select>
                  )}
                  {lastRefresh && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.lastUpdate')} {formatDistanceToNow(lastRefresh, { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email Items */}
            <div className="flex-1 overflow-y-auto">
              {emails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <FiInbox className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">{t('sidebar.noEmails')}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {emailAddress ? t('sidebar.waitingMessages') : t('sidebar.generateToStart')}
                  </p>
                </div>
              ) : (
                emails.map((email) => (
                  <div
                    key={email._id}
                    onClick={() => viewEmail(email._id)}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition ${
                      selectedEmail?._id === email._id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-white truncate flex-1 min-w-0">
                        {email.sender}
                      </span>
                      {!email.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate mb-1 pr-2">
                      {email.subject}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FiClock className="mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {formatDistanceToNow(new Date(email.receivedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Ad Space - Top Banner */}
          <div className="bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 p-2 flex items-center justify-center">
            <div className="bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg px-6 py-3 border border-dashed border-slate-400 dark:border-slate-500">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                📢 {t('landing.adSpace')} 728x90
              </p>
            </div>
          </div>

          {/* Top Bar */}
          <header className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <FiMenu className="text-xl text-gray-600 dark:text-gray-300" />
                </button>
                
                {emailAddress ? (
                  <div>
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {selectedEmail ? selectedEmail.subject : t('header.inbox')}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedEmail ? `${t('email.from')}: ${selectedEmail.sender}` : `${emails.length} message${emails.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{t('header.welcome')}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('header.getStarted')}</p>
                  </div>
                )}
              </div>
              
              {/* Language Switcher Button */}
              <LanguageButton />
            </div>
          </header>

          {/* Email Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {emailAddress ? (
              selectedEmail ? (
                <div className="h-full overflow-y-auto bg-gray-100 dark:bg-gray-900">
                  <div className="max-w-3xl mx-auto py-6 px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      {/* Email Header - Gmail Style */}
                      <div className="border-b border-gray-200 dark:border-gray-700">
                        {/* Subject Line */}
                        <div className="px-6 pt-5 pb-3">
                          <div className="flex items-start justify-between">
                            <h1 className="text-xl font-normal text-gray-900 dark:text-white pr-4">
                              {selectedEmail.subject}
                            </h1>
                            <button
                              onClick={() => deleteEmail(selectedEmail._id)}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full transition flex-shrink-0"
                              title={t('email.delete')}
                            >
                              <FiTrash2 className="text-base" />
                            </button>
                          </div>
                        </div>

                        {/* Sender Info - Gmail Style */}
                        <div className="px-6 pb-5">
                          <div className="flex items-start gap-3">
                            {/* Sender Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0 text-base">
                              {selectedEmail.sender.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* Sender Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-normal text-gray-900 dark:text-white text-sm">
                                    {selectedEmail.sender}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                  {formatDistanceToNow(new Date(selectedEmail.receivedAt), { addSuffix: true })}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {t('email.to')} {selectedEmail.recipient}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* View Mode Tabs - Only show if email has HTML */}
                      {selectedEmail.html && (
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          <div className="flex gap-1 px-6 pt-3">
                            <button
                              onClick={() => setEmailViewMode('html')}
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                                emailViewMode === 'html'
                                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <FiCode className="text-base" />
                              {t('email.htmlView')}
                            </button>
                            <button
                              onClick={() => setEmailViewMode('text')}
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                                emailViewMode === 'text'
                                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <FiFileText className="text-base" />
                              {t('email.plainText')}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Ad Space - Before Email Body */}
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border border-dashed border-gray-400 dark:border-gray-500 flex items-center justify-center min-h-[100px]">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            📢 {t('landing.adSpace')} 468x60
                          </p>
                        </div>
                      </div>

                      {/* Email Body */}
                      <div className="px-6 py-6 bg-gray-50 dark:bg-gray-900">
                        {/* HTML View */}
                        {emailViewMode === 'html' && selectedEmail.html ? (
                          <div className="email-content-wrapper">
                            <div 
                              className="email-content"
                              dangerouslySetInnerHTML={{ __html: selectedEmail.html }} 
                            />
                          </div>
                        ) : (
                          /* Plain Text View */
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                            <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap font-sans">
                              {selectedEmail.text}
                            </div>
                          </div>
                        )}

                        {/* Attachments */}
                        {selectedEmail.attachments?.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3 text-sm">
                              {selectedEmail.attachments.length} Attachment{selectedEmail.attachments.length > 1 ? 's' : ''}
                            </h3>
                            <div className="space-y-2">
                              {selectedEmail.attachments.map((att, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{att.filename}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {(att.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl flex items-center justify-center mb-6">
                    <FiMail className="text-5xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {t('email.noEmailSelected')}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('email.selectFromList')}
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30">
                  <FiMail className="text-6xl text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  {t('welcome.title')}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                  {t('welcome.subtitle')}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  {t('welcome.features')}
                </p>
                <div className={`bg-blue-50 dark:bg-blue-900/20 ${isRTL ? 'border-r-4' : 'border-l-4'} border-blue-500 p-4 rounded-lg max-w-md`}>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {isRTL ? '👉' : '👈'} {t('welcome.instruction')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Ad Space - Right Sidebar (Desktop) */}
        <aside className="hidden xl:flex w-48 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-700/50 flex-col">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <div className="text-4xl mb-2">📢</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  160x600
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
