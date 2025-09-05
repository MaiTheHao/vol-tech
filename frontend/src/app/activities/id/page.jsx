import { MainLayout } from "../../../components/layout/main-layout/MainLayout"
import { ActivityDetailContent } from "../../../components/activities/activity-deltail-content"
import { notFound } from "next/navigation"

// Mock user data
const mockUser = {
  name: "Nguyễn Văn An",
  avatar: "frontend/src/assets/Avatar/Avatars.png",
  points: 1250,
}

// Mock activities data - in real app this would come from database
const activities = [
  {
    id: 1,
    name: "Hỗ trợ trẻ em vùng cao",
    image: "/placeholder-cizgl.png",
    area: "Hà Giang",
    date: "15/12/2024",
    time: "08:00 - 17:00",
    location: "Xã Phố Bảng, Huyện Đồng Văn, Hà Giang",
    organizer: "Hội Thiện nguyện Hà Nội",
    currentParticipants: 25,
    capacity: 50,
    points: 100,
    status: "open",
    summary: "Mang yêu thương đến với trẻ em vùng cao, tặng quà và học bổng cho các em.",
    description: `# Về hoạt động

Chương trình "Hỗ trợ trẻ em vùng cao" là một hoạt động thiện nguyện ý nghĩa nhằm mang lại niềm vui và hỗ trợ giáo dục cho các em nhỏ tại vùng cao Hà Giang.

## Mục tiêu chương trình

- **Hỗ trợ giáo dục**: Tặng sách vở, dụng cụ học tập cho các em học sinh
- **Chăm sóc sức khỏe**: Khám sức khỏe miễn phí, tặng thuốc và vitamin
- **Mang lại niềm vui**: Tổ chức các hoạt động vui chơi, giải trí cho trẻ em
- **Hỗ trợ gia đình**: Tặng quà, nhu yếu phẩm cho các gia đình khó khăn

## Hoạt động cụ thể

### Sáng (08:00 - 12:00)
- Tập trung tại điểm hẹn, di chuyển lên vùng cao
- Thăm hỏi, tặng quà cho các gia đình
- Khám sức khỏe miễn phí cho trẻ em

### Chiều (13:00 - 17:00)  
- Tổ chức các trò chơi, hoạt động giải trí
- Tặng sách vở, dụng cụ học tập
- Chia sẻ kinh nghiệm học tập với các em

## Yêu cầu tham gia

- Có tinh thần thiện nguyện, yêu thương trẻ em
- Sức khỏe tốt, có thể di chuyển địa hình khó khăn
- Tuân thủ quy định an toàn của ban tổ chức
- Mang theo giấy tờ tùy thân

## Lưu ý quan trọng

⚠️ **Thời tiết vùng cao có thể thay đổi đột ngột, các tình nguyện viên cần chuẩn bị áo ấm và đồ dùng cá nhân.**

📞 **Liên hệ**: Để biết thêm thông tin chi tiết, vui lòng liên hệ ban tổ chức qua hotline: 0123.456.789`,
  },
  {
    id: 2,
    name: "Dọn dẹp môi trường biển",
    image: "/placeholder-rjwvr.png",
    area: "Đà Nẵng",
    date: "20/12/2024",
    time: "06:00 - 11:00",
    location: "Bãi biển Mỹ Khê, Đà Nẵng",
    organizer: "Nhóm Xanh Đà Nẵng",
    currentParticipants: 60,
    capacity: 60,
    points: 80,
    status: "full",
    summary: "Bảo vệ môi trường biển, thu gom rác thải và tuyên truyền ý thức bảo vệ môi trường.",
    description: `# Dọn dẹp môi trường biển

Hoạt động dọn dẹp môi trường biển tại bãi biển Mỹ Khê nhằm bảo vệ hệ sinh thái biển và nâng cao ý thức cộng đồng.

## Hoạt động chính

- Thu gom rác thải trên bãi biển
- Phân loại và xử lý rác thải đúng cách  
- Tuyên truyền bảo vệ môi trường
- Trồng cây xanh ven biển`,
  },
  {
    id: 3,
    name: "Chăm sóc người cao tuổi",
    image: "/placeholder-p4fuc.png",
    area: "TP. Hồ Chí Minh",
    date: "22/12/2024",
    time: "14:00 - 17:00",
    location: "Viện dưỡng lão Thành phố, Quận 1",
    organizer: "Câu lạc bộ Tình nguyện TP.HCM",
    currentParticipants: 15,
    capacity: 30,
    points: 120,
    status: "registered",
    summary: "Thăm hỏi, chăm sóc và mang niềm vui đến với các cụ già tại viện dưỡng lão.",
    description: `# Chăm sóc người cao tuổi

Chương trình thăm hỏi và chăm sóc người cao tuổi tại viện dưỡng lão, mang lại niềm vui và sự quan tâm đến các cụ.

## Hoạt động

- Trò chuyện, chia sẻ với các cụ
- Hỗ trợ vệ sinh cá nhân
- Biểu diễn văn nghệ
- Tặng quà và nhu yếu phẩm`,
  },
]

export default async function ActivityDetailPage({ params }) {
  const { id } = await params
  const activity = activities.find((a) => a.id === Number.parseInt(id))

  if (!activity) {
    notFound()
  }

  return (
    <MainLayout isLoggedIn={true} user={mockUser}>
      <ActivityDetailContent activity={activity} />
    </MainLayout>
  )
}
