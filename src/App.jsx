import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import EventsPage from "./pages/EventsPage"
import CareersListPage from "./pages/CareersListPage"
import CareerDetailPage from "./pages/CareerDetailPage"
import CareerApplyPage from "./pages/CareerApplyPage"
import ResourcePage from "./pages/ResourcePage"
import ResourceDetail from "./pages/ResourceDetail"
import AddedArtsPage from "./pages/AddedArtsPage"
import TutoringPage from "./pages/TutoringPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/careers" element={<CareersListPage />} />
        <Route path="/careers/detail" element={<CareerDetailPage />} />
        <Route path="/careers/apply" element={<CareerApplyPage />} />
        <Route path="/resources" element={<ResourcePage />} />
        <Route path="/resources/detail" element={<ResourceDetail />} />
        <Route path="/programs/arts" element={<AddedArtsPage />} />
        <Route path="/programs/tutoring" element={<TutoringPage />} />
      </Routes>
    </BrowserRouter>
  )
}
