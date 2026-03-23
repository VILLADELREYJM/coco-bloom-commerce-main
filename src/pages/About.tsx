import { Link } from "react-router-dom";
import { Coffee, Code, Users, Link as LinkIcon } from "lucide-react";
import BuyerLayout from "../components/BuyerLayout";
import RevealOnScroll from "../components/RevealOnScroll";
import { useState } from "react";

const About = () => {
    const [showTeamFallback, setShowTeamFallback] = useState(false);

    return (
        <BuyerLayout>
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <RevealOnScroll>
                    <h1 className="text-4xl font-bold text-center mb-12 text-primary">About Us</h1>
                </RevealOnScroll>

                {/* About the Project Section */}
                <RevealOnScroll delay={100}>
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <Coffee className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-semibold">About the Project</h2>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6 rounded-r-md">
                                <p className="text-primary-700 text-sm font-medium">
                                    Notice: This project was created for educational purposes only.
                                </p>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                Ecocoin Market is a modern e-commerce platform designed to bridge the gap between local coconut farmers and consumers. Our mission is to promote sustainable agriculture and provide a seamless marketplace for high-quality coconut products.
                            </p>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                We focus on fair trade, empowering local communities, and delivering the best nature has to offer directly to your doorstep.
                            </p>
                        </div>
                    </section>
                </RevealOnScroll>

                {/* Our Team Section */}
                <RevealOnScroll delay={200}>
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-semibold">Our Team</h2>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center mb-8 border-2 border-dashed border-gray-300 overflow-hidden relative">
                                {!showTeamFallback && (
                                    <img
                                        src="/OurTeamPhoto.png"
                                        alt="Ecocoin Market Team"
                                        className="absolute inset-0 h-full w-full object-cover"
                                        onError={() => setShowTeamFallback(true)}
                                    />
                                )}

                                {showTeamFallback && (
                                    <>
                                        <Users className="w-16 h-16 text-gray-400 mb-4 z-10" />
                                        <p className="text-gray-500 font-medium z-10">Group Photo Placeholder</p>
                                    </>
                                )}
                            </div>
                            <p className="text-center text-gray-600 max-w-2xl mx-auto text-lg">
                                We are a passionate team of developers, designers, and e-commerce enthusiasts dedicated to making Ecocoin Market a success.
                            </p>
                        </div>
                    </section>
                </RevealOnScroll>

                {/* Tech Stack & Tools Section */}
                <RevealOnScroll delay={300}>
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <Code className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-semibold">Tech Stack & Tools</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: "React", description: "Frontend Library", delay: 100 },
                                { name: "Vite", description: "Build Tool", delay: 200 },
                                { name: "Tailwind CSS", description: "Styling", delay: 300 },
                                { name: "Firebase", description: "Backend & DB", delay: 400 },
                                { name: "TypeScript", description: "Language", delay: 500 },
                                { name: "Lucide React", description: "Icons", delay: 600 },
                                { name: "React Router", description: "Navigation", delay: 700 },
                                { name: "shadcn/ui", description: "Components", delay: 800 }
                            ].map((tech) => (
                                <RevealOnScroll key={tech.name} delay={tech.delay} className="h-full">
                                    <div className="bg-white h-full p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                        <h3 className="font-semibold text-lg text-gray-800">{tech.name}</h3>
                                        <p className="text-sm text-gray-500">{tech.description}</p>
                                    </div>
                                </RevealOnScroll>
                            ))}
                        </div>
                    </section>
                </RevealOnScroll>

                {/* References Section */}
                <RevealOnScroll delay={400}>
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <LinkIcon className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-semibold">References</h2>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Image Files Used in This Project</h3>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li>• <span className="font-medium">/images/hero-coir.jpg</span> — Homepage hero banner</li>
                                        <li>• <span className="font-medium">/images/logo.png</span> — Navbar and footer logo</li>
                                        <li>• <span className="font-medium">/OurTeamPhoto.png</span> — About Us team photo section</li>
                                        <li>• <span className="font-medium">/images/product-coir-rope.jpg</span> — Product catalog item image</li>
                                        <li>• <span className="font-medium">/images/product-coir-mat.jpg</span> — Product catalog item image</li>
                                        <li>• <span className="font-medium">/images/product-coir-pot.jpg</span> — Product catalog item image</li>
                                        <li>• <span className="font-medium">/images/product-coir-net.jpg</span> — Product catalog item image</li>
                                        <li>• <span className="font-medium">/images/product-coir-brush.jpg</span> — Product catalog item image</li>
                                        <li>• <span className="font-medium">/images/product-coir-block.jpg</span> — Product catalog item image</li>
                                        <li>• <span className="font-medium">/images/product-coir-board.jpg</span> — Product catalog item image</li>
                                        <li>• <span className="font-medium">/images/product-coir-liner.jpg</span> — Product catalog item image</li>
                                        <li>• <span className="font-medium">/placeholder.svg</span> — Fallback image in buyer/seller/order views</li>
                                    </ul>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                        <p className="text-gray-700">Icons provided by <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Lucide React</a>.</p>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                        <p className="text-gray-700">UI Components from <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">shadcn/ui</a>.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </RevealOnScroll>

                <RevealOnScroll delay={500}>
                    <div className="text-center mt-12 mb-8">
                        <Link to="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2">
                            Back to Home
                        </Link>
                    </div>
                </RevealOnScroll>
            </div>
        </BuyerLayout>
    );
};

export default About;
