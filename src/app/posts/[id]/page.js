import utilStyles from "@/styles/utils.module.css";
import Navigation from "@/_components/Navigation";
import Date from "@/_components/date";
import Markdown from "@/_components/Markdown";

const fetchData = async (host, id) => {
  console.log(id);
  console.log("url", `http://${host}/api/blog/contents/${id}`);
  const res = await fetch(`http://${host}/api/blog/contents/${id}`, {
    cache: "no-store",
  });
  const now = await res.json();
  return now;
};

export default async function Page({ params }) {
  const id = params.id;
  const host = `${process.env.APPLICATION_HOST}:${process.env.APPLICATION_PORT}`;
  const data = await fetchData(host, id);

  return (
    <div>
      <Navigation />

      <article>
        <h1 className={utilStyles.headingXl}>{data.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={data.date} />
        </div>
        <div>
          <Markdown content={data.content} />
        </div>
      </article>
    </div>
  );
}
