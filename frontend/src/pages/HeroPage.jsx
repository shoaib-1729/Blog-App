import heroIllustration from "../assets/hero-illustration.png";

const HeroPage = ({ handleGetStarted }) => {
  return (
    <div className="bg-[#F5F4F0] min-h-screen flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-12 gap-6 lg:gap-12">
        {/* Left Text */}
        <div className="w-full lg:max-w-xl text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-snug sm:leading-tight text-gray-900 break-words">
            Share your story. Inspire the world.
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 max-w-md mx-auto lg:mx-0">
            BloomVerse is your personal blogging space — share your thoughts,
            stories, and ideas with readers around the world. Discover trending
            blogs and connect with creators who inspire you.
          </p>
          <button
            onClick={handleGetStarted}
            className="mt-6 bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg md:text-xl hover:bg-gray-800 transition-colors duration-200 cursor-pointer font-medium"
          >
            Get Started
          </button>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src={heroIllustration}
            alt="hero-graphic"
            className="w-3/4 sm:w-2/3 md:w-3/5 lg:w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-300 py-4 sm:py-6 text-center text-xs sm:text-sm text-gray-600 px-4">
        <p>© {new Date().getFullYear()} BloomVerse — All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HeroPage;
