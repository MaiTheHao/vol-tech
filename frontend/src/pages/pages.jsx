import MainLayout from "../components/layout/mainlayout/Mainlayout";
import { HeroSection } from "./home/HeroSection";
import { ValuesSection } from "./home/ValuesSection";
import { FeaturedActivitiesSection } from "./home/FeaturedActivitiesSection";


export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <ValuesSection/>
      <FeaturedActivitiesSection/>
    </MainLayout>
  )
}