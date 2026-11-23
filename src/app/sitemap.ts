import { MetadataRoute } from "next";
export default function sitemap():MetadataRoute.Sitemap {const base=process.env.NEXT_PUBLIC_SITE_URL||"https://arsmotors.in";return ["","/e-luna","/finance-offers","/ownership","/showrooms","/about","/privacy","/booking-terms","/offer-terms"].map(path=>({url:`${base}${path}`,changeFrequency:"monthly",priority:path?0.7:1}));}
