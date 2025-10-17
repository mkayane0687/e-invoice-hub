import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  vendorName: string;
  totalAmount: string;
  description: string;
  fileName: string;
}

const SearchInvoice = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("invoices");
    if (stored) {
      setInvoices(JSON.parse(stored));
    }
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const query = searchQuery.toLowerCase();
    return (
      invoice.invoiceNumber.toLowerCase().includes(query) ||
      invoice.vendorName.toLowerCase().includes(query) ||
      invoice.description.toLowerCase().includes(query)
    );
  });

  const handleInspect = (id: string) => {
    navigate(`/search-invoice/inspect/${id}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Search Invoice</h1>
            <p className="text-muted-foreground">Search and manage your uploaded invoices</p>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Invoice Records</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice number, vendor, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No invoices found</p>
                </div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary hover:bg-secondary">
                        <TableHead>Invoice Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id} className="hover:bg-secondary/50">
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.invoiceDate}</TableCell>
                          <TableCell>{invoice.vendorName}</TableCell>
                          <TableCell>${invoice.totalAmount}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {invoice.fileName}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => handleInspect(invoice.id)}
                              variant="outline"
                              size="sm"
                              className="shadow-soft"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Inspect Invoice
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SearchInvoice;
