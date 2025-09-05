"use client"

import React from "react"
import { Header } from "../header/Header"
import { Footer } from "../footer/Footer"
import styles from "./MainLayout.module.scss"

export function MainLayout({ children, isLoggedIn, user }) {
  return (
    <div className={styles.layout}>
      <Header isLoggedIn={isLoggedIn} user={user} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}


