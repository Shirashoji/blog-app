import Head from "next/head";
import utilStyles from "@/styles/utils.module.css";
import Navigation from "@/_components/Navigation";
import Date from "@/_components/date";
import { getSortedPostsData } from "../_lib/posts";
import Link from "next/link";

const fetchData = async (host) => {
  const res = await fetch(`http://${host}/api/blog/all`, { cache: "no-store" });
  const now = await res.json();
  return now;
};

export default async function Page({ params }) {
  const host = `${process.env.APPLICATION_HOST}:${process.env.APPLICATION_PORT}`;
  const data = await fetchData(host);

  return (
    <div>
      <Navigation />

      <section className={utilStyles.headingMd}>
        <p>Blog App</p>
        <p>(APIを使って自由にブログを書くことができます．)</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog一覧</h2>
        <ul className={utilStyles.list}>
          {data.map(({ id, title, date }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
