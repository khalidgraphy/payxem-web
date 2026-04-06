const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/llms.txt");

  // Blog collection
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Filters
  eleventyConfig.addFilter("dateFormat", function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("isoDate", function (date) {
    return new Date(date).toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  eleventyConfig.addFilter("excerpt", function (content) {
    const text = (content || "").replace(/<[^>]+>/g, "");
    return text.substring(0, 160) + (text.length > 160 ? "..." : "");
  });

  // Markdown config
  const md = markdownIt({ html: true, linkify: true, typographer: true });
  eleventyConfig.setLibrary("md", md);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
