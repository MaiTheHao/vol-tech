import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
// import { Separator } from "../ui/separator"
import { Calendar, Crown, MapPin, Users, Building2, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
// import ReactMarkdown from "react-markdown"
import styles from "./activity.module.scss"

export function ActivityDetailContent({ activity }) {
  const [isJoining, setIsJoining] = useState(false)

  const statusConfig = {
    open: { label: "Đang mở", color: styles.statusOpen },
    full: { label: "Đã đủ người", color: styles.statusFull },
    "in-progress": { label: "Đang diễn ra", color: styles.statusInProgress },
    closed: { label: "Đã kết thúc", color: styles.statusClosed },
    registered: { label: "Bạn đang tham gia", color: styles.statusRegistered },
    participated: { label: "Bạn đã tham gia", color: styles.statusParticipated },
  }

  const statusInfo = statusConfig[activity.status]
  const canJoin = activity.status === "open" && activity.currentParticipants < activity.capacity
  const isUserRegistered = activity.status === "registered"

  const handleJoin = async () => {
    setIsJoining(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsJoining(false)
    alert("Đăng ký tham gia thành công!")
  }

  const handleLeave = async () => {
    setIsJoining(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsJoining(false)
    alert("Đã hủy đăng ký tham gia!")
  }

  return (
    <div className={styles.detailWrapper}>
      <div className={styles.container}>
        {/* Back button */}
        <div className={styles.backBtn}>
          <Button variant="ghost" asChild className={styles.backBtnInner}>
            <Link to="/activities">
              <ArrowLeft className={styles.icon} />
              Quay lại danh sách
            </Link>
          </Button>
        </div>

        <div className={styles.detailGrid}>
          {/* Hero */}
          <div className={styles.heroBanner}>
            <img
              src={activity.image || "/placeholder.svg"}
              alt={activity.name}
              width={1200}
              height={400}
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <div className={styles.heroBadges}>
                <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                <Badge className={styles.pointsBadge}>
                  <Crown className={styles.smallIcon} />+{activity.points} điểm
                </Badge>
              </div>
              <h1 className={styles.heroTitle}>{activity.name}</h1>
              <p className={styles.heroSummary}>{activity.summary}</p>
            </div>
          </div>

          <div className={styles.mainContent}>
            {/* Description */}
            <Card className={styles.card}>
              <CardContent className={styles.cardContent}>
                <h2 className={styles.sectionTitle}>Thông tin chi tiết</h2>
                <div className={styles.markdown}>
                  <ReactMarkdown>{activity.description}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Activity info */}
            <Card className={styles.card}>
              <CardContent className={styles.cardContent}>
                <h3 className={styles.subTitle}>Thông tin hoạt động</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <Calendar className={styles.icon} />
                    <div>
                      <div>{activity.date}</div>
                      <div>{activity.time}</div>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <MapPin className={styles.icon} />
                    <div>
                      <div>{activity.area}</div>
                      <div>{activity.location}</div>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <Building2 className={styles.icon} />
                    <div>{activity.organizer}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <Users className={styles.icon} />
                    <div>
                      <div>
                        {activity.currentParticipants}/{activity.capacity} người tham gia
                      </div>
                      <div>Còn {activity.capacity - activity.currentParticipants} chỗ trống</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Join button */}
                <div>
                  {isUserRegistered ? (
                    <Button variant="destructive" className={styles.fullWidth} onClick={handleLeave} disabled={isJoining}>
                      {isJoining ? "Đang xử lý..." : "Hủy đăng ký"}
                    </Button>
                  ) : canJoin ? (
                    <Button className={styles.fullWidth} onClick={handleJoin} disabled={isJoining}>
                      {isJoining ? "Đang đăng ký..." : "Tham gia hoạt động"}
                    </Button>
                  ) : (
                    <Button className={styles.fullWidth} disabled>
                      {activity.status === "full" ? "Đã đủ người" : "Không thể tham gia"}
                    </Button>
                  )}
                  <p className={styles.pointsNote}>
                    Bạn sẽ nhận được <span>+{activity.points} điểm</span> khi hoàn thành hoạt động
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className={styles.card}>
              <CardContent className={styles.cardContent}>
                <h3 className={styles.subTitle}>Tiến độ đăng ký</h3>
                <div>
                  <div className={styles.progressHeader}>
                    <span>Đã đăng ký</span>
                    <span>
                      {activity.currentParticipants}/{activity.capacity}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${(activity.currentParticipants / activity.capacity) * 100}%` }}
                    />
                  </div>
                  <p>{Math.round((activity.currentParticipants / activity.capacity) * 100)}% đã đăng ký</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
