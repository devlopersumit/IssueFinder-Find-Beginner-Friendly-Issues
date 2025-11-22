import React from 'react'

type LoadingProgressProps = {
  isLoading: boolean
  estimatedTime?: number
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ isLoading, estimatedTime }) => {
  if (!isLoading) return null

  return (
    <div className="w-full" role="progressbar" aria-label="Loading issues" aria-busy="true">
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-gray-700">
        <div className="h-full w-full animate-progress bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_100%]" />
      </div>
      {estimatedTime && estimatedTime > 2 && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Estimated time remaining: {estimatedTime} seconds
        </p>
      )}
    </div>
  )
}

