import { Card, CardContent } from "../ui/card"
import { Heart, Users, Target } from "lucide-react"
import styles from "./home-section.module.scss"

const values = [
  {
    icon: Heart,
    title: "Tình yêu thương",
    description:
      "Lan tỏa tình yêu thương và sự quan tâm đến những người xung quanh, tạo nên một cộng đồng ấm áp và đoàn kết.",
  },
  {
    icon: Users,
    title: "Cộng đồng",
    description:
      "Xây dựng mối liên kết bền chặt giữa các thành viên, cùng nhau hướng tới mục tiêu chung vì một xã hội tốt đẹp hơn.",
  },
  {
    icon: Target,
    title: "Hiệu quả",
    description: "Tối ưu hóa mọi hoạt động thiện nguyện để mang lại tác động tích cực và bền vững nhất cho cộng đồng.",
  },
]

export function ValuesSection() {
  return (
    <section className={styles.valuesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Giá trị cốt lõi</h2>
          <p className={styles.sectionSubtitle}>
            Những giá trị định hướng mọi hoạt động của chúng tôi trong việc xây dựng cộng đồng thiện nguyện
          </p>
        </div>

        <div className={styles.valuesGrid}>
          {values.map((value, index) => {
            const IconComponent = value.icon
            return (
              <Card key={index} className={styles.valueCard}>
                <CardContent className={styles.valueCardContent}>
                  <div className={styles.valueIcon}>
                    <IconComponent className={styles.valueSvg} />
                  </div>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueDesc}>{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
