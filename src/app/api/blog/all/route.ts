import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const response = await fetch(
    `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/blog/`,
  );

  const posts = await response.json();

  // Update the property name from "update_at" to "date"
  const allPostsData = posts.map((post: Post) => {
    const { updated_at, id, ...rest } = post; // Remove the "updated_at" property
    const date = new Date(updated_at);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return {
      ...rest,
      id: id.toString(),
      date: updated_at,
    };
  });

  // Sort posts by date
  const contents = allPostsData.sort((a: PostData, b: PostData) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  return NextResponse.json(contents, { status: 200 });
}

interface Post {
  id: number;
  updated_at: string;
  [key: string]: any;
}

interface PostData {
  id: string;
  date: string;
}

interface PostId {
  params: {
    id: string;
  };
}

interface PostData {
  id: string;
  contentHtml: string;
  [key: string]: any;
}

export async function getAllPostIds(): Promise<PostId[]> {
  const res = await fetch("http://localhost:8000/blog/");
  const posts = await res.json();

  return posts.map((post: Post) => {
    return {
      params: {
        id: post.id.toString(),
      },
    };
  });
}
