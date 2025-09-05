"use client"

import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Calendar, MapPin, Crown } from "lucide-react"
import { Link } from 'react-router-dom'
import styles from "./ActivityHistory.module.scss"

export function ActivityHistory({ activities }) {
  const completedActivities = activities.filter((a) => a.status === "completed")
  const registeredActivities = activities.filter((a) => a.status === "registered")

  return (
    <div className={styles.wrapper}>
      {/* Completed activities */}
      <div>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Hoạt động đã tham gia</h2>
          <Badge variant="secondary">{completedActivities.length} hoạt động</Badge>
        </div>

        <div className={styles.grid}>
          {completedActivities.map((activity) => (
            <Card key={activity.id} className={styles.card}>
              <Link href={`/activities/${activity.id}`}>
                <div className={styles.imageWrapper}>
                  <img
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.name}
                    width={300}
                    height={150}
                    className={styles.image}
                  />
                  <Badge className={styles.pointsBadgeSuccess}>
                    <Crown className={styles.icon} />+{activity.points}
                  </Badge>
                </div>
                <CardContent className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{activity.name}</h3>
                  <div className={styles.meta}>
                    <div className={styles.metaItem}>
                      <MapPin className={styles.icon} />
                      <span>{activity.area}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Calendar className={styles.icon} />
                      <span>{activity.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Registered activities */}
      {registeredActivities.length > 0 && (
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hoạt động đã đăng ký</h2>
            <Badge variant="secondary">{registeredActivities.length} hoạt động</Badge>
          </div>

          <div className={styles.grid}>
            {registeredActivities.map((activity) => (
              <Card key={activity.id} className={styles.card}>
                <Link href={`/activities/${activity.id}`}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.name}
                      width={300}
                      height={150}
                      className={styles.image}
                    />
                    <Badge className={styles.pointsBadgePrimary}>+{activity.points}</Badge>
                  </div>
                  <CardContent className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{activity.name}</h3>
                    <div className={styles.meta}>
                      <div className={styles.metaItem}>
                        <MapPin className={styles.icon} />
                        <span>{activity.area}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <Calendar className={styles.icon} />
                        <span>{activity.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
