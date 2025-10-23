import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// ✅ Interface for stored file structure
interface StoredFile {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

const UploadPreview = () => {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState<StoredFile | null>(null);
  const [invoiceData, setInvoiceData] = useState<Record<string, string>>({});

  // ✅ Load file + invoice data from sessionStorage
  useEffect(() => {
    try {
      const storedFile = sessionStorage.getItem("uploadedFile");
      const storedResponse = sessionStorage.getItem("n8nResponse");

      if (!storedFile || !storedResponse) {
        toast.error("Missing invoice data");
        navigate("/upload-invoice");
        return;
      }

      const parsedFile: StoredFile = JSON.parse(storedFile);
      const parsedResponse = JSON.parse(storedResponse);

      setFileData(parsedFile);
      setInvoiceData(Array.isArray(parsedResponse) ? parsedResponse[0] : parsedResponse);
    } catch (error) {
      console.error("Error parsing session data:", error);
      toast.error("Corrupted invoice data, please re-upload.");
      navigate("/upload-invoice");
    }
  }, [navigate]);

  // ✅ Inline field editing
  const handleInputChange = (key: string, value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ Instead of sending webhook, just navigate to UploadConfirm.tsx
  const handleFinalConfirm = () => {
    if (!invoiceData || Object.keys(invoiceData).length === 0) {
      toast.error("No invoice data to confirm");
      return;
    }

    sessionStorage.setItem("editedInvoiceData", JSON.stringify(invoiceData));
    navigate("/upload-invoice/confirm");
  };

  // ✅ Cancel and go back to upload

  const handleRetract = async () => {
    try {
      const storedResponse = sessionStorage.getItem("n8nResponse");
  
      if (storedResponse) {
        const parsed = JSON.parse(storedResponse);
        const linkToView = Array.isArray(parsed)
          ? parsed[0]?.["Link to view"]
          : parsed?.["Link to view"];
  
        if (linkToView) {
          await fetch("https://n8n-production.bridgenet-lab.site/webhook/5dec72e9-208d-4ab8-accb-f27a80bfd6e6", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ linkToView }),
          });
        }
      }
  
      toast.info("Upload cancelled and pending file removed.");
    } catch (error) {
      console.error("Cleanup error:", error);
      toast.warning("Upload cancelled, but cleanup may have failed.");
    } finally {
      sessionStorage.removeItem("uploadedFile");
      sessionStorage.removeItem("n8nResponse");
      navigate("/upload-invoice");
    }
  };  

  // ✅ Prevent rendering until data is ready
  if (!fileData || Object.keys(invoiceData).length === 0) return null;

  const isImage = fileData.type?.startsWith("image/");
  const isPDF = fileData.type === "application/pdf";
  const fileURL = fileData.dataUrl; // ✅ Base64 preview source

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Final Preview</h1>
              <p className="text-muted-foreground">Review and edit before confirming</p>
            </div>
            <Button onClick={handleRetract} variant="outline" className="shadow-soft">
              <X className="mr-2 h-4 w-4" />
              Cancel Upload
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 🧾 File Preview */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Uploaded File</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary rounded-lg p-4 text-center">
                  {isImage ? (
                    <img
                      src={fileURL}
                      alt="Uploaded"
                      className="mx-auto max-h-[400px] rounded-lg"
                    />
                  ) : isPDF ? (
                    <iframe
                      src={fileURL}
                      title="PDF Preview"
                      className="w-full h-[400px] rounded-lg"
                    ></iframe>
                  ) : (
                    <div className="p-10">
                      <FileText className="h-20 w-20 text-primary mx-auto mb-4" />
                      <p className="font-medium text-foreground">{fileData.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(fileData.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 🧾 Editable Invoice Fields */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Invoice Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              {Object.entries(invoiceData)
                .filter(([key]) => key !== "Session id" && key !== "Link to view") // ✅ hide these two
                .map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    {key.toLowerCase().includes("description") ||
                    key.toLowerCase().includes("note") ? (
                      <Textarea
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="bg-secondary"
                      />
                    ) : (
                      <Input
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="bg-secondary"
                      />
                    )}
                  </div>
                ))}
                <Button
                  onClick={handleFinalConfirm}
                  className="w-full shadow-medium mt-6"
                  size="lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Confirm & Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPreview;
