import { Button } from "@/shadcn-components/ui/button";

const DisplayLoadMore = ({ data, hasMoreBlogs, setPageNo }) => {
  return (
    <div className="flex justify-center mt-6">
      {data.length > 0 && hasMoreBlogs && (
        <Button
          onClick={() => setPageNo((prev) => prev + 1)}
          className="bg-black text-white border border-gray-800 rounded-md px-8 py-3 hover:bg-gray-900 hover:border-gray-900 transition-colors shadow-md font-medium text-sm cursor-pointer"
        >
          Load More...
        </Button>
      )}
    </div>
  );
};

export default DisplayLoadMore;
