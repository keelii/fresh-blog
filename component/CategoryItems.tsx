import { MetaInfo } from "../utils/post.ts";

export function CategoryItems(props: { post: MetaInfo }) {
  const { post } = props;

  if (!post.categories || post.categories.length === 0) {
    return <></>;
  }

  return (
    <span class="categories">
      {post.categories.map((c, idx) => (
        idx === 0 ? <a href={`/categories/${c}`}>{c}</a> : (
          <> <em>·</em> <a href={`/categories/${c}`}>{c}</a></>
        )
      ))}
    </span>
  );
}
