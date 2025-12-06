import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services does S.V Real Estate offer?",
    answer: "We offer comprehensive real estate mediation services including property buying assistance, selling services, rental management, property hunting, legal verification, and documentation support. As a mediator, we connect buyers, sellers, and renters while ensuring transparent and hassle-free transactions."
  },
  {
    question: "How does the mediator service work?",
    answer: "Our mediator service acts as a trusted bridge between property owners and seekers. We verify properties, negotiate fair deals, handle documentation, and ensure smooth transactions. We charge a transparent service fee that's agreed upon before starting the process."
  },
  {
    question: "What are your service charges?",
    answer: "Our service charges vary based on the transaction type. For sales, we typically charge 1-2% of the property value. For rentals, it's usually one month's rent. All fees are discussed upfront with no hidden charges."
  },
  {
    question: "How do you verify properties?",
    answer: "We conduct thorough verification including legal document checks, ownership verification, encumbrance certificates, property tax status, and physical inspection. We also verify RERA registration for applicable properties."
  },
  {
    question: "Can I list my property with you?",
    answer: "Absolutely! You can list your property through our 'List Your Property' page. Our team will verify the details, take professional photographs, and market your property to potential buyers or tenants."
  },
  {
    question: "How long does it typically take to find a property?",
    answer: "The timeline varies based on your requirements and market conditions. For rentals, we usually find suitable options within 1-2 weeks. For purchases, it may take 2-4 weeks to shortlist properties that match your criteria."
  }
];

export function FAQ() {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mt-4">
              Find answers to common questions about our real estate mediation services.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 border-none shadow-card"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
