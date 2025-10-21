import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InvoiceFormData {
  [key: string]: string;
}

const UploadConfirm = () => {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState<any>(null);
  const [formData, setFormData] = useState<InvoiceFormData>({});

  // ✅ Load uploaded file and edited invoice data
  useEffect(() => {
    try {
      const storedFile = sessionStorage.getItem("uploadedFile");
      const editedInvoice = sessionStorage.getItem("editedInvoiceData");

      if (!storedFile || !editedInvoice) {
        toast.error("Missing confirmation data");
        navigate("/upload-invoice");
        return;
      }

      setFileData(JSON.parse(storedFile));
      setFormData(JSON.parse(editedInvoice));
    } catch (error) {
      console.error("Error loading confirmation data:", error);
      toast.error("Corrupted session data");
      navigate("/upload-invoice");
    }
  }, [navigate]);

  // ✅ Confirm upload and navigate home
// ✅ Confirm upload and send to n8n webhook
  const handleConfirmUpload = async () => {
    try {
      // Combine both file and form data
      const payload = {
        file: {
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
        },
        invoice: formData,
      };

      // Send POST to webhook
      const response = await fetch("https://n8n-production.bridgenet-lab.site/webhook/bd125577-c752-4b03-b76d-907bb4aac86b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`);
      }

      toast.success("✅ Invoice successfully uploaded!");
      
      // Clean up session data
      sessionStorage.removeItem("uploadedFile");
      sessionStorage.removeItem("n8nResponse");
      sessionStorage.removeItem("editedInvoiceData");

      navigate("/");
    } catch (error) {
      console.error("Error sending data to webhook:", error);
      toast.error("Failed to upload invoice to server");
    }
  };


  // ✅ Go back to edit screen
  const handleBackToEdit = () => {
    navigate("/upload-invoice/preview");
  };

  // ✅ Cancel entire process
  const handleRetract = () => {
    sessionStorage.clear();
    toast.info("Upload cancelled");
    navigate("/upload-invoice");
  };

  if (!fileData || Object.keys(formData).length === 0) return null;

  const isImage = fileData.type?.startsWith("image/");
  const isPDF = fileData.type === "application/pdf";
  const fileURL = fileData.dataUrl;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Confirm Final Upload</h1>
              <p className="text-muted-foreground">Please review the invoice details before final confirmation.</p>
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

            {/* Confirm Invoice Details */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Final Invoice Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      {key.replace(/([A-Z])/g, " $1")}
                    </Label>
                    <p className="p-2 bg-secondary rounded-md text-foreground">{value}</p>
                  </div>
                ))}

                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={handleBackToEdit}
                    variant="outline"
                    className="w-1/2 shadow-medium"
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Edit
                  </Button>

                  <Button
                    onClick={handleConfirmUpload}
                    className="w-1/2 shadow-medium"
                    size="lg"
                  >
                    Confirm Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadConfirm;
