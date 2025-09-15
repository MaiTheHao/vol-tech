import MainLayout from "./layout/mainlayout/Mainlayout";
import { HeroSection } from "../pages/home/HeroSection";
import { ValuesSection } from "../pages/home/ValuesSection";
import { FeaturedActivitiesSection } from "../pages/home/FeaturedActivitiesSection";


export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <ValuesSection/>
      <FeaturedActivitiesSection/>
    </MainLayout>
  )
}