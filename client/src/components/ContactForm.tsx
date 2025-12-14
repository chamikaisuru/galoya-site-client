import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Valid phone number required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
  const { t } = useTranslation();
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFormStatus("submitting");
    
    try {
      await apiRequest("POST", "/api/contact", values);
      
      setFormStatus("success");
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We will get back to you shortly.",
      });
      form.reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error: any) {
      setFormStatus("error");
      toast({
        variant: "destructive",
        title: "Failed to Send Message",
        description: error.message || "Please try again later.",
      });
      
      // Reset error state after 3 seconds
      setTimeout(() => setFormStatus("idle"), 3000);
    }
  }

  if (formStatus === "success") {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8 bg-green-500/10 border border-green-500/20 rounded-lg animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black mb-2">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-white">Message Received</h3>
        <p className="text-muted-foreground">Thank you for reaching out. Our team will contact you within 24 hours.</p>
        <Button 
          variant="outline" 
          onClick={() => setFormStatus("idle")}
          className="mt-4"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-xs font-bold text-muted-foreground">{t('contact.form_name')}</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-foreground h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+94 77 123 4567" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-foreground h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase tracking-widest text-xs font-bold text-muted-foreground">{t('contact.form_email')}</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-foreground h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase tracking-widest text-xs font-bold text-muted-foreground">{t('contact.form_message')}</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about your inquiry..." {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-foreground min-h-[150px] resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {formStatus === "error" && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-4 rounded border border-red-400/20">
            <AlertCircle className="h-4 w-4" />
            Something went wrong. Please try again.
          </div>
        )}
        
        <Button 
          type="submit" 
          disabled={formStatus === "submitting"}
          className="w-full bg-primary text-black hover:bg-primary/90 text-lg py-6 uppercase tracking-widest font-bold disabled:opacity-50"
        >
          {formStatus === "submitting" ? "Sending..." : t('contact.form_send')}
        </Button>
      </form>
    </Form>
  );
}