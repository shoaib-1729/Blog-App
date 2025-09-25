import React from "react";

// Individual Blog Card Shimmer
const BlogCardShimmer = () => (
  <div className="py-6 animate-pulse">
    {/* Creator Info Shimmer */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="flex flex-col gap-2">
        <div className="w-24 h-3 bg-gray-200 rounded"></div>
        <div className="w-16 h-2 bg-gray-200 rounded"></div>
      </div>
    </div>

    {/* Blog Content Shimmer */}
    <div className="mb-4">
      <div className="w-4/5 h-6 bg-gray-200 rounded mb-2"></div>
      <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>

      {/* Blog Image Shimmer */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>

      {/* Tags Shimmer */}
      <div className="flex gap-2 mb-4">
        <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
      </div>

      {/* Actions Shimmer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-6 bg-gray-200 rounded"></div>
          <div className="w-16 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="w-8 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Sidebar Blog Item Shimmer
const SidebarBlogShimmer = () => (
  <div className="flex items-start gap-3 p-2 animate-pulse">
    {/* Thumbnail Shimmer */}
    <div className="w-16 h-16 bg-gray-200 rounded-md"></div>

    {/* Content Shimmer */}
    <div className="flex-1">
      {/* Creator Info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        <div className="w-20 h-3 bg-gray-200 rounded"></div>
      </div>

      {/* Title */}
      <div className="w-full h-4 bg-gray-200 rounded mb-1"></div>
      <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>

      {/* Meta */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-200 rounded"></div>
        <div className="w-16 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Tags Section Shimmer
const TagsShimmer = () => (
  <div className="animate-pulse">
    <div className="w-32 h-5 bg-gray-200 rounded mb-4"></div>
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className={`h-6 bg-gray-200 rounded-full ${
            item === 1
              ? "w-16"
              : item === 2
                ? "w-20"
                : item === 3
                  ? "w-12"
                  : item === 4
                    ? "w-24"
                    : item === 5
                      ? "w-14"
                      : "w-18"
          }`}
        ></div>
      ))}
    </div>
  </div>
);

// Sidebar Section Shimmer
const SidebarSectionShimmer = ({ title, count = 3 }) => (
  <div className="animate-pulse">
    <div className="w-32 h-4 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SidebarBlogShimmer key={index} />
      ))}
      <div className="w-24 h-3 bg-gray-200 rounded mt-2"></div>
    </div>
  </div>
);

// Load More Button Shimmer
const LoadMoreShimmer = () => (
  <div className="flex justify-center mt-4 animate-pulse">
    <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
  </div>
);

// Main Shimmer Component
const HomePageShimmer = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="relative flex flex-col-reverse md:flex-row gap-8">
        {/* Full-height vertical separator */}
        <div className="hidden md:block absolute top-0 bottom-0 left-2/3 w-px bg-gray-200" />

        {/* Main Blog Section Shimmer */}
        <div className="w-full md:w-2/3">
          <div className="flex flex-col divide-y divide-gray-200">
            {/* Multiple Blog Cards */}
            {Array.from({ length: 4 }).map((_, index) => (
              <BlogCardShimmer key={index} />
            ))}

            {/* Load More Button */}
            <LoadMoreShimmer />
          </div>
        </div>

        {/* Sidebar Shimmer */}
        <aside className="w-full md:w-1/3 md:pl-8 flex flex-col gap-10">
          {/* Tags Shimmer */}
          <div className="order-1 md:order-1">
            <TagsShimmer />
          </div>

          {/* Saved Blogs Shimmer */}
          <div className="order-3 md:order-2">
            <SidebarSectionShimmer title="Your Saved Blogs" count={3} />
          </div>

          {/* Liked Blogs Shimmer */}
          <div className="order-4 md:order-3">
            <SidebarSectionShimmer title="Your Liked Blogs" count={3} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePageShimmer;
