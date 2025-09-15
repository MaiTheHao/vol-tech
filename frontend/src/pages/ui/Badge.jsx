import React from "react"
import styles from "./Badge.module.scss"

export function Badge({ children, className = "", ...props }) {
  return (
    <span className={`${styles.badge} ${className}`} {...props}>
      {children}
    </span>
  )
}
