import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UploadInvoice from "./pages/UploadInvoice";
import UploadConfirm from "./pages/UploadConfirm";
import UploadPreview from "./pages/UploadPreview";
import SearchInvoice from "./pages/SearchInvoice";
import InspectInvoice from "./pages/InspectInvoice";
import DownloadInvoice from "./pages/DownloadInvoice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload-invoice" element={<UploadInvoice />} />
          <Route path="/upload-invoice/confirm" element={<UploadConfirm />} />
          <Route path="/upload-invoice/preview" element={<UploadPreview />} />
          <Route path="/search-invoice" element={<SearchInvoice />} />
          <Route path="/search-invoice/inspect/:id" element={<InspectInvoice />} />
          <Route path="/search-invoice/download/:id" element={<DownloadInvoice />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
