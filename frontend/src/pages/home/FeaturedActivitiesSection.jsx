import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { Link } from "react-router-dom"
import styles from "./FeaturedActivitiesSection.module.scss"

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
        <div className={`${styles.header} fade-bottom-to-top`}>
          <h2 className={styles.title}>Hoạt động nổi bật</h2>
          <p className={styles.subtitle}>
            Tham gia các hoạt động thiện nguyện ý nghĩa và nhận điểm thưởng cho những đóng góp của bạn
          </p>
        </div>


        <div className={styles.grid}>
          {featuredActivities.map((activity, index) => (
            <Card
              key={activity.id}
              className={`${styles.card} fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={activity.image}
                  alt={activity.name || "Hình ảnh hoạt động"}
                  className={styles.image}
                  loading="lazy"
                />
                <Badge className={styles.badge}>+{activity.points} điểm</Badge>
              </div>
              <CardContent className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{activity.name}</h3>
                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <MapPin className={styles.icon} />
                    <span>{activity.area}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Calendar className={styles.icon} />
                    <span>{activity.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Users className={styles.icon} />
                    <span>
                      {activity.currentParticipants}/{activity.capacity} người tham gia
                    </span>
                  </div>
                </div>
                <div className={styles.btnWrapper}>
                  <Link
                    to={`/activities/${activity.id}`}
                    className={styles.button}
                    aria-label={`Xem chi tiết hoạt động ${activity.name}`}
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={styles.footer}>
          <Link
            to="/activities"
            className={styles.buttonOutline}
            aria-label="Xem tất cả hoạt động"
          >
            Xem tất cả hoạt động
          </Link>
        </div>
      </div>
    </section>
  )
}
