import productSeed from "../../prisma/products.seed.json";
import { prisma } from "./prisma";
export type PublicProduct = {
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
};
const referenceProducts: PublicProduct[] = productSeed
    .filter(product => product.isPublished)
    .map(({ isPublished, order, ...product }) => ({ ...product, id: product.slug, price: "" }));

export async function getCatalog(): Promise<{ products: PublicProduct[] }> {
    try {
        return { products: await prisma.product.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } }) };
    }
    catch {
        return { products: referenceProducts };
    }
}

export async function getProduct(slug: string): Promise<PublicProduct | null> {
    try {
        return await prisma.product.findFirst({ where: { slug, isPublished: true } });
    }
    catch {
        return referenceProducts.find(product => product.slug === slug) ?? null;
    }
}
