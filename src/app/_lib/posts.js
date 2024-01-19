import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export async function getSortedPostsData() {
  // Get Posts from
  // http://blog-server:8000/blog/
  const response = await fetch("http://blog-server:8000/blog/");
  const posts = await response.json();

  // Update the property name from "update_at" to "date"
  const allPostsData = posts.map((post) => {
    const { updated_at, id, ...rest } = post; // Remove the "updated_at" property
    const date = new Date(updated_at);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return {
      ...rest,
      id: id.toString(),
      date: formattedDate,
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getAllPostIds() {
  const res = await fetch("http://localhost:8000/blog/");
  const posts = await res.json();

  return posts.map((post) => {
    return {
      params: {
        id: post.id.toString(),
      },
    };
  });
}

export async function getPostData(id) {
  // Get Posts from
  // http://blog-server:8000/blog/{id}
  const response = await fetch(`http://localhost:8000/blog/${id}`);
  const post = await response.json();

  const { updated_at, content, ...rest } = post;

  // Use remark to convert markdown into HTML string
  const contentHtml0 = await remark()
    .use(html)
    .process(post.content)
    .toString();

  // Combine the data with the id and contentHtml
  console.log("getPostData");
  console.log({
    id: id.toString(),
    contentHtml,
    date: updated_at,
    ...rest,
  });

  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

// import fs from "fs";
// import path from "path";
// import matter from "gray-matter";
// import { remark } from "remark";
// import html from "remark-html";

// export async function getSortedPostsData() {
//   // Get Posts from
//   // http://blog-server:8000/docs#/blog/read_blogs_blog__get
//   const response = await fetch("http://localhost:8000/blog/");
//   const posts = await response.json();
//   console.log("posts");
//   console.log(posts);

//   // Update the property name from "update_at" to "date"
//   const sortedPosts = posts.map((post) => {
//     return {
//       ...post,
//       date: post.update_at,
//     };
//   });

//   // Sort posts by date
//   return sortedPosts.sort((a, b) => {
//     if (a.date < b.date) {
//       return 1;
//     } else {
//       return -1;
//     }
//   });
// }

// export async function getAllPostIds() {
//   const res = await fetch("http://blog-server:8000/blog");
//   const posts = await res.json();

//   const fileNames = fs.readdirSync(postsDirectory);
//   return fileNames.map((fileName) => {
//     return {
//       params: {
//         id: fileName.replace(/\.md$/, ""),
//       },
//     };
//   });
// }

// export async function getPostData(id) {
//   const fullPath = path.join(postsDirectory, `${id}.md`);
//   const fileContents = fs.readFileSync(fullPath, "utf8");

//   // Use gray-matter to parse the post metadata section
//   const matterResult = matter(fileContents);

//   // Use remark to convert markdown into HTML string
//   const processedContent = await remark()
//     .use(html)
//     .process(matterResult.content);
//   const contentHtml = processedContent.toString();

//   // Combine the data with the id and contentHtml
//   return {
//     id,
//     contentHtml,
//     ...matterResult.data,
//   };
// }
