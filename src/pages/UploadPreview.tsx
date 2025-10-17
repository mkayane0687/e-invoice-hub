import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const UploadPreview = () => {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const storedFile = sessionStorage.getItem("uploadedFile");
    const storedForm = sessionStorage.getItem("invoiceFormData");
    
    if (!storedFile || !storedForm) {
      toast.error("Missing invoice data");
      navigate("/upload-invoice");
      return;
    }
    
    setFileData(JSON.parse(storedFile));
    setFormData(JSON.parse(storedForm));
  }, [navigate]);

  const handleFinalConfirm = () => {
    // Get existing invoices or initialize empty array
    const existingInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    
    // Add new invoice
    const newInvoice = {
      id: Date.now().toString(),
      ...formData,
      fileName: fileData.name,
      fileSize: fileData.size,
      fileData: fileData.data,
      uploadDate: new Date().toISOString(),
    };
    
    existingInvoices.push(newInvoice);
    localStorage.setItem("invoices", JSON.stringify(existingInvoices));
    
    // Clear session storage
    sessionStorage.removeItem("uploadedFile");
    sessionStorage.removeItem("invoiceFormData");
    
    toast.success("Invoice saved successfully!");
    navigate("/search-invoice");
  };

  if (!fileData || !formData) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Final Preview</h1>
            <p className="text-muted-foreground">Review the final invoice before saving</p>
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

            {/* Read-only Form Display */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Invoice Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Invoice Number</p>
                    <p className="font-medium text-foreground">{formData.invoiceNumber}</p>
                  </div>

                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Invoice Date</p>
                    <p className="font-medium text-foreground">{formData.invoiceDate}</p>
                  </div>

                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Vendor Name</p>
                    <p className="font-medium text-foreground">{formData.vendorName}</p>
                  </div>

                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Vendor Address</p>
                    <p className="font-medium text-foreground">{formData.vendorAddress}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                      <p className="font-medium text-foreground">${formData.totalAmount}</p>
                    </div>

                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Tax Amount</p>
                      <p className="font-medium text-foreground">${formData.taxAmount}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="font-medium text-foreground">{formData.description}</p>
                  </div>
                </div>

                <Button onClick={handleFinalConfirm} className="w-full shadow-medium mt-6" size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  Save Invoice
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
