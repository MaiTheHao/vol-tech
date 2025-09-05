import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Calendar, Building2, Mail, Phone } from "lucide-react"
import styles from "./ProfileHeader.module.scss"

export function ProfileHeader({ user }) {
  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <div className={styles.container}>
          {/* Avatar */}
          <Avatar className={styles.avatar}>
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className={styles.avatarFallback}>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User info */}
          <div className={styles.userInfo}>
            <div>
              <h1 className={styles.userName}>{user.name}</h1>
              <Badge variant="secondary" className={styles.joinBadge}>
                Tham gia từ {user.joinDate}
              </Badge>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Calendar className={styles.icon} />
                <div>
                  <span className={styles.label}>Ngày sinh: </span>
                  <span className={styles.value}>{user.dateOfBirth}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Building2 className={styles.icon} />
                <div>
                  <span className={styles.label}>Đơn vị: </span>
                  <span className={styles.value}>{user.organization}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Mail className={styles.icon} />
                <div>
                  <span className={styles.label}>Email: </span>
                  <span className={styles.value}>{user.email}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Phone className={styles.icon} />
                <div>
                  <span className={styles.label}>Điện thoại: </span>
                  <span className={styles.value}>{user.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
