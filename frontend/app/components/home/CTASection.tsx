import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 bg-blue-600 dark:bg-blue-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start buying and selling?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-blue-100">
          Join thousands of students who are already saving money and finding great deals.
        </p>
        <Link href="/register" className="px-8 py-4 bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-300 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 inline-block">
          Create Your Free Account
        </Link>
      </div>
    </section>
  );
}