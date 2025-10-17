import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const UploadPreview = () => {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  useEffect(() => {
    const storedFile = sessionStorage.getItem("uploadedFile");
    const storedResponse = sessionStorage.getItem("n8nResponse");

    if (!storedFile || !storedResponse) {
      toast.error("Missing invoice data");
      navigate("/upload-invoice");
      return;
    }

    setFileData(JSON.parse(storedFile));

    try {
      const parsedResponse = JSON.parse(storedResponse);
      // Handle array response from n8n
      setInvoiceData(Array.isArray(parsedResponse) ? parsedResponse[0] : parsedResponse);
    } catch (err) {
      console.error("Error parsing n8n response:", err);
      toast.error("Invalid response format");
    }
  }, [navigate]);

  const handleFinalConfirm = async () => {
    if (!invoiceData) {
      toast.error("No invoice data to send");
      return;
    }

    try {
      const response = await fetch(
        "https://n8n-production.bridgenet-lab.site/webhook-test/bd125577-c752-4b03-b76d-907bb4aac86b",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invoiceData),
        }
      );

      if (response.ok) {
        toast.success("Invoice sent successfully!");
        // Optional: save locally or redirect
        navigate("/search-invoice");
      } else {
        toast.error("Failed to send invoice");
      }
    } catch (error) {
      console.error("Webhook error:", error);
      toast.error("Network or server error");
    }
  };

  const handleRetract = () => {
    sessionStorage.removeItem("uploadedFile");
    sessionStorage.removeItem("n8nResponse");
    toast.info("Upload cancelled");
    navigate("/upload-invoice");
  };

  if (!fileData || !invoiceData) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Final Preview</h1>
              <p className="text-muted-foreground">Review the final invoice before saving</p>
            </div>
            <Button onClick={handleRetract} variant="outline" className="shadow-soft">
              <X className="mr-2 h-4 w-4" />
              Cancel Upload
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* File Preview */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Uploaded File</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary rounded-lg p-8 text-center">
                  <FileText className="h-24 w-24 text-primary mx-auto mb-4" />
                  <p className="font-medium text-foreground">{fileData.name}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {(fileData.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Read-only Invoice Data */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Invoice Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(invoiceData).map(([key, value]) => (
                  <div key={key} className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="font-medium text-foreground">
                      {value?.toString() || "N/A"}
                    </p>
                  </div>
                ))}

                <Button
                  onClick={handleFinalConfirm}
                  className="w-full shadow-medium mt-6"
                  size="lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Send to Webhook
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
