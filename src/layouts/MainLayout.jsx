import { Footer } from "../components/Footer/Footer";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth:"1200px",margin:"0 auto"}}>{children}</main>
      <Footer/>
    </>
  );
}
