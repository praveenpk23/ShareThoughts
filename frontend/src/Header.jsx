import { AllRouters } from "./routes/AllRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200 text-base-content">

      {/* Sticky Modern Navbar */}
      <div className="sticky top-0 z-50 w-full border-b bg-base-100/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <Header />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex w-full justify-center">
        <div className="w-full max-w-4xl px-4 py-10">
          <AllRouters />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-base-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Footer />
        </div>
      </footer>
    </div>
  );
}

export default App;
