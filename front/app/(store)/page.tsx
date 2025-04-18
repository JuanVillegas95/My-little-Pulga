import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCatgories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import BlackFriday from "@/components/BlackFriday";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <div>      
      <BlackFriday />
      <div className="flex flex-col items-start justify-top min-h-screen bg-gray-100 p-4">
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
