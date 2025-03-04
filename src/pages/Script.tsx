
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Copy, ArrowLeft, Check } from "lucide-react";

const ScriptPage = () => {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const { data, error } = await supabase
          .from("users_tracking")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setWebsite(data);
      } catch (error) {
        console.error("Error fetching website:", error);
        toast({
          variant: "destructive",
          title: "Error fetching website",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsite();
  }, [id]);

  const getScriptTag = () => {
    if (!website) return "";
    
    // Format the script tag with the correct data attributes
    // Use window.location.origin to ensure it works in any environment
    return `<script
  defer
  data-website-id="${website.tracking_id}"
  data-domain="${website.domain || extractDomain(website.site_url)}"
  src="${window.location.origin}/js/script.js">
</script>`;
  };

  const extractDomain = (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (e) {
      return window.location.hostname;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getScriptTag());
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the tracking script into your website.",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
          <div className="h-4 w-64 bg-muted rounded mb-8"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!website) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Website not found</h2>
          <p className="text-muted-foreground mb-6">The website you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/websites">
            <Button>Go Back to Websites</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link to="/websites" className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to websites
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{website.site_name} - Tracking Script</h1>
        <p className="text-muted-foreground">Add this script to your website to start collecting analytics data.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Installation Instructions</CardTitle>
          <CardDescription>
            Copy the script below and paste it into your website's HTML, just before the closing {'</head>'} tag.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              <code>{getScriptTag()}</code>
            </pre>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="bg-muted/50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Next Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Paste the script into your website's HTML</li>
              <li>Visit your website to generate some traffic</li>
              <li>Return to the analytics dashboard to see your data</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ScriptPage;
