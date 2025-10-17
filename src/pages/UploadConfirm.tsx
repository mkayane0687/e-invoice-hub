import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InvoiceFormData {
  invoiceNumber: string;
  invoiceDate: string;
  vendorName: string;
  vendorAddress: string;
  totalAmount: string;
  taxAmount: string;
  description: string;
}

const UploadConfirm = () => {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState<any>(null);
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: "INV-2024-001",
    invoiceDate: "2024-10-17",
    vendorName: "Sample Vendor Co.",
    vendorAddress: "123 Business St, City, State 12345",
    totalAmount: "1250.00",
    taxAmount: "125.00",
    description: "Professional services rendered",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("uploadedFile");
    if (!stored) {
      toast.error("No file uploaded");
      navigate("/upload-invoice");
      return;
    }
    setFileData(JSON.parse(stored));
  }, [navigate]);

  const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    sessionStorage.setItem("invoiceFormData", JSON.stringify(formData));
    navigate("/upload-invoice/preview");
  };

  if (!fileData) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Confirm Invoice Details</h1>
            <p className="text-muted-foreground">Review and edit the extracted invoice information</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* File Preview */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Uploaded File Preview</span>
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

            {/* Editable Form */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Invoice Information (Editable)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName}
                    onChange={(e) => handleInputChange("vendorName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorAddress">Vendor Address</Label>
                  <Input
                    id="vendorAddress"
                    value={formData.vendorAddress}
                    onChange={(e) => handleInputChange("vendorAddress", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalAmount">Total Amount</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      step="0.01"
                      value={formData.totalAmount}
                      onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxAmount">Tax Amount</Label>
                    <Input
                      id="taxAmount"
                      type="number"
                      step="0.01"
                      value={formData.taxAmount}
                      onChange={(e) => handleInputChange("taxAmount", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <Button onClick={handleConfirm} className="w-full shadow-medium mt-6" size="lg">
                  Confirm Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadConfirm;
