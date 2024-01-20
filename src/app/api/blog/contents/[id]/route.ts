import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: number } },
): Promise<NextResponse> {
  const { id } = context.params;

  const response = await fetch(
    `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/blog/${id}/`,
  );
  const post: { updated_at: string; content: string; [key: string]: any } =
    await response.json();

  const { updated_at, ...rest } = post;

  const date = new Date(updated_at);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const contents = {
    id: id.toString(),
    date: updated_at,
    ...rest,
  };

  // If user exists, return user
  return NextResponse.json(contents, { status: 200 });
}
