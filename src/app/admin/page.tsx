"use client";

import React, { useState, useEffect } from "react";
import { AdminCustomerStories } from "@/components/admin-customer-stories";
import { useRouter } from "next/navigation";
import {
  Users,
  Eye,
  TrendingUp,
  MessageSquare,
  Phone,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  LogOut,
  ChevronRight,
  Zap,
  Package,
  Tag,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Calendar,
  Sparkles,
  ExternalLink,
  Menu,
  Shield,
  Layers,
  BarChart3,
  Sliders,
  type LucideIcon,
} from "lucide-react";

type AdminSection = "leads" | "products" | "offers" | "banners" | "analytics" | "stories";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  cityArea: string;
  preferredColor: string;
  inquiryType: string;
  useCase: string;
  assignedBranch: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  status: string;
  notes?: string;
  source: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: string;
  range: string;
  speed: string;
  payload: string;
  battery: string;
  motor: string;
  warranty: string;
  image: string;
  description: string;
  isPublished: boolean;
  order: number;
}

interface Offer {
  id: string;
  title: string;
  badge: string;
  discount: string;
  validTill: string;
  description: string;
  terms?: string;
  isActive: boolean;
  order: number;
}

interface Banner {
  id: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  tag1?: string;
  tag2?: string;
  isActive: boolean;
  order: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation Tabs: leads | products | offers | banners | analytics
  const [activeTab, setActiveTab] = useState<AdminSection>("leads");

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Filters & Loading
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [inquiryFilter, setInquiryFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Selected Lead for Detail Modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Editing Modals / Forms
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  useEffect(() => {
    void checkSession();
  }, [router]);

  async function checkSession() {
    const stories = new URLSearchParams(location.search).get("section") === "stories";
    setSessionError(false);
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      if (response.status === 401) {
        router.replace(stories ? "/admin/login?section=stories" : "/admin/login");
        return;
      }
      if (!response.ok) throw new Error();
      if (stories) setActiveTab("stories");
      setSessionReady(true);
      void fetchData();
    } catch {
      setSessionError(true);
    }
  }

  const fetchData = async () => {
    setIsLoading(true); setLoadError("");
    try {
      const [leadsRes, statsRes, productsRes, offersRes, bannersRes] =
        await Promise.all([
          fetch("/api/leads"),
          fetch("/api/analytics/stats"),
          fetch("/api/admin/products").catch(() => null),
          fetch("/api/admin/offers").catch(() => null),
          fetch("/api/admin/banners").catch(() => null),
        ]);

      if ([leadsRes, statsRes, productsRes, offersRes, bannersRes].some(response => response?.status === 401)) {
        setSessionReady(false);
        const stories = new URLSearchParams(location.search).get("section") === "stories";
        router.replace(stories ? "/admin/login?section=stories&expired=1" : "/admin/login?expired=1");
        return;
      }
      if (!leadsRes.ok || !statsRes.ok || !productsRes?.ok || !offersRes?.ok || !bannersRes?.ok) throw new Error("Data unavailable");
      const leadsData = await leadsRes.json();
      const statsData = await statsRes.json();

      if (leadsData.success) setLeads(leadsData.leads);
      if (statsData.success) setStats(statsData.stats);

      if (productsRes && productsRes.ok) {
        const prodData = await productsRes.json();
        if (prodData.success) setProducts(prodData.products);
      }

      if (offersRes && offersRes.ok) {
        const offData = await offersRes.json();
        if (offData.success) setOffers(offData.offers);
      }

      if (bannersRes && bannersRes.ok) {
        const banData = await bannersRes.json();
        if (banData.success) setBanners(banData.banners);
      }
    } catch {
      setLoadError("Some data could not be loaded. Please retry; displayed data may be out of date.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try { const res=await fetch(`/api/leads/${leadId}`, {method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:newStatus})}); if(!res.ok) throw new Error();
      setLeads(prev=>prev.map(l=>l.id===leadId?{...l,status:newStatus}:l));
      if(selectedLead?.id===leadId)setSelectedLead(prev=>prev?{...prev,status:newStatus}:null);
    } catch { alert("Status was not saved. Please retry."); }
  };

  // 1-Click WhatsApp handler
  const openWhatsApp = (lead: Lead) => {
    let msg = `Hello ${lead.name}! Greetings from ARS Motors Salem. We received your request for the Kinetic Green ${lead.useCase || "E-Luna PRO X3"} (${lead.preferredColor} variant).`;
    if (lead.preferredDate) {
      msg += ` We noted your preferred test ride on ${lead.preferredDate} (${lead.preferredTime || "Morning"}).`;
    }
    msg += ` How may our sales team assist you today?`;
    window.open(`https://wa.me/91${lead.phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // CSV Export handler
  const exportCSV = () => {
    const headers = [
      "Name,Phone,Area,Color,Inquiry Type,Model,Preferred Date,Time Slot,Branch,Status,Message,Source,Date\n",
    ];
    const cell = (value: unknown) => { const text=String(value ?? ""); const safe=/^[\s]*[=+@-]/.test(text) ? "'"+text : text; return `"${safe.replace(/"/g,'""')}"`; };
    const rows=leads.map(l=>[l.name,l.phone,l.cityArea,l.preferredColor,l.inquiryType,l.useCase,l.preferredDate,l.preferredTime,l.assignedBranch,l.status,l.message,l.source,new Date(l.createdAt).toLocaleDateString()].map(cell).join(",")+"\n");
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ars_motors_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Product CRUD
  const saveProduct = async (productData: Partial<Product>) => {
    try {
      if (productData.id) {
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        const d = await res.json();
        if (!res.ok || !d.success) throw new Error(d.error || "Operation failed");
        if (d.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === productData.id ? d.product : p))
          );
        }
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        const d = await res.json();
        if (!res.ok || !d.success) throw new Error(d.error || "Operation failed");
        if (d.success) {
          setProducts((prev) => [...prev, d.product]);
        }
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      alert("Error saving product: " + err.message);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion was not saved");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Error deleting product: " + err.message);
    }
  };

  // Offer CRUD
  const saveOffer = async (offerData: Partial<Offer>) => {
    try {
      if (offerData.id) {
        const res = await fetch("/api/admin/offers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(offerData),
        });
        const d = await res.json();
        if (!res.ok || !d.success) throw new Error(d.error || "Operation failed");
        if (d.success) {
          setOffers((prev) =>
            prev.map((o) => (o.id === offerData.id ? d.offer : o))
          );
        }
      } else {
        const res = await fetch("/api/admin/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(offerData),
        });
        const d = await res.json();
        if (!res.ok || !d.success) throw new Error(d.error || "Operation failed");
        if (d.success) {
          setOffers((prev) => [...prev, d.offer]);
        }
      }
      setIsOfferModalOpen(false);
      setEditingOffer(null);
    } catch (err: any) {
      alert("Error saving offer: " + err.message);
    }
  };

  const deleteOffer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion was not saved");
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err: any) {
      alert("Error deleting offer: " + err.message);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.cityArea.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
    const matchesBranch =
      branchFilter === "ALL" || l.assignedBranch === branchFilter;
    const matchesInquiry =
      inquiryFilter === "ALL" ||
      (inquiryFilter === "TEST_DRIVE" && l.inquiryType.includes("Test Drive")) ||
      (inquiryFilter === "TOKEN" && l.inquiryType === "Reservation Enquiry") ||
      (inquiryFilter === "ENQUIRY" && l.inquiryType.includes("Enquiry"));

    return matchesSearch && matchesStatus && matchesBranch && matchesInquiry;
  });

  const navItems: { id: AdminSection; label: string; icon: LucideIcon; color?: string; badge?: number }[] = [
    {
      id: "leads",
      label: "Bookings & Leads",
      icon: Users,
      badge: leads.length > 0 ? leads.length : undefined,
      color: "text-emerald-400",
    },
    {
      id: "products",
      label: "Vehicles & Prices",
      icon: Package,
      badge: products.length || undefined,
      color: "text-sky-400",
    },
    {
      id: "offers",
      label: "Salem Offers",
      icon: Tag,
      badge: offers.length || undefined,
      color: "text-amber-400",
    },
    { id: "stories", label: "Customer stories", icon: MessageSquare, color: "text-emerald-300" },
    {
      id: "analytics",
      label: "Analytics & Traffic",
      icon: BarChart3,
      color: "text-purple-400",
    },
  ];

  if (!sessionReady) return (
    <div className="grid min-h-screen place-items-center bg-[#090b0e] p-5 text-slate-100">
      {sessionError
        ? <div role="alert" className="rounded-2xl border border-white/10 bg-[#141a25] p-5 text-sm"><p>Could not verify your session.</p><button className="mt-3 underline" onClick={() => void checkSession()}>Try again</button></div>
        : <p role="status" className="text-sm text-slate-300">Checking your session…</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#090b0e] text-white flex flex-col md:flex-row">
      {/* SIDEBAR NAVIGATION (Desktop persistent, Mobile overlay) */}
      <aside id="admin-navigation"
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0c0f17] border-r border-white/[0.08] flex flex-col justify-between shrink-0 transition-transform duration-300 md:sticky md:top-0 md:h-dvh md:visible md:translate-x-0 ${
          isMobileSidebarOpen ? "visible translate-x-0 shadow-2xl" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto">
          <div>

      {/* Sidebar Header / Brand */}
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xs">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-black tracking-wide text-white font-sans uppercase">
                      ARS MOTORS
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold uppercase">
                      Salem
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Kinetic Green EV Dealership
                  </span>
                </div>
              </div>

              {/* Close button on mobile */}
              <button
                onClick={() => setIsMobileSidebarOpen(false)} aria-label="Close navigation"
                className="md:hidden p-1.5 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 space-y-1.5" aria-label="Admin sections">
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Dealership Management
              </span>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      setActiveTab(item.id);
                      window.history.replaceState(null, "", item.id === "stories" ? "/admin?section=stories" : "/admin");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-emerald-500 text-black shadow-md font-black"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-black" : item.color
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                          isActive
                            ? "bg-black/20 text-black"
                            : "bg-white/[0.08] text-slate-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

          </div>

          {/* Sidebar Footer: Quick Actions + User Profile */}
          <div className="p-4 border-t border-white/[0.08] space-y-3">
            {/* External Links */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-bold text-slate-300 transition-colors"
                title="Open Live Website"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Live Site</span>
              </a>
              <button
                onClick={exportCSV}
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-bold text-slate-300 transition-colors"
                title="Download CRM CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>CSV</span>
              </button>
            </div>

              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", {method:"POST"});
                  router.push("/admin/login");
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10"
                type="button"
              >
                <LogOut className="w-4 h-4" aria-hidden="true"/> Sign out
              </button>
          </div>
        </div>
      </aside>

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-18 border-b border-white/[0.08] bg-[#0e121a]/80 backdrop-blur-md gap-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)} aria-expanded={isMobileSidebarOpen} aria-controls="admin-navigation"
              className="md:hidden p-2 rounded-xl bg-white/[0.06] text-slate-300 hover:text-white"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black text-white">
                  {activeTab === "leads" && "Bookings & Leads Management"}
                  {activeTab === "products" && "Vehicle Catalog & Pricing"}
                  {activeTab === "offers" && "Salem Exclusive Offers"}
                  {activeTab === "analytics" && "Attribution & Lead Analytics"}
                  {activeTab === "stories" && "Customer Stories"}
                </h1>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                ARS Motors Salem
              </span>
            </div>
          </div>

          {activeTab !== "stories" && <div className="flex items-center space-x-3">
            <button
              onClick={fetchData} disabled={isLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isLoading ? "Refreshing…" : "Refresh"}</span>
            </button>
          </div>}
        </header>

        {/* Inner Content Workspace */}
        <main className="mx-auto w-full max-w-[100rem] flex-1 space-y-6 px-4 py-6 sm:px-6 md:px-8">
          {loadError && activeTab !== "stories" && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">{loadError} <button className="font-semibold underline" onClick={fetchData}>Retry</button></div>}
          {/* KPI Strip */}
          {activeTab === "leads" && <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="p-5 rounded-2xl bg-[#121620] border border-white/[0.08] shadow-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Leads
                </span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {leads.length}
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                Active CRM inquiries
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#121620] border border-white/[0.08] shadow-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Reservation Enquiries
                </span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                {leads.filter((l) => l.inquiryType === "Reservation Enquiry").length}
              </div>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                Requests only · no payment collected
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#121620] border border-white/[0.08] shadow-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Test Rides
                </span>
                <Calendar className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-sky-300 font-mono">
                {leads.filter((l) => l.inquiryType.includes("Test Drive")).length}
              </div>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                Doorstep & showroom rides
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#121620] border border-white/[0.08] shadow-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Conversion Rate
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {stats?.conversionRate == null ? "Not measured" : `${stats.conversionRate}%`}
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                Conversion rate is not measured
              </span>
            </div>
          </div>}

          {/* TAB 1: LEADS & BOOKINGS */}
          {activeTab === "leads" && (
            <div className="rounded-3xl bg-[#121620] border border-white/[0.08] overflow-hidden shadow-xl">
              {/* Table Controls */}
              <div className="p-6 border-b border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:w-80">
                  <input
                    type="text"
                    placeholder="Search name, phone, area..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  {/* Inquiry Type Filter */}
                  <select
                    value={inquiryFilter}
                    onChange={(e) => setInquiryFilter(e.target.value)}
                    className="bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL">All Inquiry Types</option>
                    <option value="TEST_DRIVE">Test Rides Only</option>
                    <option value="TOKEN">Reservation Enquiries</option>
                    <option value="ENQUIRY">General Enquiries</option>
                  </select>

                  {/* Branch Filter */}
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL">All Branches</option>
                    <option value="Seelanaickenpatti">Seelanaickenpatti</option>
                    <option value="Madathur">Madathur</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="TEST_DRIVE_SCHEDULED">Test Drive</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="LOST">Lost</option>
                  </select>

                  {/* Export CSV */}
                  <button
                    onClick={exportCSV}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-bold border border-white/[0.1] transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0e121a] text-slate-400 font-bold uppercase tracking-wider border-b border-white/[0.06]">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Model & Color</th>
                      <th className="p-4">Inquiry / Schedule</th>
                      <th className="p-4">Branch</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Rep Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No leads match your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <td className="p-4 font-bold text-white">
                            <div className="flex items-center space-x-2">
                              <span>{lead.name}</span>
                              {lead.message && (
                                <span className="w-2 h-2 rounded-full bg-sky-400" title="Has custom message" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                              {lead.cityArea}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-300">
                            +91 {lead.phone}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-white block">
                              {lead.useCase || "E-Luna PRO X3"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {lead.preferredColor}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block mb-1 ${
                                lead.inquiryType === "Reservation Enquiry"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                  : lead.inquiryType.includes("Enquiry")
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                  : "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                              }`}
                            >
                              {lead.inquiryType}
                            </span>
                            {lead.preferredDate && (
                              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-sky-400" />
                                <span>{lead.preferredDate}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="text-[11px] font-medium text-emerald-400">
                              {lead.assignedBranch}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className="bg-[#181d2a] border border-white/[0.1] rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="TEST_DRIVE_SCHEDULED">TEST DRIVE</option>
                              <option value="CONVERTED">CONVERTED</option>
                              <option value="LOST">LOST</option>
                            </select>
                          </td>
                          <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => openWhatsApp(lead)}
                                title="Chat on WhatsApp"
                                className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-black transition-colors"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              <a
                                href={`tel:${lead.phone}`}
                                title="Call Customer"
                                className="p-2 rounded-xl bg-sky-500/15 hover:bg-sky-500 text-sky-400 hover:text-black transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & PRICING MANAGEMENT */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Vehicle Models & Pricing</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage Kinetic Green EV models, pricing, battery specs, and website visibility.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct({
                      id: "",
                      name: "",
                      slug: "",
                      category: "Personal",
                      price: "₹69,990*",
                      range: "110 km",
                      speed: "50 km/h",
                      payload: "150 kg",
                      battery: "2.3 kWh Advanced Li-ion",
                      motor: "1.2 kW BLDC",
                      warranty: "Confirm component coverage with showroom",
                      image: "/assets/bikes/studio-yellow-hd.jpg",
                      description: "",
                      isPublished: true,
                      order: products.length + 1,
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle Model</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="rounded-3xl bg-[#121620] border border-white/[0.08] p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.08] text-slate-300 font-bold uppercase">
                          {prod.category}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            prod.isPublished
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {prod.isPublished ? "Active on Website" : "Hidden"}
                        </span>
                      </div>

                      <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/[0.08] mb-4 h-40 flex items-center justify-center p-2">
                        <img
                          src={prod.image || "/assets/bikes/studio-yellow-hd.jpg"}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <h3 className="text-lg font-bold text-white">{prod.name}</h3>
                      <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                        {prod.price}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-slate-300">
                        <div className="p-2 rounded-xl bg-white/[0.03]">
                          <span className="text-slate-500 block">Range</span>
                          <span className="font-bold">{prod.range}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03]">
                          <span className="text-slate-500 block">Top Speed</span>
                          <span className="font-bold">{prod.speed}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03]">
                          <span className="text-slate-500 block">Payload</span>
                          <span className="font-bold">{prod.payload}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03]">
                          <span className="text-slate-500 block">Battery</span>
                          <span className="font-bold">{prod.battery}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsProductModalOpen(true);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-bold text-white transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-sky-400" />
                        <span>Edit Specs</span>
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OFFERS MANAGEMENT */}
          {activeTab === "offers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Dealership Offers & Deals</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Control active promotions displayed to customers on the homepage.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingOffer({
                      id: "",
                      title: "",
                      badge: "Special Promotion",
                      discount: "",
                      validTill: "Limited Period",
                      description: "",
                      terms: "T&C Apply",
                      isActive: true,
                      order: offers.length + 1,
                    });
                    setIsOfferModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Offer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="rounded-3xl bg-[#121620] border border-white/[0.08] p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                          {offer.badge}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            offer.isActive
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {offer.isActive ? "Published" : "Draft"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">
                        {offer.title}
                      </h3>
                      <div className="text-lg font-black text-amber-400 font-mono mb-2">
                        {offer.discount}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {offer.description}
                      </p>
                      <div className="text-[10px] text-slate-500">
                        Validity: <span className="text-slate-300">{offer.validTill}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <button
                        onClick={() => {
                          setEditingOffer(offer);
                          setIsOfferModalOpen(true);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-bold text-white transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-sky-400" />
                        <span>Edit Offer</span>
                      </button>
                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "stories" && <AdminCustomerStories/>}

          {/* TAB 4: ANALYTICS & TRAFFIC */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Salem Lead Attribution & Analytics</h2>
              {stats?.sources && (
                <div className="p-6 rounded-3xl bg-[#121620] border border-white/[0.08]">
                  <h3 className="text-sm font-bold text-white mb-4">
                    Traffic Sources & Dealership QR Distribution
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.sources.map((src: any) => (
                      <div key={src.name} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                        <span className="text-xs text-slate-400 block truncate">
                          {src.name}
                        </span>
                        <div className="flex items-baseline space-x-2 mt-2">
                          <span className="text-2xl font-bold text-white font-mono">
                            {src.count}
                          </span>
                          <span className="text-xs font-semibold text-emerald-400">
                            ({src.pct})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* LEAD DETAIL MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-white/[0.1] rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                  Lead Details
                </span>
                <h3 className="text-xl font-bold text-white">{selectedLead.name}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1]"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Phone</span>
                <span className="font-mono text-emerald-400 font-bold">+91 {selectedLead.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Area / Address</span>
                <span>{selectedLead.cityArea}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Model Interest</span>
                <span className="font-bold">{selectedLead.useCase || "Kinetic E-Luna PRO X3"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Preferred Color</span>
                <span>{selectedLead.preferredColor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Inquiry Type</span>
                <span className="font-bold text-amber-400">{selectedLead.inquiryType}</span>
              </div>
              {selectedLead.preferredDate && (
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Scheduled Date & Time</span>
                  <span className="font-bold text-sky-400">
                    {selectedLead.preferredDate} ({selectedLead.preferredTime || "Morning"})
                  </span>
                </div>
              )}
              {selectedLead.message && (
                <div className="py-2 border-b border-white/[0.04]">
                  <span className="text-slate-400 block mb-1">Customer Message:</span>
                  <p className="p-3 rounded-xl bg-white/[0.03] text-slate-200 italic leading-relaxed">
                    "{selectedLead.message}"
                  </p>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Showroom Branch</span>
                <span>{selectedLead.assignedBranch}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Source</span>
                <span>{selectedLead.source}</span>
              </div>
            </div>

            <div className="pt-3 flex space-x-3">
              <button
                onClick={() => openWhatsApp(selectedLead)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </button>
              <a
                href={`tel:${selectedLead.phone}`}
                className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs flex items-center justify-center"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT EDIT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-white/[0.1] rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-lg font-bold text-white">
                {editingProduct.id ? "Edit Vehicle Specs" : "Add New Vehicle Model"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl bg-white/[0.05]"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProduct(editingProduct);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Starting Price</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: e.target.value })
                    }
                    className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Certified Range</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.range}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, range: e.target.value })
                    }
                    className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Top Speed</label>
                  <input
                    type="text"
                    value={editingProduct.speed}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, speed: e.target.value })
                    }
                    className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Payload Capacity</label>
                  <input
                    type="text"
                    value={editingProduct.payload}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, payload: e.target.value })
                    }
                    className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Battery Specification</label>
                <input
                  type="text"
                  value={editingProduct.battery}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, battery: e.target.value })
                  }
                  className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, image: e.target.value })
                  }
                  className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="prod-published"
                  checked={editingProduct.isPublished}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      isPublished: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <label htmlFor="prod-published" className="text-slate-300">
                  Publish on website
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFER EDIT MODAL */}
      {isOfferModalOpen && editingOffer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-white/[0.1] rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-lg font-bold text-white">
                {editingOffer.id ? "Edit Promotion Offer" : "Create New Promotion"}
              </h3>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="p-2 rounded-xl bg-white/[0.05]"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveOffer(editingOffer);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">Offer Title</label>
                <input
                  type="text"
                  required
                  value={editingOffer.title}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, title: e.target.value })
                  }
                  className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingOffer.badge}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, badge: e.target.value })
                    }
                    className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Benefit Headline</label>
                  <input
                    type="text"
                    value={editingOffer.discount}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, discount: e.target.value })
                    }
                    className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingOffer.description}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, description: e.target.value })
                  }
                  className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Validity Text</label>
                <input
                  type="text"
                  value={editingOffer.validTill}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, validTill: e.target.value })
                  }
                  className="w-full bg-[#181d2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="offer-active"
                  checked={editingOffer.isActive}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, isActive: e.target.checked })
                  }
                  className="rounded"
                />
                <label htmlFor="offer-active" className="text-slate-300">
                  Active (Display on website)
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
