import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import styles from "./NotFound.module.scss"

export default function NotFound() {
  return (
    <MainLayout>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.code}>404</h1>
            <h2 className={styles.title}>Không tìm thấy trang</h2>
            <p className={styles.description}>
              Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
            </p>
            <Button asChild>
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
