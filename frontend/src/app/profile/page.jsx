import { MainLayout } from "@/components/layout/main-layout"
import { ProfileHeader } from "@/components/profile/profile-header"
import { VolunteerPoints } from "@/components/profile/volunteer-points"
import { ActivityHistory } from "@/components/profile/activity-history"
import styles from "./ProfilePage.module.scss"

// Mock user data
const mockUser = {
  name: "Nguyễn Văn An",
  avatar: "/diverse-user-avatars.png",
  points: 1250,
  dateOfBirth: "15/03/1995",
  organization: "Công ty TNHH Công nghệ ABC",
  email: "nguyenvanan@email.com",
  phone: "0123.456.789",
  joinDate: "01/01/2023",
}

// Mock participated activities
const participatedActivities = [
  {
    id: 1,
    name: "Hỗ trợ trẻ em vùng cao",
    image: "/placeholder-cizgl.png",
    area: "Hà Giang",
    date: "15/11/2024",
    points: 100,
    status: "completed",
  },
  {
    id: 2,
    name: "Tặng sách cho trẻ em",
    image: "/placeholder-rjwvr.png",
    area: "Hà Nội",
    date: "05/11/2024",
    points: 90,
    status: "completed",
  },
  {
    id: 3,
    name: "Khám bệnh miễn phí",
    image: "/placeholder-p4fuc.png",
    area: "Cần Thơ",
    date: "01/11/2024",
    points: 110,
    status: "completed",
  },
  {
    id: 4,
    name: "Chăm sóc người cao tuổi",
    image: "/placeholder-p4fuc.png",
    area: "TP. Hồ Chí Minh",
    date: "22/12/2024",
    points: 120,
    status: "registered",
  },
  {
    id: 5,
    name: "Trồng cây xanh",
    image: "/placeholder-cizgl.png",
    area: "Hải Phòng",
    date: "25/12/2024",
    points: 70,
    status: "registered",
  },
  {
    id: 6,
    name: "Dọn dẹp công viên",
    image: "/placeholder-rjwvr.png",
    area: "Đà Nẵng",
    date: "10/10/2024",
    points: 80,
    status: "completed",
  },
  {
    id: 7,
    name: "Hỗ trợ người khuyết tật",
    image: "/placeholder-p4fuc.png",
    area: "Huế",
    date: "15/09/2024",
    points: 130,
    status: "completed",
  },
  {
    id: 8,
    name: "Dạy học miễn phí",
    image: "/placeholder-cizgl.png",
    area: "Lào Cai",
    date: "20/08/2024",
    points: 100,
    status: "completed",
  },
]

export default function ProfilePage() {
  return (
    <MainLayout isLoggedIn={true} user={mockUser}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.content}>
            <ProfileHeader user={mockUser} />
            <VolunteerPoints points={mockUser.points} />
            <ActivityHistory activities={participatedActivities} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
