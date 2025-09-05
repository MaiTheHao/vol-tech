import React from "react"

// Avatar wrapper
export function Avatar({ children, className }) {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ""}`}>
      {children}
    </div>
  )
}

// AvatarImage
export function AvatarImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="aspect-square h-full w-full object-cover"
    />
  )
}

// AvatarFallback
export function AvatarFallback({ children }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm font-medium text-gray-600">
      {children}
    </div>
  )
}
