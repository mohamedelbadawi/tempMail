import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiMail, FiShield, FiClock, FiZap, FiCheck, FiArrowRight, FiGlobe, FiLock, FiRefreshCw } from 'react-icons/fi'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LanguageButton from '../components/LanguageButton'

export default function Landing() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const isRTL = router.locale === 'ar'

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{t('landing.metaTitle')}</title>
        <meta name="title" content={t('landing.metaTitle')} />
        <meta name="description" content={t('landing.metaDescription')} />
        <meta name="keywords" content={t('landing.metaKeywords')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content={router.locale === 'ar' ? 'Arabic' : 'English'} />
        <meta name="author" content="Noxil Mail" />
        <link rel="canonical" href={`https://noxilmail.com${router.locale === 'ar' ? '/ar' : ''}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://noxilmail.com${router.locale === 'ar' ? '/ar' : ''}`} />
        <meta property="og:title" content={t('landing.metaTitle')} />
        <meta property="og:description" content={t('landing.metaDescription')} />
        <meta property="og:image" content="https://noxilmail.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Noxil Mail" />
        <meta property="og:locale" content={router.locale === 'ar' ? 'ar_SA' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://noxilmail.com${router.locale === 'ar' ? '/ar' : ''}`} />
        <meta name="twitter:title" content={t('landing.metaTitle')} />
        <meta name="twitter:description" content={t('landing.metaDescription')} />
        <meta name="twitter:image" content="https://noxilmail.com/twitter-image.png" />
        <meta name="twitter:creator" content="@noxilmail" />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Noxil Mail" />
        
        {/* Alternate Languages */}
        <link rel="alternate" hrefLang="en" href="https://noxilmail.com" />
        <link rel="alternate" hrefLang="ar" href="https://noxilmail.com/ar" />
        <link rel="alternate" hrefLang="x-default" href="https://noxilmail.com" />
        
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Noxil Mail",
              "alternateName": "Temporary Email Service",
              "url": "https://noxilmail.com",
              "logo": "https://noxilmail.com/logo.png",
              "description": t('landing.metaDescription'),
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Free temporary email",
                "No registration required",
                "Unlimited emails",
                "Auto-refresh inbox",
                "Privacy protection",
                "Spam prevention"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "2847",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950">
        {/* Header */}
        <header className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <FiMail className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t('landing.brandName')}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <LanguageButton />
                <Link href="/app">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105">
                    {t('landing.getStarted')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
                <h1 className={`text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white ${isRTL ? 'mb-8 leading-relaxed' : 'mb-6 leading-tight'}`}>
                  {t('landing.heroTitle')}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 animate-gradient">
                    {t('landing.heroHighlight')}
                  </span>
                </h1>
                <p className={`text-xl text-slate-600 dark:text-slate-300 ${isRTL ? 'mb-10 leading-relaxed' : 'mb-8'}`}>
                  {t('landing.heroDescription')}
                </p>
                
                <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'md:justify-end' : 'md:justify-start'} ${isRTL ? 'mb-10' : 'mb-8'}`}>
                  <Link href="/app">
                    <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-300 font-bold shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 flex items-center justify-center gap-2 hover:scale-105 transform">
                      {t('landing.tryFree')}
                      {isRTL ? <FiArrowRight className="transform rotate-180 group-hover:translate-x-1 transition-transform" /> : <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </Link>
                </div>

                {/* Stats */}
                <div className={`flex flex-wrap gap-8 justify-center ${isRTL ? 'md:justify-end' : 'md:justify-start'}`}>
                  <div className="text-center">
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">100%</div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{t('landing.statFree')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">∞</div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{t('landing.statUnlimited')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">0</div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{t('landing.statRegistration')}</div>
                  </div>
                </div>
              </div>

              {/* Right - Ad Space 1 (Skyscraper) */}
              <div className="flex justify-center">
                <div className="w-full max-w-md bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center min-h-[600px]">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📢</div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {t('landing.adSpace')} 300x600
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Space 2 (Leaderboard) */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="text-6xl mb-4">📢</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {t('landing.adSpace')} 728x90 (Leaderboard)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                {t('landing.featuresTitle')}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                {t('landing.featuresSubtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl border border-indigo-100 dark:border-slate-600 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/50 transition-all">
                  <FiZap className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {t('landing.feature1Title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {t('landing.feature1Description')}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl border border-purple-100 dark:border-slate-600 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all">
                  <FiShield className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {t('landing.feature2Title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {t('landing.feature2Description')}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl border border-blue-100 dark:border-slate-600 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all">
                  <FiClock className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {t('landing.feature3Title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {t('landing.feature3Description')}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl border border-violet-100 dark:border-slate-600 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30 group-hover:shadow-xl group-hover:shadow-violet-500/50 transition-all">
                  <FiLock className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {t('landing.feature4Title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {t('landing.feature4Description')}
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl border border-sky-100 dark:border-slate-600 hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-sky-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/30 group-hover:shadow-xl group-hover:shadow-sky-500/50 transition-all">
                  <FiRefreshCw className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {t('landing.feature5Title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {t('landing.feature5Description')}
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl border border-fuchsia-100 dark:border-slate-600 hover:shadow-2xl hover:shadow-fuchsia-500/20 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-fuchsia-500/30 group-hover:shadow-xl group-hover:shadow-fuchsia-500/50 transition-all">
                  <FiGlobe className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {t('landing.feature6Title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {t('landing.feature6Description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Space 3 (Medium Rectangle) */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="text-6xl mb-4">📢</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {t('landing.adSpace')} 300x250 (Medium Rectangle)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('landing.howItWorksTitle')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t('landing.howItWorksSubtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('landing.step1Title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('landing.step1Description')}
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('landing.step2Title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('landing.step2Description')}
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('landing.step3Title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('landing.step3Description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg">
              {t('landing.ctaTitle')}
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              {t('landing.ctaDescription')}
            </p>
            <Link href="/app">
              <button className="group px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-slate-50 transition-all duration-300 font-bold shadow-2xl flex items-center justify-center gap-2 mx-auto hover:scale-105 transform">
                {t('landing.ctaButton')}
                {isRTL ? <FiArrowRight className="transform rotate-180 group-hover:translate-x-1 transition-transform" /> : <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <FiMail className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">{t('landing.brandName')}</span>
            </div>
            <p className="text-slate-400 mb-6">
              {t('landing.footerTagline')}
            </p>
            <p className="text-slate-500 text-sm">
              {t('landing.footerCopyright')} {t('landing.brandName')}. {t('landing.footerRights')}
            </p>
          </div>
        </footer>
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
