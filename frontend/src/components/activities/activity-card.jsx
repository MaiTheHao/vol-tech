import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { Link } from "react-router-dom"
import styles from "./activity.module.scss"

export function ActivityCard({ activity }) {
  const statusConfig = {
    open: { label: "Đang mở", color: styles.statusOpen },
    full: { label: "Đã đủ người", color: styles.statusFull },
    "in-progress": { label: "Đang diễn ra", color: styles.statusInProgress },
    closed: { label: "Đã kết thúc", color: styles.statusClosed },
    registered: { label: "Bạn đang tham gia", color: styles.statusRegistered },
    participated: { label: "Bạn đã tham gia", color: styles.statusParticipated },
  }

  const statusInfo = statusConfig[activity.status]

  return (
    <Card className={styles.card}>
      <div className={styles.cardImageWrapper}>
        <img
          src={activity.image || "/placeholder.svg"}
          alt={activity.name}
          width={300}
          height={200}
          className={styles.cardImage}
        />
        <div className={styles.badgeLeft}>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>
        <div className={styles.badgeRight}>
          <Badge className={styles.pointsBadge}>+{activity.points} điểm</Badge>
        </div>
      </div>

      <CardContent className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{activity.name}</h3>
        <p className={styles.cardSummary}>{activity.summary}</p>

        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <MapPin className={styles.icon} />
            <span>{activity.area}</span>
          </div>
          <div className={styles.infoItem}>
            <Calendar className={styles.icon} />
            <span>{activity.date}</span>
          </div>
          <div className={styles.infoItem}>
            <Users className={styles.icon} />
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
  )
}
