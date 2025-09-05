import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Crown, TrendingUp, Award, Target } from "lucide-react"
import styles from "./VolunteerPoints.module.scss"

export function VolunteerPoints({ points }) {
  const getLevel = (points) => {
    if (points >= 2000) return { name: "Chuyên gia", color: styles.purple, bgColor: styles.bgPurple }
    if (points >= 1000) return { name: "Thành thạo", color: styles.blue, bgColor: styles.bgBlue }
    if (points >= 500) return { name: "Tích cực", color: styles.green, bgColor: styles.bgGreen }
    if (points >= 100) return { name: "Khởi đầu", color: styles.yellow, bgColor: styles.bgYellow }
    return { name: "Mới tham gia", color: styles.gray, bgColor: styles.bgGray }
  }

  const level = getLevel(points)
  const nextLevelThreshold =
    points >= 2000 ? 2000 : points >= 1000 ? 2000 : points >= 500 ? 1000 : points >= 100 ? 500 : 100
  const progressToNext =
    points >= 2000
      ? 100
      : ((points %
          (nextLevelThreshold === 2000
            ? 1000
            : nextLevelThreshold === 1000
            ? 500
            : nextLevelThreshold === 500
            ? 400
            : 100)) /
          (nextLevelThreshold === 2000
            ? 1000
            : nextLevelThreshold === 1000
            ? 500
            : nextLevelThreshold === 500
            ? 400
            : 100)) *
        100

  return (
    <div className={styles.wrapper}>
      {/* Main points display */}
      <Card className={`${styles.mainCard}`}>
        <CardContent className={styles.mainContent}>
          <div className={styles.pointsDisplay}>
            <Crown className={styles.iconCrown} />
            <div className={styles.pointsValue}>{points.toLocaleString()}</div>
          </div>
          <h2 className={styles.title}>Điểm tình nguyện</h2>
          <p className={styles.subtitle}>Tổng điểm bạn đã tích lũy được từ các hoạt động thiện nguyện</p>

          {/* Level badge */}
          <div className={styles.levelWrapper}>
            <div className={`${styles.levelBadge} ${level.bgColor}`}>
              <Award className={`${styles.levelIcon} ${level.color}`} />
              <span className={`${styles.levelText} ${level.color}`}>Cấp độ: {level.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className={styles.statsWrapper}>
        <Card className={styles.statCard}>
          <CardContent className={styles.statContent}>
            <div className={styles.statHeader}>
              <TrendingUp className={styles.statIconSuccess} />
              <h3 className={styles.statTitle}>Tiến độ cấp độ</h3>
            </div>
            <div className={styles.progressBox}>
              <div className={styles.progressHeader}>
                <span>Tiến độ</span>
                <span className={styles.progressValue}>{Math.round(progressToNext)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progressToNext}%` }} />
              </div>
              {points < 2000 && (
                <p className={styles.progressNote}>Còn {nextLevelThreshold - points} điểm để lên cấp tiếp theo</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent className={styles.statContent}>
            <div className={styles.statHeader}>
              <Target className={styles.statIconPrimary} />
              <h3 className={styles.statTitle}>Thống kê</h3>
            </div>
            <div className={styles.statList}>
              <div className={styles.statRow}>
                <span>Hoạt động đã tham gia</span>
                <span className={styles.statValue}>8</span>
              </div>
              <div className={styles.statRow}>
                <span>Hoạt động đã hoàn thành</span>
                <span className={styles.statValue}>6</span>
              </div>
              <div className={styles.statRow}>
                <span>Điểm trung bình/hoạt động</span>
                <span className={styles.statValue}>104</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


