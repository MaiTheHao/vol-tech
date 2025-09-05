import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import {Link} from "react-router-dom"
import styles from "./home-section.module.scss"

const featuredActivities = [
  {
    id: 1,
    name: "Hỗ trợ trẻ em vùng cao",
    image: "/placeholder-cizgl.png",
    area: "Hà Giang",
    date: "15/12/2024",
    currentParticipants: 25,
    capacity: 50,
    points: 100,
    status: "open",
  },
  {
    id: 2,
    name: "Dọn dẹp môi trường biển",
    image: "/placeholder-rjwvr.png",
    area: "Đà Nẵng",
    date: "20/12/2024",
    currentParticipants: 40,
    capacity: 60,
    points: 80,
    status: "open",
  },
  {
    id: 3,
    name: "Chăm sóc người cao tuổi",
    image: "/placeholder-p4fuc.png",
    area: "TP. Hồ Chí Minh",
    date: "22/12/2024",
    currentParticipants: 15,
    capacity: 30,
    points: 120,
    status: "open",
  },
]

export function FeaturedActivitiesSection() {
  return (
    <section className={styles.featuredSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Hoạt động nổi bật</h2>
          <p className={styles.sectionSubtitle}>
            Tham gia các hoạt động thiện nguyện ý nghĩa và nhận điểm thưởng cho những đóng góp của bạn
          </p>
        </div>

        <div className={styles.activitiesGrid}>
          {featuredActivities.map((activity) => (
            <Card key={activity.id} className={styles.activityCard}>
              <div className={styles.activityImageWrapper}>
                <img
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.name}
                  width={300}
                  height={200}
                  className={styles.activityImage}
                />
                <Badge className={styles.activityBadge}>+{activity.points} điểm</Badge>
              </div>

              <CardContent className={styles.activityContent}>
                <h3 className={styles.activityTitle}>{activity.name}</h3>

                <div className={styles.activityMeta}>
                  <div className={styles.metaItem}>
                    <MapPin className={styles.metaIcon} />
                    <span>{activity.area}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Calendar className={styles.metaIcon} />
                    <span>{activity.date}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Users className={styles.metaIcon} />
                    <span>
                      {activity.currentParticipants}/{activity.capacity} người tham gia
                    </span>
                  </div>
                </div>

                <div className={styles.activityButton}>
                  <Button className="w-full" asChild>
                    <Link to={`/activities/${activity.id}`}>Xem chi tiết</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={styles.moreButton}>
          <Button size="lg" variant="outline" asChild>
            <Link to="/activities">Xem tất cả hoạt động</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
