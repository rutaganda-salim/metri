
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { PlusCircle, Globe, Trash2 } from "lucide-react";

const WebsitesPage = () => {
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const { toast } = useToast();

  const fetchWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from("users_tracking")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWebsites(data || []);
    } catch (error) {
      console.error("Error fetching websites:", error);
      toast({
        variant: "destructive",
        title: "Error fetching websites",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siteName.trim() || !siteUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Site name and URL are required",
      });
      return;
    }

    // Ensure URL has proper format
    let formattedUrl = siteUrl;
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      const user = (await supabase.auth.getUser()).data.user;
      const trackingId = `trk_${Math.random().toString(36).substring(2, 15)}`;
      
      const { data, error } = await supabase
        .from("users_tracking")
        .insert([
          {
            user_id: user.id,
            site_name: siteName,
            site_url: formattedUrl,
            tracking_id: trackingId,
          },
        ])
        .select();

      if (error) throw error;
      
      fetchWebsites();
      setSiteName("");
      setSiteUrl("");
      setOpen(false);
      
      toast({
        title: "Website added successfully",
        description: "You can now get your tracking script.",
      });
    } catch (error) {
      console.error("Error adding website:", error);
      toast({
        variant: "destructive",
        title: "Error adding website",
        description: error.message,
      });
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    if (!confirm("Are you sure you want to delete this website?")) return;
    
    try {
      const { error } = await supabase
        .from("users_tracking")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      fetchWebsites();
      toast({
        title: "Website deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting website:", error);
      toast({
        variant: "destructive",
        title: "Error deleting website",
        description: error.message,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Websites</h1>
          <p className="text-muted-foreground">Manage the websites you want to track</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Website
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddWebsite}>
              <DialogHeader>
                <DialogTitle>Add a new website</DialogTitle>
                <DialogDescription>
                  Enter your website details to start tracking analytics.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="site-name">Website Name</Label>
                  <Input
                    id="site-name"
                    placeholder="My Awesome Website"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="site-url">Website URL</Label>
                  <Input
                    id="site-url"
                    placeholder="https://mywebsite.com"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Website</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted rounded-t-md"></CardHeader>
              <CardContent className="mt-4">
                <div className="h-4 w-3/4 bg-muted rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </CardContent>
              <CardFooter className="h-12 bg-muted rounded-b-md"></CardFooter>
            </Card>
          ))}
        </div>
      ) : websites.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-8 text-center">
            <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No websites added yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first website to start tracking analytics.
            </p>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)}>Add Your First Website</Button>
            </DialogTrigger>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {websites.map((website) => (
            <Card key={website.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{website.site_name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteWebsite(website.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="truncate">
                  <a href={website.site_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {website.site_url}
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tracking ID: <span className="font-mono">{website.tracking_id}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Link to={`/script/${website.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Get Tracking Script
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default WebsitesPage;
