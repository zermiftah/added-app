import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import QueryProvider from "providers/QueryProvider"

const HomePage        = lazy(() => import("features/user/home/HomePage"))
const EventsPage      = lazy(() => import("features/user/events/EventsPage"))
const CareersListPage = lazy(() => import("features/user/careers/CareersListPage"))
const CareerDetailPage= lazy(() => import("features/user/careers/CareerDetailPage"))
const CareerApplyPage = lazy(() => import("features/user/careers/CareerApplyPage"))
const ResourcePage    = lazy(() => import("features/user/resources/ResourcePage"))
const ResourceDetail  = lazy(() => import("features/user/resources/ResourceDetail"))
const AddedArtsPage   = lazy(() => import("features/user/programs/AddedArtsPage"))
const TutoringPage    = lazy(() => import("features/user/programs/TutoringPage"))
const ResearchPage    = lazy(() => import("features/user/programs/ResearchPage"))
const AthleticPage    = lazy(() => import("features/user/programs/AthleticPage"))
const AboutPage       = lazy(() => import("features/user/about/AboutPage"))
const FullServicePage = lazy(() => import("features/user/programs/FullServicePage"))
const GetInTouchPage  = lazy(() => import("features/user/contact/GetInTouchPage"))
const AddedAdmin      = lazy(() => import("features/admin/AddedAdmin"))

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/"                      element={<HomePage />} />
            <Route path="/events"                element={<EventsPage />} />
            <Route path="/careers"               element={<CareersListPage />} />
            <Route path="/careers/detail"        element={<CareerDetailPage />} />
            <Route path="/careers/apply"         element={<CareerApplyPage />} />
            <Route path="/resources"             element={<ResourcePage />} />
            <Route path="/resources/detail"      element={<ResourceDetail />} />
            <Route path="/programs/arts"         element={<AddedArtsPage />} />
            <Route path="/programs/tutoring"     element={<TutoringPage />} />
            <Route path="/programs/research"     element={<ResearchPage />} />
            <Route path="/programs/athletic"     element={<AthleticPage />} />
            <Route path="/about"                 element={<AboutPage />} />
            <Route path="/programs/admissions"   element={<FullServicePage />} />
            <Route path="/get-in-touch"          element={<GetInTouchPage />} />
            <Route path="/contact"               element={<GetInTouchPage />} />
            <Route path="/added-admin"           element={<AddedAdmin />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryProvider>
  )
}
