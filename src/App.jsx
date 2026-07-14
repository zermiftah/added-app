import { BrowserRouter, Routes, Route } from "react-router-dom"
import QueryProvider from "providers/QueryProvider"
import TopLoadingBar from "ui/TopLoadingBar/TopLoadingBar"

// ALL routes eager-imported — single bundle, zero navigation delay.
// HomePage is eager for LCP; rest follow same pattern for instant nav.
import HomePage          from "features/user/home/HomePage"
import EventsPage        from "features/user/events/EventsPage"
import CareersListPage   from "features/user/careers/CareersListPage"
import CareerDetailPage  from "features/user/careers/CareerDetailPage"
import CareerApplyPage   from "features/user/careers/CareerApplyPage"
import ResourcePage      from "features/user/resources/ResourcePage"
import ResourceDetail    from "features/user/resources/ResourceDetail"
import AddedArtsPage     from "features/user/programs/AddedArtsPage"
import TutoringPage      from "features/user/programs/TutoringPage"
import ResearchPage      from "features/user/programs/ResearchPage"
import AthleticPage      from "features/user/programs/AthleticPage"
import HkBrandAwarenessPage   from "features/user/brandAwareness/HkBrandAwarenessPage"
import UkBrandAwarenessPage   from "features/user/brandAwareness/UkBrandAwarenessPage"
import IndiaBrandAwarenessPage from "features/user/brandAwareness/IndiaBrandAwarenessPage"
import IndoBrandAwarenessPage  from "features/user/brandAwareness/IndoBrandAwarenessPage"
import PhBrandAwarenessPage    from "features/user/brandAwareness/PhBrandAwarenessPage"
import SgBrandAwarenessPage    from "features/user/brandAwareness/SgBrandAwarenessPage"
import UaeBrandAwarenessPage   from "features/user/brandAwareness/UaeBrandAwarenessPage"
import DiagnosticTestPage      from "features/user/diagnostic/DiagnosticTestPage"
import AboutPage         from "features/user/about/AboutPage"
import YourTeamPage      from "features/user/team/YourTeamPage"
import WatchPage         from "features/user/watch/WatchPage"
import FullServicePage   from "features/user/programs/FullServicePage"
import GetInTouchPage    from "features/user/contact/GetInTouchPage"

// Admin + Webinar landings stay lazy — they're heavy and not on hot navigation path
import { lazy, Suspense } from "react"
const AddedAdmin         = lazy(() => import("features/admin/AddedAdmin"))
const WebinarLandingPage = lazy(() => import("features/user/webinarLanding/WebinarLandingPage"))

function PageSkeleton() {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#0E0E0E",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "2px solid rgba(200,53,75,0.25)",
        borderTopColor: "#C8354B",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <TopLoadingBar />
        <Suspense fallback={<PageSkeleton />}>
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
            <Route path="/team"                  element={<YourTeamPage />} />
            <Route path="/programs/admissions"   element={<FullServicePage />} />
            <Route path="/get-in-touch"          element={<GetInTouchPage />} />
            <Route path="/contact"               element={<GetInTouchPage />} />
            <Route path="/added-admin"           element={<AddedAdmin />} />
            {/* Watch recording page */}
            <Route path="/watch/:token"          element={<WatchPage />} />

            <Route path="/hk-brand-awareness"    element={<HkBrandAwarenessPage />} />
            <Route path="/uk-brand-awareness"    element={<UkBrandAwarenessPage />} />
            <Route path="/india-brand-awareness" element={<IndiaBrandAwarenessPage />} />
            <Route path="/indo-brand-awareness"  element={<IndoBrandAwarenessPage />} />
            <Route path="/ph-brand-awareness"    element={<PhBrandAwarenessPage />} />
            <Route path="/sg-brand-awareness"    element={<SgBrandAwarenessPage />} />
            <Route path="/uae-brand-awareness"   element={<UaeBrandAwarenessPage />} />
            <Route path="/diagnostic-test"       element={<DiagnosticTestPage />} />
            {/* Catch-all for webinar landing slugs — keep this LAST */}
            <Route path="/:slug"                 element={<WebinarLandingPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryProvider>
  )
}
