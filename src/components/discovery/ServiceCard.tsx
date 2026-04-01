'use client'

import Image from 'next/image'
import { useState } from 'react'

export interface ServiceCardProps {
  image: string
  category: string
  name: string
  rating?: number
  reviewCount?: number
  location: string
  price: string
  nextSlot?: string
  urgency?: string
  isPremium?: boolean
  onSelect?: () => void
}

export default function ServiceCard({
  image,
  category,
  name,
  rating,
  reviewCount,
  location,
  price,
  nextSlot,
  urgency,
  isPremium,
  onSelect,
}: ServiceCardProps) {
  const [liked, setLiked] = useState(false)

  const interactiveProps = onSelect
    ? {
        onClick: onSelect,
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect()
          }
        },
        role: 'button' as const,
        tabIndex: 0,
      }
    : {}

  if (isPremium) {
    return (
      <div
        {...interactiveProps}
        className="bg-white border border-[rgba(198,198,205,0.15)] shadow-sm overflow-hidden"
      >
        <div className="flex items-stretch gap-0">
          <div className="relative w-[110px] md:w-[140px] flex-shrink-0 overflow-hidden">
            <Image src={image} alt={name} fill sizes="140px" className="object-cover" />
          </div>

          <div className="flex-1 px-3 py-3 flex flex-col justify-between min-w-0">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-slate-400">
                Premium Partner
              </span>
              <h3 className="font-bold text-[#0B1C30] text-base md:text-lg leading-tight font-['Manrope',sans-serif] truncate">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[#45464D] text-xs">{location}</span>
                {typeof rating === 'number' ? (
                  <>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-0.5">
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.9125 9.5L2.725 5.9875L0 3.625L3.6 3.3125L5 0L6.4 3.3125L10 3.625L7.275 5.9875L8.0875 9.5L5 7.6375L1.9125 9.5Z" fill="#0B1C30"/>
                      </svg>
                      <span className="text-[#0B1C30] text-xs font-bold">{rating}</span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[#0B1C30] text-sm font-black">{price}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onSelect}
          className="w-full py-2.5 bg-[#EFF4FF] text-[#0B1C30] text-xs font-black tracking-widest uppercase hover:bg-[#DCE9FF] transition-colors border-t border-[rgba(198,198,205,0.2)]"
        >
          Fast Book
        </button>
      </div>
    )
  }

  return (
    <div
      {...interactiveProps}
      className="bg-white border border-[rgba(198,198,205,0.15)] shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="relative h-[200px] md:h-[195px] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="hidden md:block absolute top-3 left-3 bg-black px-2 py-1">
          <span className="text-white text-[10px] font-bold tracking-widest uppercase">
            {category}
          </span>
        </div>

        {typeof rating === 'number' ? (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 flex items-center gap-1 shadow-sm">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.9125 9.5L2.725 5.9875L0 3.625L3.6 3.3125L5 0L6.4 3.3125L10 3.625L7.275 5.9875L8.0875 9.5L5 7.6375L1.9125 9.5Z" fill="#0B1C30"/>
            </svg>
            <span className="text-[#0B1C30] text-xs font-bold">{rating}</span>
          </div>
        ) : null}

        <button
          onClick={(event) => {
            event.stopPropagation()
            setLiked(!liked)
          }}
          className="hidden md:flex absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm items-center justify-center rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label="Save to favorites"
        >
          <svg
            width="14"
            height="13"
            viewBox="0 0 24 22"
            fill={liked ? '#ef4444' : 'none'}
            stroke={liked ? '#ef4444' : '#0B1C30'}
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      <div className="px-3 md:px-4 pt-3 pb-3 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#0B1C30] text-sm md:text-base leading-snug font-['Manrope',sans-serif] flex-1">
            {name}
          </h3>
          <span className="text-[#0B1C30] text-sm font-black flex-shrink-0">{price}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1">
            <svg width="9" height="11" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.66667 5.83333C4.9875 5.83333 5.26215 5.7191 5.49062 5.49062C5.7191 5.26215 5.83333 4.9875 5.83333 4.66667C5.83333 4.34583 5.7191 4.07118 5.49062 3.84271C5.26215 3.61424 4.9875 3.5 4.66667 3.5C4.34583 3.5 4.07118 3.61424 3.84271 3.84271C3.61424 4.07118 3.5 4.34583 3.5 4.66667C3.5 4.9875 3.61424 5.26215 3.84271 5.49062C4.07118 5.7191 4.34583 5.83333 4.66667 5.83333ZM4.66667 10.1208C5.85278 9.03194 6.73264 8.04271 7.30625 7.15312C7.87986 6.26354 8.16667 5.47361 8.16667 4.78333C8.16667 3.72361 7.82882 2.8559 7.15312 2.18021C6.47743 1.50451 5.64861 1.16667 4.66667 1.16667C3.68472 1.16667 2.8559 1.50451 2.18021 2.18021C1.50451 2.8559 1.16667 3.72361 1.16667 4.78333C1.16667 5.47361 1.45347 6.26354 2.02708 7.15312C2.60069 8.04271 3.48056 9.03194 4.66667 10.1208ZM4.66667 11.6667C3.10139 10.3347 1.93229 9.09757 1.15937 7.95521C0.386458 6.81285 0 5.75556 0 4.78333C0 3.325 0.469097 2.16319 1.40729 1.29792C2.34549 0.432639 3.43194 0 4.66667 0C5.90139 0 6.98785 0.432639 7.92604 1.29792C8.86424 2.16319 9.33333 3.325 9.33333 4.78333C9.33333 5.75556 8.94688 6.81285 8.17396 7.95521C7.40104 9.09757 6.23194 10.3347 4.66667 11.6667Z" fill="#45464D"/>
            </svg>
            <span className="text-[#45464D] text-xs">{location}</span>
          </div>

          {urgency ? (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-red-500 text-xs font-semibold">{urgency}</span>
            </>
          ) : nextSlot ? (
            <>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-8h4v2h-6V7h2v5z" fill="#45464D"/>
                </svg>
                <span className="text-[#45464D] text-xs">{nextSlot}</span>
              </div>
            </>
          ) : null}

          {typeof rating === 'number' ? (
            <div className="hidden md:flex items-center gap-1 ml-auto">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.9125 9.5L2.725 5.9875L0 3.625L3.6 3.3125L5 0L6.4 3.3125L10 3.625L7.275 5.9875L8.0875 9.5L5 7.6375L1.9125 9.5Z" fill="#0B1C30"/>
              </svg>
              <span className="text-[#0B1C30] text-xs font-bold">{rating}</span>
              {typeof reviewCount === 'number' ? (
                <span className="text-[#76777D] text-xs">({reviewCount})</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
