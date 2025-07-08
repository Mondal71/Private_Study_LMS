import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, onSearch }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={onSearch} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
} 