import { MainLayout } from "../components/layout/main-layout/MainLayout"
import { HeroSection } from "../components/home/hero-section"
import { ValuesSection } from "../components/home/value-section"
import { FeaturedActivitiesSection } from "../components/home/featured-activities-section"

import { ActivityCard } from "../components/activities/activity-card"
import { ActivityDetailContent } from "../components/activities/activity-deltail-content"
import { ActivityFilters } from "../components/activities/activity-filters"
import { ActivityGrid } from "../components/activities/activity-grid"

import { Routes, Route } from "react-router-dom";


// import styles from "./HomePage.module.scss"

// Mock user data - in real app this would come from authentication
const mockUser = {
  name: "Nguyễn Văn An",
  avatar: "frontend/src/assets/Avatar/Avatars.png",
  points: 1250,
}

export default function HomePage() {
  return (
    <MainLayout isLoggedIn={false} user={mockUser}>
      <HeroSection />
      <ValuesSection />
      <FeaturedActivitiesSection />
    </MainLayout>

  )
}

// export function ActivityPage() {
//   return (
//     <MainLayout isLoggedIn={false} user={null}>
//       <ActivityFilters/>
//     </MainLayout>
//   )
// }
