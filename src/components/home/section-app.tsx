
import Image from "next/image";
import Link from "next/link";

export function SectionApp() {
    return (
        <section className="relative overflow-hidden py-16 md:py-20">
            <div className="absolute inset-0 bg-primary/90 z-0">
                <Image 
                    src="https://placehold.co/1920x600.png"
                    alt="abstract background"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-20"
                    data-ai-hint="abstract geometric"
                />
            </div>
            <div className="container relative z-10 mx-auto px-4">
                <div className="bg-primary rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 items-center">
                        <div className="p-8 md:p-10 lg:p-12 text-white">
                            <h3 className="text-2xl md:text-3xl font-bold font-headline mb-3">
                                Download the AIDoctor App today!
                            </h3>
                            <p className="text-white/80 mb-6 text-sm">
                                To download an app related to a doctor or medical services,
                                you can typically visit the app store on your device.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="#">
                                    <Image 
                                        src="https://placehold.co/160x54.png" 
                                        alt="App Store" 
                                        width={160} 
                                        height={54} 
                                        className="rounded-lg transition-transform hover:scale-105"
                                        data-ai-hint="app store"
                                    />
                                </Link>
                                <Link href="#">
                                    <Image 
                                        src="https://placehold.co/160x54.png" 
                                        alt="Google Play" 
                                        width={160} 
                                        height={54} 
                                        className="rounded-lg transition-transform hover:scale-105"
                                        data-ai-hint="play store"
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-full hidden md:block">
                            <Image
                                src="https://placehold.co/500x500.png"
                                alt="Mobile App"
                                width={500}
                                height={500}
                                className="object-contain -mb-10 drop-shadow-2xl"
                                data-ai-hint="phone app"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
