import { Button } from "../ui/button"
import { ArrowRight, Heart, Users } from "lucide-react"
import {Link} from "react-router-dom"
import styles from "./home-section.module.scss"

export function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.heroTextBlock}>
            <h1 className={styles.heroTitle}>
              Kết nối trái tim
              <br />
              <span className={styles.heroAccent}>thiện nguyện</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Tham gia cộng đồng tình nguyện viên, góp phần xây dựng xã hội tốt đẹp và tạo ra những giá trị tích cực cho
              cuộc sống
            </p>
          </div>

          <div className={styles.heroButtons}>
            <Button size="lg" className={styles.ctaButton} asChild>
              <Link to="/activities" className={styles.ctaLink}>
                Khám phá hoạt động
                <ArrowRight className={styles.ctaIcon} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className={styles.secondaryButton} asChild>
              <Link to="/about" className={styles.ctaLink}>Tìm hiểu thêm</Link>
            </Button>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <Users className={styles.statSvg} />
              </div>
              <div>
                <div className={styles.statNumber}>5,000+</div>
                <div className={styles.statLabel}>Tình nguyện viên</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <Heart className={styles.statSvg} />
              </div>
              <div>
                <div className={styles.statNumber}>1,200+</div>
                <div className={styles.statLabel}>Hoạt động</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
