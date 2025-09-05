import { useState } from "react"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { X } from "lucide-react"
import styles from "./activity.module.scss"

const provinces = [
  { value: "hanoi", label: "Hà Nội" },
  { value: "hcm", label: "TP. Hồ Chí Minh" },
  { value: "danang", label: "Đà Nẵng" },
  { value: "haiphong", label: "Hải Phòng" },
  { value: "hagiang", label: "Hà Giang" },
  { value: "laocai", label: "Lào Cai" },
]

const communes = {
  hanoi: [
    { value: "dongda", label: "Đống Đa" },
    { value: "badinh", label: "Ba Đình" },
    { value: "hoankiem", label: "Hoàn Kiếm" },
  ],
  hcm: [
    { value: "quan1", label: "Quận 1" },
    { value: "quan3", label: "Quận 3" },
    { value: "quan7", label: "Quận 7" },
  ],
}

const statusOptions = [
  { value: "open", label: "Đang mở", color: styles.statusOpen },
  { value: "full", label: "Đã đủ người", color: styles.statusFull },
  { value: "in-progress", label: "Đang diễn ra", color: styles.statusInProgress },
  { value: "closed", label: "Đã kết thúc", color: styles.statusClosed },
  { value: "registered", label: "Bạn đang tham gia", color: styles.statusRegistered },
  { value: "participated", label: "Bạn đã tham gia", color: styles.statusParticipated },
]

export function ActivityFilters() {
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCommune, setSelectedCommune] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState([])

  const handleStatusToggle = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const clearFilters = () => {
    setSelectedProvince("")
    setSelectedCommune("")
    setSelectedStatuses([])
  }

  const hasActiveFilters = selectedProvince || selectedCommune || selectedStatuses.length > 0

  return (
    <div className={styles.filtersWrapper}>
      {/* Header */}
      <div className={styles.filtersHeader}>
        <h2>Bộ lọc</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className={styles.clearBtn}>
            <X className={styles.icon} />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Province & Commune */}
      <div className={styles.filtersGrid}>
        <div>
          <label>Tỉnh/Thành phố</label>
          <Select
              value={selectedProvince}
              onValueChange={(value) => {
                setSelectedProvince(value)
                setSelectedCommune("")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tỉnh/thành phố" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        <div>
          <label>Quận/Huyện</label>
          <Select
            value={selectedCommune}
            onValueChange={setSelectedCommune}
            disabled={!selectedProvince}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn quận/huyện" />
            </SelectTrigger>
            <SelectContent>
              {selectedProvince &&
                communes[selectedProvince]?.map((commune) => (
                  <SelectItem key={commune.value} value={commune.value}>
                    {commune.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status */}
      <div>
        <label>Trạng thái</label>
        <div className={styles.statusList}>
          {statusOptions.map((status) => (
            <Badge
              key={status.value}
              variant={selectedStatuses.includes(status.value) ? "default" : "outline"}
              className={`${styles.statusBadge} ${
                selectedStatuses.includes(status.value)
                  ? status.color
                  : styles.statusInactive
              }`}
              onClick={() => handleStatusToggle(status.value)}
            >
              {status.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          {selectedProvince && (
            <Badge>
              {provinces.find((p) => p.value === selectedProvince)?.label}
              <X onClick={() => setSelectedProvince("")} className={styles.closeIcon} />
            </Badge>
          )}
          {selectedCommune && (
            <Badge>
              {communes[selectedProvince]?.find((c) => c.value === selectedCommune)?.label}
              <X onClick={() => setSelectedCommune("")} className={styles.closeIcon} />
            </Badge>
          )}
          {selectedStatuses.map((status) => (
            <Badge key={status}>
              {statusOptions.find((s) => s.value === status)?.label}
              <X
                onClick={() => handleStatusToggle(status)}
                className={styles.closeIcon}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
