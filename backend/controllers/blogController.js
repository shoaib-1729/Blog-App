const logger = require("../utils/logger");
const Blog = require("../models/blogModel.js");
const Comment = require("../models/commentModel.js");
const User = require("../models/userModel.js");
const { v4: uuidv4 } = require("uuid");
const {
  cloudinaryImageUpload,
  cloudinaryDestroyImage,
} = require("../config/cloudinaryConfig.js");

// get all blogs controller
async function getBlogs(req, res) {
  try {
    const pageNo = Number(req.query.pageNo);
    const limit = Number(req.query.limit);

    const skip = (pageNo - 1) * limit;

    const totalBlogs = await Blog.countDocuments({ draft: false });
    const hasMoreBlogs = totalBlogs > skip + limit;

    const blogs = await Blog.find({ draft: false })
      .populate({
        path: "creator",
        select: "name username email profilePic followers",
      })
      .populate({
        path: "likedBy",
        select: "name email",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Here are the latest posts",
      blogs,
      hasMoreBlogs,
    });
  } catch (err) {
    logger.info("Error fetching blogs", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: err.message,
    });
  }
}

// get blog by id controller
async function getBlogById(req, res) {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ blogId: id })
      .populate({
        path: "creator",
        select: "name username email profilePic followers",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user likedBy",
          select: "name email profilePic",
        },
      })
      .lean()
      .sort({ createdAt: -1 });

    async function populateReplies(comments) {
      for (const comment of comments) {
        let populatedComment = await Comment.findById(comment._id)
          .populate({
            path: "replies",
            populate: {
              path: "user",
              select: "name email",
            },
          })
          .lean();

        // set populated data to comment replies
        comment.replies = populatedComment.replies;

        // populate reply ke bhi replies
        // recursive base case
        if (comment.replies.length > 0) {
          await populateReplies(comment.replies);
        }
      }
      return comments;
    }

    blog.comments = await populateReplies(blog.comments);

    return res.json({
      success: true,
      message: "Blog loaded",
      blog,
    });
  } catch (err) {
    logger.info("Error fetching blog", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: err.message,
    });
  }
}

// create blog controller
async function createBlog(req, res) {
  try {
    // extract creator id from req custom field
    let creator = req.user;

    const { title, description } = req.body;

    const draft = req.body.draft === "true" ? true : false;

    // Add JSON parsing error handling
    let content, tag;
    try {
      content = JSON.parse(req.body.content);
      tag = JSON.parse(req.body.tag);
    } catch (parseError) {
      logger.error("JSON Parse Error:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON data in request",
        error: parseError.message,
      });
    }

    const { image, images } = req.files;

    // Enhanced validations
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter the title",
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Title should be less than 200 characters",
      });
    }

    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter the description",
      });
    }

    if (description.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Description should be less than 500 characters",
      });
    }

    if (!content || !content.blocks || content.blocks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter the content",
      });
    }

    // Content length validation
    if (content.blocks.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Blog content is too long (maximum 50 blocks allowed)",
      });
    }

    if (!image || image.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select the cover image",
      });
    }

    // File size validation (5MB limit)
    if (image[0].size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Cover image size should be less than 5MB",
      });
    }

    if (!tag || tag.length === 0) {
      return res.status(400).json({
        // Fixed from 404 to 400
        success: false,
        message: "Please add at least one tag",
      });
    }

    if (tag.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Maximum 10 tags allowed",
      });
    }

    // Validate content images size
    if (images && images.length > 0) {
      for (let img of images) {
        if (img.size > 5 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            message: "Content images should be less than 5MB each",
          });
        }
      }
    }

    // blog id wala kaam karna hoga
    const randomId =
      title
        .trim() // Remove leading & trailing spaces
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") + // Remove multiple hyphens
      "-" +
      uuidv4().substring(0, 7);

    // Check user with id creator exists
    const author = await User.findById(creator);

    // creator not there -> early return
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    // Rate limiting check - ensure user doesn't create too many blogs
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const blogsToday = await Blog.countDocuments({
      creator: creator,
      createdAt: { $gte: today },
    });

    if (blogsToday >= 5) {
      // Limit 5 blogs per day
      return res.status(429).json({
        success: false,
        message: "Daily blog creation limit reached (5 blogs per day)",
      });
    }

    // image upload cloudinary pr
    // images -> content images
    let imageIndex = 0;
    for (let i = 0; i < content.blocks.length; i++) {
      // har block nikaalo
      const block = content.blocks[i];

      if (
        block.type == "image" &&
        block.data &&
        block.data.file &&
        block.data.file.image
      ) {
        if (imageIndex < images.length) {
          try {
            const { secure_url, public_id } = await cloudinaryImageUpload(
              `data:image/jpeg;base64,${images[imageIndex].buffer.toString(
                "base64"
              )}`
            );

            // Only update URL & imageId, rest untouched
            block.data.file.url = secure_url;
            block.data.file.imageId = public_id;

            // caption ko untouched chhod do
            imageIndex++;
          } catch (uploadError) {
            logger.error("Error uploading content image:", uploadError);
            return res.status(500).json({
              success: false,
              message: "Error uploading content images",
              error: uploadError.message,
            });
          }
        }
      }
    }

    // main image bhi upload kardo cloudinary par
    let mainImageUrl, mainImageId;
    try {
      const { secure_url, public_id } = await cloudinaryImageUpload(
        `data:image/jpeg;base64,${image[0].buffer.toString("base64")}`
      );
      mainImageUrl = secure_url;
      mainImageId = public_id;
    } catch (uploadError) {
      logger.error("Error uploading main image:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Error uploading cover image",
        error: uploadError.message,
      });
    }

    const blogData = {
      title: title.trim(),
      description: description.trim(),
      creator,
      image: mainImageUrl,
      imageId: mainImageId,
      blogId: randomId,
      content,
      tag: tag.map((t) => t.trim().toLowerCase()), // Normalize tags
      draft,
    };

    // Create blog and update user in a more robust way
    try {
      const blog = await Blog.create(blogData);

      // push to user blogs after creating
      await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });

      return res.status(201).json({
        success: true,
        message: draft ? "Blog saved as draft" : "Blog published successfully",
        blogId: randomId,
      });
    } catch (dbError) {
      logger.error("Database operation failed:", dbError);

      // Cleanup uploaded images if database operation fails
      try {
        await cloudinaryDestroyImage(mainImageId);
        if (images && images.length > 0) {
          const imageIds = content.blocks
            .filter(
              (block) => block.type === "image" && block.data.file.imageId
            )
            .map((block) => block.data.file.imageId);

          await Promise.all(imageIds.map((id) => cloudinaryDestroyImage(id)));
        }
      } catch (cleanupError) {
        logger.error("Error during cleanup:", cleanupError);
      }

      return res.status(500).json({
        success: false,
        message: "Error saving blog to database",
        error: dbError.message,
      });
    }
  } catch (err) {
    logger.error("Error creating blogs", err);
    return res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: err.message,
    });
  }
}

// update blog controller
async function updateBlog(req, res) {
  try {
    // update blog
    const { title, description } = req.body;
    const draft = req.body.draft === "true" ? true : false;

    // Add validation and error handling for JSON parsing
    let tag, content, existingImages;

    try {
      tag = req.body.tag ? JSON.parse(req.body.tag) : [];
      content = req.body.content
        ? JSON.parse(req.body.content)
        : { blocks: [] };
      existingImages = req.body.existingImages
        ? JSON.parse(req.body.existingImages)
        : [];
    } catch (parseError) {
      logger.error("JSON Parse Error:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON data in request",
        error: parseError.message,
      });
    }

    // Enhanced validations for update
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter the title",
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Title should be less than 200 characters",
      });
    }

    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter the description",
      });
    }

    if (description.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Description should be less than 500 characters",
      });
    }

    if (!content || !content.blocks || content.blocks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter the content",
      });
    }

    if (content.blocks.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Blog content is too long (maximum 50 blocks allowed)",
      });
    }

    if (!tag || tag.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one tag",
      });
    }

    if (tag.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Maximum 10 tags allowed",
      });
    }

    // multer
    const { image, images } = req.files || {};

    // File size validation
    if (image && image.length > 0 && image[0].size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Cover image size should be less than 5MB",
      });
    }

    if (images && images.length > 0) {
      for (let img of images) {
        if (img.size > 5 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            message: "Content images should be less than 5MB each",
          });
        }
      }
    }

    // extract id from params
    const { id } = req.params;

    // blog by id - use blogId field for lookup
    const blog = await Blog.findOne({ blogId: id });
    const creator = req.user;

    // validation
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog does not exist",
      });
    }

    // Authorization check
    if (blog.creator.toString() !== creator.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this blog",
      });
    }

    // Rate limiting for updates - prevent spam updates
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    if (blog.updatedAt && blog.updatedAt > oneHourAgo) {
      const timeDiff = Math.ceil(
        (oneHourAgo.getTime() - blog.updatedAt.getTime()) / (1000 * 60)
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${Math.abs(
          timeDiff
        )} minutes before updating again`,
      });
    }

    // Safer image deletion logic
    let imagesToDelete = [];

    if (blog.content && blog.content.blocks) {
      imagesToDelete = blog.content.blocks
        .filter(
          (block) => block.type === "image" && block.data && block.data.file
        )
        .filter((block) => {
          // Check if this image exists in existingImages
          const imageExists = existingImages.find(
            (existing) => existing.url === block.data.file.url
          );
          return !imageExists;
        })
        .map((block) => block.data.file.imageId)
        .filter((imageId) => imageId); // Filter out undefined
    }

    // delete images from cloudinary
    if (imagesToDelete.length > 0) {
      try {
        await Promise.all(
          imagesToDelete.map((id) => cloudinaryDestroyImage(id))
        );
      } catch (deleteError) {
        logger.error("Error deleting images:", deleteError);
        // Continue with update even if image deletion fails
      }
    }

    // Add new images to content blocks
    if (images && images.length > 0) {
      let imageIndex = 0;

      for (let i = 0; i < content.blocks.length; i++) {
        const block = content.blocks[i];

        if (
          block.type === "image" &&
          block.data &&
          block.data.file &&
          block.data.file.image &&
          imageIndex < images.length
        ) {
          try {
            const { secure_url, public_id } = await cloudinaryImageUpload(
              `data:image/jpeg;base64,${images[imageIndex].buffer.toString(
                "base64"
              )}`
            );

            block.data.file.url = secure_url;
            block.data.file.imageId = public_id;

            imageIndex++;
          } catch (uploadError) {
            logger.error("Error uploading image:", uploadError);
            return res.status(500).json({
              success: false,
              message: "Error uploading images",
              error: uploadError.message,
            });
          }
        }
      }
    }

    // Handle main image update
    if (image && image.length > 0) {
      try {
        // Delete old main image
        if (blog.imageId) {
          await cloudinaryDestroyImage(blog.imageId);
        }

        // Upload new main image
        const { secure_url, public_id } = await cloudinaryImageUpload(
          `data:image/jpeg;base64,${image[0].buffer.toString("base64")}`
        );

        blog.image = secure_url;
        blog.imageId = public_id;
      } catch (imageError) {
        logger.error("Error updating main image:", imageError);
        return res.status(500).json({
          success: false,
          message: "Error updating main image",
          error: imageError.message,
        });
      }
    }

    // Update blog fields with sanitization
    blog.title = title.trim();
    blog.description = description.trim();
    blog.content = content;
    blog.tag = tag.map((t) => t.trim().toLowerCase()); // Normalize tags
    blog.draft = draft;

    // save updated blog in DB
    try {
      await blog.save();
    } catch (saveError) {
      logger.error("Error saving blog:", saveError);
      return res.status(500).json({
        success: false,
        message: "Error saving blog updates",
        error: saveError.message,
      });
    }

    const user = await User.findById(creator)
      .select(
        "name email bio blogs followers following username password profilePic isVerified isGoogleAuth likedBlogs savedBlogs showLikedBlogs showSavedBlogs showDraftBlogs isTempPassword tempPasswordExpiry"
      )
      .populate({
        path: "blogs",
        populate: {
          path: "creator",
          select: "name username profilePic",
        },
      })
      .populate({
        path: "likedBlogs",
        populate: {
          path: "creator",
          select: "name username profilePic",
        },
      })
      .populate({
        path: "savedBlogs",
        populate: {
          path: "creator",
          select: "name username profilePic",
        },
      })
      .populate({
        path: "followers following",
        select: "name username email profilePic",
      });

    return res.status(200).json({
      success: true,
      message: draft ? "Blog saved as draft" : "Your blog has been updated",
      user,
    });
  } catch (err) {
    logger.error("Update blog error:", err);
    return res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: err.message,
    });
  }
}

// delete blog controller
async function deleteBlog(req, res) {
  try {
    // blog id
    const { id: blogId } = req.params;
    // find blog by id
    const blog = await Blog.findById(blogId);
    const userId = req.user;

    // validation
    // blog id valid?
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "Blog does not exist",
      });
    }

    // check user deleting the blog is creator or not?
    if (blog.creator != userId) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized for this action",
      });
    }

    // delete blog
    await Blog.findByIdAndDelete(blogId);

    // user se bhi delete karo
    await User.findByIdAndUpdate(userId, { $pull: { blogs: blogId } });

    // user se saved blog delete karo
    await User.updateMany(
      { savedBlogs: blogId },
      { $pull: { savedBlogs: blogId } }
    );

    // user se liked blog delete karo
    await User.updateMany(
      { likedBlogs: blogId },
      { $pull: { likedBlogs: blogId } }
    );

    // comment delete karo iss blog se
    await Comment.deleteMany({ _id: { $in: blog.comments } });

    // cloudinary se main image delete karo
    if (blog.imageId) {
      try {
        await cloudinaryDestroyImage(blog.imageId);
      } catch (cloudinaryError) {
        logger.error(
          "Error deleting main image from Cloudinary:",
          cloudinaryError
        );
      }
    }

    // cloudinary se content images bhi delete karo
    if (blog.content && blog.content.blocks) {
      const contentImages = blog.content.blocks
        .filter(
          (block) =>
            block.type === "image" &&
            block.data &&
            block.data.file &&
            block.data.file.imageId
        )
        .map((block) => block.data.file.imageId);

      if (contentImages.length > 0) {
        try {
          // Promise.all ke andar await nahi lagana hai, sirf functions pass karne hain
          await Promise.all(
            contentImages.map((imageId) => cloudinaryDestroyImage(imageId))
          );
        } catch (cloudinaryError) {
          logger.error(
            "Error deleting content images from Cloudinary:",
            cloudinaryError
          );
        }
      }
    }

    // Updated user data fetch karo aur return karo
    const updatedUser = await User.findById(userId)
      .populate({
        path: "blogs",
        populate: {
          path: "creator",
          select: "name username profilePic",
        },
      })
      .populate({
        path: "likedBlogs",
        populate: {
          path: "creator",
          select: "name username profilePic",
        },
      })
      .populate({
        path: "savedBlogs",
        populate: {
          path: "creator",
          select: "name username profilePic",
        },
      })
      .populate({
        path: "followers following",
        select: "name username email profilePic",
      });

    return res.status(200).json({
      success: true,
      message: "Your blog has been deleted",
      user: updatedUser,
    });
  } catch (err) {
    logger.info("Error deleting blog", err);
    return res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: err.message,
    });
  }
}

// like blog controller
async function likeBlog(req, res) {
  try {
    // blog id
    const { id } = req.params;

    // find blog by id
    const blog = await Blog.findOne({ _id: id, draft: false });
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "Blog does not exist or is a draft",
      });
    }

    // creator refers to the authenticated user (not the one creating the blog)
    const userId = req.user;

    // validation
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "Blog does not exist",
      });
    }

    // user id exists in like array -> dislike else like
    if (!blog.likedBy.includes(userId)) {
      // like blog logic
      // push user id to like array
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { $push: { likedBy: userId } },
        { new: true }
      ).populate({
        path: "creator",
        select: "name username email profilePic followers",
      });
      // Don't populate likes - just store IDs

      // user model mei bhi push karo
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { likedBlogs: id } },
        { new: true }
      )
        .select(
          "name email bio blogs followers following username password profilePic likedBlogs savedBlogs showLikedBlogs showSavedBlogs showDraftBlogs "
        )
        .populate({
          path: "blogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "likedBlogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "savedBlogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "followers following",
          select: "name username email profilePic",
        });

      // response message
      return res.status(200).json({
        success: true,
        message: "Added to your likes",
        isLiked: true,
        blog: updatedBlog,
        user: updatedUser,
      });
    } else {
      // dislike blog logic
      // pull user id from like array
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { $pull: { likedBy: userId } },
        { new: true }
      ).populate({
        path: "creator",
        select: "name username email profilePic followers",
      });
      // Don't populate likes - just store IDs

      // user se bhi pull karo
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { likedBlogs: id } },
        { new: true }
      )
        .select(
          "name email bio blogs followers following username password profilePic likedBlogs savedBlogs showLikedBlogs showSavedBlogs showDraftBlogs "
        )
        .populate({
          path: "blogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "likedBlogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "savedBlogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "followers following",
          select: "name username email profilePic",
        });

      // response message
      return res.status(200).json({
        success: true,
        message: "Removed from your likes",
        isLiked: false,
        blog: updatedBlog,
        user: updatedUser,
      });
    }
  } catch (err) {
    logger.info("Error liking blog", err);
    return res.status(500).json({
      success: false,
      message: "Error liking blog",
      error: err.message,
    });
  }
}

// mera save blog controller
async function saveBlog(req, res) {
  try {
    // blog id
    const { id } = req.params;

    // find blog by id
    const blog = await Blog.findOne({ _id: id, draft: false });
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "Blog does not exist or is a draft",
      });
    }
    const userId = req.user;

    // validation
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "Blog does not exist",
      });
    }
    // user id exists in save array -> dislike else save
    if (blog.savedBy && !blog.savedBy.includes(userId)) {
      // push user id to save array
      await Blog.findByIdAndUpdate(id, { $push: { savedBy: userId } });
      // user model mei bhi push karo
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { savedBlogs: id } },
        { new: true }
      )
        .select(
          "name email bio blogs followers following username password profilePic likedBlogs savedBlogs showLikedBlogs showSavedBlogs showDraftBlogs "
        )
        .populate({
          path: "blogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "likedBlogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "savedBlogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "followers following",
          select: "name username email profilePic",
        });

      // response message
      return res.status(200).json({
        success: true,
        message: "Blog added to Saved",
        isLiked: true,
        blog,
        user: updatedUser,
      });
    } else {
      // unsave blog logic
      // pull user id to save array
      await Blog.findByIdAndUpdate(id, { $pull: { savedBy: userId } });
      // user se bhi pull karo
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { savedBlogs: id } },
        { new: true }
      )
        .select(
          "name email bio blogs followers following username password profilePic likedBlogs savedBlogs showLikedBlogs showSavedBlogs showDraftBlogs "
        )
        .populate({
          path: "blogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "likedBlogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "savedBlogs",
          populate: {
            path: "creator",
            select: "name username profilePic",
          },
        })
        .populate({
          path: "followers following",
          select: "name username email profilePic",
        });

      // response message
      return res.status(200).json({
        success: true,
        message: "Blog removed from Saved",
        isLiked: false,
        user: updatedUser,
      });
    }
  } catch (err) {
    logger.info("Error saving blog", err);

    return res.status(500).json({
      success: false,
      message: "Error saving blog",
      error: err.message,
    });
  }
}

async function fetchSearchedBlog(req, res) {
  try {
    const { q } = req.query;
    const searchTerm = q.trim();

    const pageNo = Number(req.query.pageNo);
    const limit = Number(req.query.limit);
    const skip = (pageNo - 1) * limit;

    const blogs = await Blog.aggregate([
      // First lookup creator data
      {
        $lookup: {
          from: "users", // User collection name (usually 'users')
          localField: "creator",
          foreignField: "_id",
          as: "creatorData",
        },
      },
      { $unwind: "$creatorData" },

      // Then filter based on search term
      {
        $match: {
          $and: [
            { draft: false },
            {
              $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } },
                { tag: { $in: [new RegExp(searchTerm, "i")] } },
                { "creatorData.name": { $regex: searchTerm, $options: "i" } },
                {
                  "creatorData.username": { $regex: searchTerm, $options: "i" },
                },
              ],
            },
          ],
        },
      },

      // Rename creatorData back to creator for consistency
      {
        $addFields: {
          creator: {
            _id: "$creatorData._id",
            name: "$creatorData.name",
            username: "$creatorData.username",
            profilePic: "$creatorData.profilePic",
          },
        },
      },
      { $unset: "creatorData" }, // Remove temporary field

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Count total matching documents
    const totalBlogsAggregate = await Blog.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creatorData",
        },
      },
      { $unwind: "$creatorData" },
      {
        $match: {
          $and: [
            { draft: false },
            {
              $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } },
                { tag: { $in: [new RegExp(searchTerm, "i")] } },
                { "creatorData.name": { $regex: searchTerm, $options: "i" } },
                {
                  "creatorData.username": { $regex: searchTerm, $options: "i" },
                },
              ],
            },
          ],
        },
      },
      { $count: "total" },
    ]);

    const totalBlogs = totalBlogsAggregate[0].total || 0;
    const hasMoreBlogs = totalBlogs > skip + limit;

    return res.status(200).json({
      success: true,
      message: "Blogs loaded",
      blogs,
      blogCount: totalBlogs,
      hasMoreBlogs,
    });
  } catch (err) {
    logger.info("Error searching blog", err);

    return res.status(500).json({
      success: false,
      message: "Error searching blog",
      error: err.message,
    });
  }
}

// tag search controller
async function fetchTaggedBlog(req, res) {
  try {
    const { tagName } = req.params;

    const { exclude } = req.query;

    const pageNo = Number(req.query.pageNo);
    const limit = Number(req.query.limit);
    const skip = (pageNo - 1) * limit;

    const totalBlogs = await Blog.countDocuments(
      {
        tag: {
          $in: [tagName],
        },
        blogId: { $ne: exclude },
      },
      { draft: false }
    );

    const hasMoreBlogs = totalBlogs > skip + limit;

    const blogs = await Blog.find(
      {
        tag: {
          $in: [tagName],
        },
      },
      { draft: false }
    )
      .skip(skip)
      .limit(limit)
      .populate({
        path: "creator",
        select: "name username email profilePic followers",
      });

    if (exclude) {
      const blogs = await Blog.find(
        {
          tag: {
            $in: [tagName],
          },
          blogId: { $ne: exclude },
        },
        { draft: false }
      )
        .skip(skip)
        .limit(limit)
        .populate({
          path: "creator",
          select: "name username email profilePic followers",
        });

      return res.status(200).json({
        success: true,
        message: `Showing blogs for ${tagName}`,
        blogs,
        blogCount: totalBlogs,
        hasMoreBlogs,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Showing blogs for ${tagName}`,
      blogs,
      blogCount: totalBlogs,
      hasMoreBlogs,
    });
  } catch (err) {
    logger.info("Error searching blog", err);

    return res.status(500).json({
      success: false,
      message: "Error searching blog",
      error: err.message,
    });
  }
}

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  saveBlog,
  fetchSearchedBlog,
  fetchTaggedBlog,
};
