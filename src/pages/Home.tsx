import { Link } from "react-router-dom";
import { FileText, Search, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = () => {
  const sections = [
    {
      to: "/upload-invoice",
      icon: FileText,
      title: "Upload Invoice",
      description: "Upload and process your invoices with standardized formatting",
      gradient: "from-primary/10 to-accent/10",
    },
    {
      to: "/search-invoice",
      icon: Search,
      title: "Search Invoice",
      description: "Search, view, and manage your uploaded invoices",
      gradient: "from-accent/10 to-primary/10",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Welcome to E-Invoice Standardization Portal
          </h1>
          <p className="text-xl text-muted-foreground">
            Streamline your invoice management with our professional portal
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.to}
                className="group hover:shadow-strong transition-all duration-300 border-border hover:border-primary/50"
              >
                <CardHeader>
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                  <CardDescription className="text-base">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={section.to}>
                    <Button className="w-full group/btn shadow-medium">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
