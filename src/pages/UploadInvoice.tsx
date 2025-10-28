import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const UploadInvoice = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleConfirm = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
  
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    formData.append("uploadedAt", new Date().toISOString());
  
    try {
      const response = await fetch(
        "https://n8n-production.bridgenet-lab.site/webhook/0b884a80-f36c-4adf-8ad1-c3a7c376c526",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await response.json();
  
      // ✅ Check for code 199 (file type error)
      if (data.code === 199) {
        toast.error("❌ Invalid file type. Please upload a PDF only.");
        setIsUploading(false);
        return;
      }
  
      if (!response.ok) {
        toast.error("❌ Upload failed. Please try again.");
        setIsUploading(false);
        return;
      }
  
      // ✅ Convert file to base64 for preview persistence
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
  
      const base64File = await toBase64(file);
      
      // ✅ CRITICAL FIX: Store data in variables first, then write to storage
      const fileData = JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: base64File,
      });
      
      const responseData = JSON.stringify(data);
      
      // ✅ Write to sessionStorage
      sessionStorage.setItem("uploadedFile", fileData);
      sessionStorage.setItem("n8nResponse", responseData);
  
      // ✅ Verify storage was written (critical for debugging)
      const verifyFile = sessionStorage.getItem("uploadedFile");
      const verifyResponse = sessionStorage.getItem("n8nResponse");
      
      if (!verifyFile || !verifyResponse) {
        console.error("❌ Storage verification failed!", {
          hasFile: !!verifyFile,
          hasResponse: !!verifyResponse
        });
        toast.error("Storage error. Please try again.");
        setIsUploading(false);
        return;
      }
  
      // ✅ Check if n8n returned parsed invoice data
      if (Array.isArray(data) && data.length > 0) {
        sessionStorage.setItem("invoiceData", JSON.stringify(data));
        toast.success("✅ File processed successfully!");
      } else {
        toast.warning("⚠️ No invoice data returned from the server.");
      }
  
      // ✅ Small delay to ensure storage persistence before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // ✅ Final verification before navigation
      console.log("✅ Navigating with storage:", {
        uploadedFile: !!sessionStorage.getItem("uploadedFile"),
        n8nResponse: !!sessionStorage.getItem("n8nResponse")
      });
      
      // ✅ Navigate to preview page
      navigate("/upload-invoice/preview");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("⚠️ Network or server error.");
      setIsUploading(false);
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
                Choose a PDF file to upload
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf"
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer flex flex-col items-center space-y-4 ${
                    isUploading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF only (max. 10MB)
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
                disabled={!file || isUploading}
              >
                {isUploading ? "Processing..." : "Confirm Upload"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadInvoice;
