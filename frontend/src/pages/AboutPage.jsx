import React from "react";
import { useUser } from "../context/UserContext";

const AboutPage = () => {
  const userData = useUser();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Bio Section - Medium Style */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">About</h2>

        {userData?.bio ? (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-7 text-[15px]">
              {userData?.bio}
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm text-center">
              You haven’t added a bio yet. <br />
              <span className="text-gray-500">
                Update your profile to share a little about yourself.
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Simple Stats - Minimal */}
      <div className="flex gap-8 mt-12 pt-8 border-t border-gray-100">
        <div className="text-center">
          <div className="text-gray-900 font-medium mb-1">
            {userData?.blogs?.length || 0}
          </div>
          <div className="text-gray-500 text-xs">Blogs</div>
        </div>

        <div className="text-center">
          <div className="text-gray-900 font-medium mb-1">
            {userData?.followers?.length || 0}
          </div>
          <div className="text-gray-500 text-xs">Followers</div>
        </div>

        <div className="text-center">
          <div className="text-gray-900 font-medium mb-1">
            {userData?.following?.length || 0}
          </div>
          <div className="text-gray-500 text-xs">Following</div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
