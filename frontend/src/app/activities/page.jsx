// import { MainLayout } from "../../components/layout/main-layout/MainLayout"
// import { ActivityFilters } from "../../components/activities/activity-filters"
// import { ActivityGrid } from "../../components/activities/activity-grid"
// import styles from "./page.module.scss"


// // Mock user data
// const mockUser = {
//   name: "Nguyễn Văn An",
//   avatar: "frontend/src/assets/Avatar/Dog.jpg",
//   points: 1250,
// }

// export default function ActivitiesPage() {
//   return (
//     <MainLayout isLoggedIn={true} user={mockUser}>
//       <div className={styles.wrapper}>
//         <div className={styles.container}>
//           <div className={styles.content}>
//             {/* Page header */}
//             <div className={styles.header}>
//               <h1 className={styles.title}>Hoạt động thiện nguyện</h1>
//               <p className={styles.subtitle}>
//                 Khám phá và tham gia các hoạt động thiện nguyện ý nghĩa trong cộng đồng
//               </p>
//             </div>

//             {/* Filters */}
//             <ActivityFilters />

//             {/* Activities grid */}
//             <ActivityGrid />
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   )
// }

"use client"

import React from "react";
import { MainLayout } from "../../components/layout/main-layout/MainLayout";
import { ActivityFilters } from "../../components/activities/activity-filters";
import { ActivityGrid } from "../../components/activities/activity-grid";
import styles from "./page.module.scss";
import Dog from '../../assets/Avatar/Dog.jpg'

export default function ActivitiesPage() {
  const [user, setUser] = React.useState(null);

  // Mock API call
  React.useEffect(() => {
    setTimeout(() => {
      setUser({
        name: "Nguyễn Văn An",
        avatar: "Dog" /*"https://i.pravatar.cc/150?img=3"*/, // URL avatar từ API mock
        points: 1250,
      });
    }, 500); // giả lập delay fetch
  }, []);

  return (
    <MainLayout isLoggedIn={!!user} user={user}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.content}>
            {/* Page header */}
            <div className={styles.header}>
              <h1 className={styles.title}>Hoạt động thiện nguyện</h1>
              <p className={styles.subtitle}>
                Khám phá và tham gia các hoạt động thiện nguyện ý nghĩa trong cộng đồng
              </p>
            </div>

            {/* Filters */}
            <ActivityFilters />

            {/* Activities grid */}
            <ActivityGrid />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

