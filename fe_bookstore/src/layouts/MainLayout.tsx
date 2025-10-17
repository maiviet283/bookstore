import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="flex-grow pt-24 pb-24 px-5 bg-gray-50">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
