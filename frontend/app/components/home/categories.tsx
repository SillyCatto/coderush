import Link from "next/link";

export default function Categories() {
  const categories = [
    { name: "Textbooks", icon: "📚", color: "bg-blue-100 dark:bg-blue-900" },
    { name: "Electronics", icon: "💻", color: "bg-green-100 dark:bg-green-900" },
    { name: "Dorm Essentials", icon: "🛏️", color: "bg-yellow-100 dark:bg-yellow-900" },
    { name: "Clothing", icon: "👕", color: "bg-purple-100 dark:bg-purple-900" },
    { name: "Sports Equipment", icon: "⚽", color: "bg-red-100 dark:bg-red-900" },
    { name: "Event Tickets", icon: "🎫", color: "bg-pink-100 dark:bg-pink-900" },
    { name: "Course Notes", icon: "📝", color: "bg-indigo-100 dark:bg-indigo-900" },
    { name: "Furniture", icon: "🪑", color: "bg-orange-100 dark:bg-orange-900" }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Buy or Sell What You Want</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our categories to find exactly what you need or list your items for sale. 
            Connect with fellow students and make the most of global and your campus marketplace!
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
            <div 
              key={index} 
              className={`${category.color} p-6 rounded-xl flex flex-col items-center justify-center text-center h-40 transition-transform hover:scale-105 cursor-pointer`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-medium">{category.name}</h3>
            </div>
            ))}
        </div>
      </div>
    </section>
  );
}