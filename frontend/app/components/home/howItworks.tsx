export default function HowItWorks() {
  const steps = [
    {
      icon: "📱",
      title: "Create an Account",
      description: "Sign up with your student email to verify your campus identity"
    },
    {
      icon: "📦",
      title: "List or Browse",
      description: "Upload items to sell or browse what other students are offering"
    },
    {
      icon: "🤝",
      title: "Meet & Exchange",
      description: "Connect with buyers or sellers and exchange items on campus"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Simple, safe, and student-focused marketplace just for your campus
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}