import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const UploadInvoice = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleConfirm = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    formData.append("uploadedAt", new Date().toISOString());

    try {
      const response = await fetch(
        "https://n8n-production.bridgenet-lab.site/webhook-test/0b884a80-f36c-4adf-8ad1-c3a7c376c526",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Save the file and n8n response to sessionStorage
        sessionStorage.setItem("uploadedFile", JSON.stringify(file));
        sessionStorage.setItem("n8nResponse", JSON.stringify(data));

        toast.success("✅ File uploaded successfully!");
        navigate("/UploadPreview.tsx"); // Go to preview page directly
      } else {
          toast.error("❌ Upload failed. Please try again.");
      }


      // ✅ Parse JSON response from n8n
      const data = await response.json();

      // Example of expected response:
      // [
      //   {
      //     "Invoice Number": "OR-77790",
      //     "Invoice Date": "22/04/2023",
      //     "Vendor Name": "SL SOFTWARE SOLUTIONS SON BHD",
      //     "Billing Address": "Pasir 31650 IpohPerak",
      //     "Total Amount": "2500.00",
      //     "Description": "PAYMENT ON A/c",
      //     "Note": "empty",
      //     "Upload Date": "17/10/2025"
      //   }
      // ]

      if (Array.isArray(data) && data.length > 0) {
        // ✅ Save response to sessionStorage (for preview page)
        sessionStorage.setItem("invoiceData", JSON.stringify(data));

        toast.success("✅ File processed successfully!");
        navigate("/upload-invoice/preview"); // 👈 Navigate to your preview component
      } else {
        toast.warning("⚠️ No data returned from the server.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("⚠️ Network or server error.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Upload Invoice</h1>
            <p className="text-muted-foreground">Upload your invoice file for processing</p>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Select Invoice File</CardTitle>
              <CardDescription>
                Choose a PDF, image, or document file to upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF, PNG, JPG, DOC (max. 10MB)
                    </p>
                  </div>
                </label>
              </div>

              {file && (
                <div className="flex items-center space-x-3 p-4 bg-secondary rounded-lg">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleConfirm}
                className="w-full shadow-medium"
                size="lg"
                disabled={!file}
              >
                Confirm Upload
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadInvoice;
