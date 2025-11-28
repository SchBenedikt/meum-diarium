
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="text-center px-4">
          <p className="text-sm font-medium text-primary mb-4">404</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Pagina non inventa
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Haec pagina in annalibus nostris non exstat.
          </p>
          <Link to="/">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ad paginam primam redire
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
