import { ActivityCard } from "./activity-card"
import styles from "./activity.module.scss"

// Mock activities data
const activities = [
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
    summary: "Mang yêu thương đến với trẻ em vùng cao, tặng quà và học bổng cho các em.",
  },
  {
    id: 2,
    name: "Dọn dẹp môi trường biển",
    image: "/placeholder-rjwvr.png",
    area: "Đà Nẵng",
    date: "20/12/2024",
    currentParticipants: 60,
    capacity: 60,
    points: 80,
    status: "full",
    summary: "Bảo vệ môi trường biển, thu gom rác thải và tuyên truyền ý thức bảo vệ môi trường.",
  },
]

export function ActivityGrid() {
  return (
    <div className={styles.gridWrapper}>
      <div className={styles.gridHeader}>
        <p>
          Hiển thị <span>{activities.length}</span> hoạt động
        </p>
      </div>

      <div className={styles.grid}>
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  )
}
