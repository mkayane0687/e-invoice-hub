import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InvoiceFormData {
  invoiceNumber: string;
  invoiceDate: string;
  vendorName: string;
  billingAddress: string;
  totalAmount: string;
  description: string;
  uploadDate: string;
  note: string;
}

const InspectInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [formData, setFormData] = useState<InvoiceFormData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("invoices");
    if (stored) {
      const invoices = JSON.parse(stored);
      const found = invoices.find((inv: any) => inv.id === id);
      if (found) {
        setInvoice(found);
        setFormData({
          invoiceNumber: found.invoiceNumber,
          invoiceDate: found.invoiceDate,
          vendorName: found.vendorName,
          billingAddress: found.billingAddress,
          totalAmount: found.totalAmount,
          description: found.description,
          uploadDate: found.uploadDate,
          note: found.note,
        });
      } else {
        toast.error("Invoice not found");
        navigate("/search-invoice");
      }
    }
  }, [id, navigate]);

  const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
    if (formData) {
      setFormData((prev) => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleSave = () => {
    if (!formData) return;

    const stored = localStorage.getItem("invoices");
    if (stored) {
      const invoices = JSON.parse(stored);
      const updatedInvoices = invoices.map((inv: any) =>
        inv.id === id ? { ...inv, ...formData } : inv
      );
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
      toast.success("Invoice updated successfully!");
    }
  };

  const handleDownload = () => {
    navigate(`/search-invoice/download/${id}`);
  };

  if (!invoice || !formData) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Inspect Invoice</h1>
            <p className="text-muted-foreground">View and edit invoice details</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* File Preview */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Invoice File</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary rounded-lg p-8 text-center">
                  <FileText className="h-24 w-24 text-primary mx-auto mb-4" />
                  <p className="font-medium text-foreground">{invoice.fileName}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {(invoice.fileSize / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Uploaded: {new Date(invoice.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Editable Form */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Invoice Information (Editable)</CardTitle>
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
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Input
                    id="billingAddress"
                    value={formData.billingAddress}
                    onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                  />
                </div>

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
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uploadDate">Upload Date</Label>
                  <Input
                    id="uploadDate"
                    type="date"
                    value={formData.uploadDate}
                    onChange={(e) => handleInputChange("uploadDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Input
                    id="note"
                    value={formData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSave} className="flex-1 shadow-medium">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button onClick={handleDownload} variant="outline" className="flex-1 shadow-soft">
                    <Download className="mr-2 h-4 w-4" />
                    Download
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

export default InspectInvoice;
