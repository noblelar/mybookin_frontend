'use client'

import { useState, useEffect } from 'react'

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section
      className="w-full border-b overflow-x-hidden"
      style={{
        background: '#F8F9FF',
        borderColor: 'rgba(198, 198, 205, 0.15)',
        minHeight: isMobile ? 'auto' : '870px',
      }}
    >
      <div
        className="max-w-[1280px] mx-auto px-4 md:px-6"
        style={{
          paddingTop: isMobile ? '40px' : '80px',
          paddingBottom: isMobile ? '40px' : '80px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
          gap: isMobile ? '32px' : '48px',
        }}
      >
        {/* Left: Content */}
        <div className="flex flex-col gap-6">
          {/* Badge */}
          <div
            className="inline-flex w-max px-3 py-1"
            style={{ background: '#131B2E' }}
          >
            <span
              className="font-inter text-[10px] font-black uppercase"
              style={{ color: '#7C839B', letterSpacing: '2px' }}
            >
              Omni-Channel Architecture
            </span>
          </div>

          {/* Heading */}
          <h1
            className="font-manrope leading-none"
            style={{
              fontSize: isMobile ? '40px' : '72px',
              letterSpacing: isMobile ? '-2px' : '-3.6px',
              lineHeight: '1.1',
            }}
          >
            <span className="font-extrabold" style={{ color: '#0B1C30' }}>
              Your Favorite
              <br />
              Services,
              <br />
            </span>
            <span className="font-light" style={{ color: '#5C5E68' }}>
              Simplified.
            </span>
          </h1>

          {/* Description */}
          <div className="max-w-[576px] pb-4">
            <p
              className="font-inter font-normal"
              style={{
                fontSize: isMobile ? '14px' : '18px',
                color: '#45464D',
                lineHeight: '1.6',
              }}
            >
              Book experts, reserve resources, and manage appointments in one
              click. A Sovereign system built for absolute precision and zero
              friction.
            </p>
          </div>

          {/* Search Bar */}
          <div
            className="flex flex-col md:flex-row items-stretch gap-2 p-2 max-w-full md:max-w-[672px]"
            style={{
              background: '#FFF',
              border: '1px solid rgba(198, 198, 205, 0.10)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}
          >
            {/* Search Input */}
            <div
              className="flex items-center px-4 flex-1 min-w-0"
              style={{ background: '#EFF4FF' }}
            >
              <svg
                className="mr-2 flex-shrink-0"
                width="26"
                height="18"
                viewBox="0 0 26 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z"
                  fill="#76777D"
                />
              </svg>
              <div className="py-4 px-3 flex-1 min-w-0">
                <span
                  className="font-inter text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ color: '#6B7280' }}
                >
                  What are you looking for?
                </span>
              </div>
            </div>

            {/* Category Selector */}
            <div
              className="flex items-center px-4 min-w-[120px] md:min-w-[160px] cursor-pointer"
              style={{ background: '#EFF4FF' }}
            >
              <svg
                className="mr-2 flex-shrink-0"
                width="27"
                height="20"
                viewBox="0 0 27 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 9L9 0L14.5 9H3.5ZM14.5 20C13.25 20 12.1875 19.5625 11.3125 18.6875C10.4375 17.8125 10 16.75 10 15.5C10 14.25 10.4375 13.1875 11.3125 12.3125C12.1875 11.4375 13.25 11 14.5 11C15.75 11 16.8125 11.4375 17.6875 12.3125C18.5625 13.1875 19 14.25 19 15.5C19 16.75 18.5625 17.8125 17.6875 18.6875C16.8125 19.5625 15.75 20 14.5 20ZM0 19.5V11.5H8V19.5H0ZM14.5 18C15.2 18 15.7917 17.7583 16.275 17.275C16.7583 16.7917 17 16.2 17 15.5C17 14.8 16.7583 14.2083 16.275 13.725C15.7917 13.2417 15.2 13 14.5 13C13.8 13 13.2083 13.2417 12.725 13.725C12.2417 14.2083 12 14.8 12 15.5C12 16.2 12.2417 16.7917 12.725 17.275C13.2083 17.7583 13.8 18 14.5 18ZM2 17.5H6V13.5H2V17.5ZM7.05 7H10.95L9 3.85L7.05 7Z"
                  fill="#76777D"
                />
              </svg>
              <span
                className="font-inter text-sm font-bold flex-1 hidden md:block"
                style={{ color: '#0B1C30' }}
              >
                Category
              </span>
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.2998 8.39999L10.4998 12.6L14.6998 8.39999"
                  stroke="#6B7280"
                  strokeWidth="1.575"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Search Button */}
            <button
              className="flex items-center justify-center gap-2 px-6 md:px-8 font-inter text-xs md:text-sm font-bold uppercase text-white hover:bg-gray-900 transition-colors flex-1 md:flex-none"
              style={{
                background: '#000',
                letterSpacing: '1.4px',
                paddingTop: '16.5px',
                paddingBottom: '17.5px',
              }}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.95 9L3.525 5.475L0 4.05V3.35L9 0L5.65 9H4.95ZM5.275 7.15L7.3 1.7L1.85 3.725L4.3 4.7L5.275 7.15Z"
                  fill="white"
                />
              </svg>
              <span className="hidden md:inline">Search Nearby</span>
              <span className="md:hidden">Search</span>
            </button>
          </div>
        </div>

        {/* Right: Dual-Focus Visual - Hidden on mobile */}
        {!isMobile && (
          <div className="relative hidden md:block" style={{ height: '600px' }}>
            {/* Main panel - Business Architect View (top right) */}
            <div
              className="absolute overflow-hidden"
              style={{
                width: '474px',
                height: '500px',
                right: '0',
                top: '0',
                background: '#D3E4FE',
                border: '1px solid rgba(198, 198, 205, 0.20)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/f2aa736095396c625377fa3822964fee02b028e5?width=943"
                alt="Business Architect dashboard view"
                className="w-full h-full object-cover"
                style={{ opacity: 0.8 }}
              />
              <div
                className="absolute"
                style={{ top: '17px', left: '17px', background: '#000' }}
              >
                <span
                  className="font-inter text-[10px] font-bold uppercase px-3 py-1 text-white block"
                  style={{ letterSpacing: '1px' }}
                >
                  Business Architect View
                </span>
              </div>
            </div>

            {/* Overlay panel - User Interface (bottom left) */}
            <div
              className="absolute overflow-hidden"
              style={{
                width: '266px',
                height: '450px',
                left: '0',
                top: '150px',
                background: '#FFF',
                border: '8px solid #EFF4FF',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/7112e148ef0f9b526f7070a4f02abfee6a33df1c?width=501"
                alt="User interface view"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute"
                style={{ top: '24px', left: '24px', background: '#5C5E68' }}
              >
                <span
                  className="font-inter text-[10px] font-bold uppercase px-3 py-1 text-white block"
                  style={{ letterSpacing: '1px' }}
                >
                  User Interface
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
