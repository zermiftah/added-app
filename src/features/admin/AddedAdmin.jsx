import { useAdminStore } from "stores/adminStore"
import AdminLogin from "./auth/AdminLogin"
import AdminLayout from "./shared/layout/AdminLayout"
import AdminJobs from "./jobs/AdminJobs"
import AdminApplicants from "./applicants/AdminApplicants"
import AdminArticles from "./articles/AdminArticles"
import AdminAuthors from "./authors/AdminAuthors"
import AdminAssets from "./assets/AdminAssets"
import AdminTeam            from "./team/AdminTeam"
import AdminWebinarPages    from "./webinarPages/AdminWebinarPages"
import AdminDiagnosticResults from "./diagnostic/AdminDiagnosticResults"

export default function AddedAdmin() {
  const token     = useAdminStore(s => s.token)
  const activeNav = useAdminStore(s => s.activeNav)

  if (!token) return <AdminLogin />

  return (
    <AdminLayout>
      {activeNav === "jobs"        && <AdminJobs />}
      {activeNav === "applicants"  && <AdminApplicants />}
      {activeNav === "articles"    && <AdminArticles />}
      {activeNav === "authors"     && <AdminAuthors />}
      {activeNav === "assets"      && <AdminAssets />}
      {activeNav === "team"        && <AdminTeam />}
      {activeNav === "webinars"    && <AdminWebinarPages />}
      {activeNav === "diagnostic"  && <AdminDiagnosticResults />}
    </AdminLayout>
  )
}
