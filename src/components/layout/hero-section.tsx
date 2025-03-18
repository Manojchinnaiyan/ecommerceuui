// components/layout/hero-section.tsx
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] bg-gray-50">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <div className="max-w-md">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                The Fashion App That Makes You Look Your Best
              </h1>
              <p className="text-gray-600 mb-8">
                Discover the latest trends and elevate your style with our
                curated collection
              </p>
              <Link
                href="/category/new"
                className="inline-block bg-black text-white px-8 py-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Let's Get Started
              </Link>
              <div className="mt-4">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-black underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Visual Elements */}
          <div className="hidden md:flex items-center justify-center relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px]">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-gray-200"></div>
              <div className="absolute bottom-0 left-10 w-36 h-36 rounded-full bg-gray-200"></div>
              <div className="absolute top-10 right-0 w-40 h-40 rounded-full bg-gray-200"></div>
              <div className="absolute -bottom-5 right-10 w-32 h-32 rounded-full bg-gray-200"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">
                *
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
