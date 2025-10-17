import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const DownloadInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("invoices");
    if (stored) {
      const invoices = JSON.parse(stored);
      const found = invoices.find((inv: any) => inv.id === id);
      if (found) {
        setInvoice(found);
      } else {
        toast.error("Invoice not found");
        navigate("/search-invoice");
      }
    }
  }, [id, navigate]);

  const handleDownload = () => {
    if (!invoice) return;

    // Create a downloadable version of the invoice data
    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      vendorName: invoice.vendorName,
      vendorAddress: invoice.vendorAddress,
      totalAmount: invoice.totalAmount,
      taxAmount: invoice.taxAmount,
      description: invoice.description,
      uploadDate: invoice.uploadDate,
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoiceNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Invoice downloaded successfully!");
  };

  if (!invoice) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Download Invoice</h1>
            <p className="text-muted-foreground">Preview and download invoice data</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* File Preview */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Original File</span>
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

            {/* Download Preview */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Download Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Invoice Number</p>
                    <p className="font-medium text-foreground">{invoice.invoiceNumber}</p>
                  </div>

                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Invoice Date</p>
                    <p className="font-medium text-foreground">{invoice.invoiceDate}</p>
                  </div>

                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Vendor Name</p>
                    <p className="font-medium text-foreground">{invoice.vendorName}</p>
                  </div>

                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Vendor Address</p>
                    <p className="font-medium text-foreground">{invoice.vendorAddress}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                      <p className="font-medium text-foreground">${invoice.totalAmount}</p>
                    </div>

                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Tax Amount</p>
                      <p className="font-medium text-foreground">${invoice.taxAmount}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="font-medium text-foreground">{invoice.description}</p>
                  </div>
                </div>

                <Button onClick={handleDownload} className="w-full shadow-medium mt-6" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadInvoice;
