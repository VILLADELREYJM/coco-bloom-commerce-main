import { Star, User } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Jenkins",
        location: "Manila, PH",
        quote: "The quality of these coconut coir pots is outstanding. My plants show visibly better root growth compared to plastic pots!",
        rating: 5,
        initial: "S",
        color: "bg-[#4a6b4a]"
    },
    {
        name: "Michael Chen",
        location: "Makati City, PH",
        quote: "Fast delivery and excellent customer service. The packaging was completely plastic-free which I really appreciate.",
        rating: 5,
        initial: "M",
        color: "bg-[#3d5a3d]"
    },
    {
        name: "Elena Rodriguez",
        location: "Cebu City, PH",
        quote: "I love using the coir mulch mat. It really helps retain moisture in my vegetable garden during the hot summer months.",
        rating: 5,
        initial: "E",
        color: "bg-[#2f452f]"
    },
    {
        name: "David Thompson",
        location: "Taguig, PH",
        quote: "Solid construction on the coir logs. Perfect for the landscaping project I was working on for our community park.",
        rating: 5,
        initial: "D",
        color: "bg-[#4a6b4a]"
    },
    {
        name: "Jessica Lee",
        location: "Pasig City, PH",
        quote: "Beautiful and functional. The hanging baskets serve as a natural accent on my porch and drain water perfectly.",
        rating: 5,
        initial: "J",
        color: "bg-[#3d5a3d]"
    },
    {
        name: "Robert Wilson",
        location: "Davao City, PH",
        quote: "Highly recommend! I've been looking for sustainable alternatives for my nursery and these are the best quality I've found.",
        rating: 5,
        initial: "R",
        color: "bg-[#2f452f]"
    }
];

const TestimonialSection = () => {
    return (
        <section className="bg-[#4a6b4a]/5 py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-12">
                    <span className="inline-block rounded-full bg-[#4a6b4a]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#4a6b4a] mb-4 uppercase">
                        Reviews
                    </span>
                    <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                        User Feedback
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col justify-between rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-slate-100 hover:shadow-md transition-shadow"
                        >
                            <div>
                                <div className="flex gap-0.5 mb-2 sm:mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <blockquote className="text-slate-700 leading-relaxed mb-4 sm:mb-6 text-xs sm:text-base">
                                    "{testimonial.quote}"
                                </blockquote>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-white font-bold text-xs sm:text-base ${testimonial.color}`}>
                                    {testimonial.initial}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                                        {testimonial.name}
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-slate-500">
                                        {testimonial.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
