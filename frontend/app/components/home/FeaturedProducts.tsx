import Image from "next/image";
import Link from "next/link";

export default function FeaturedProducts() {
  // Mock products - in a real app, these would come from an API
  const products = [
    {
      id: 1,
      title: "Noise Cancelling Headphones",
      category: "Electronics",
      price: 120,
      description: "Almost new, used for 1 semester",
      image: "https://picsum.photos/seed/1/500/500"
    },
    {
      id: 2,
      title: "Calculus Textbook",
      category: "Textbooks",
      price: 45,
      description: "7th edition, great condition",
      image: "https://picsum.photos/seed/2/500/500"
    },
    {
      id: 3,
      title: "Desk Lamp",
      category: "Dorm Essentials",
      price: 25,
      description: "Adjustable, with USB charging port",
      image: "https://picsum.photos/seed/3/500/500"
    },
    {
      id: 4,
      title: "Graphic Calculator",
      category: "Electronics",
      price: 60,
      description: "TI-84 Plus, works perfectly",
      image: "https://picsum.photos/seed/4/500/500"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/marketplace" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
              <div className="aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{product.category}</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">${product.price}</span>
                </div>
                <h3 className="font-medium mt-1 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}