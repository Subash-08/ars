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
export async function getCatalog(): Promise<{
    products: PublicProduct[];
    unavailable: boolean;
}> {
    try {
        return { products: await prisma.product.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } }), unavailable: false };
    }
    catch {
        return { products: [], unavailable: true };
    }
}

export async function getProduct(slug: string) {
  return prisma.product.findFirst({ where: { slug, isPublished: true } });
}
