const domain = import.meta.env.WP_DOMAIN_DEV
const apiUrl = `${domain}/wp-json/wp/v2`

export const getPostInfo = async ( slug: string) => {
  const response = await fetch(`${apiUrl}/posts?slug=${slug}`);

  if (!response.ok) throw new Error('Failed to fetch data');
  const [data] = await response.json();
  const {
    title: { rendered: title },
    excerpt: { rendered: excerpt },
    content: { rendered: content },
    date,
    author, 
  } = data;

  return {title, excerpt, content, date, author};
}

export const getAllPostsSlugs = async () => {
  const response = await fetch(`${apiUrl}/posts?per_page=100`);
  if (!response.ok) throw new Error('Failed to fetch data');
  const data = await response.json();
  const slugs = data.map((post: { slug: string }) => post.slug);
  return slugs;
}

export const getLatesPost = async ({perPage = 10 }: {perPage?: number}) => {
  const response = await fetch(`${apiUrl}/posts?per_page=${perPage}&_embed`);
  if (!response.ok) throw new Error('Failed to fetch data');

  const data = await response.json();
  console.log("data", data);
  if (data.length === 0) throw new Error('Post not found');

  const posts = data.map((post: { title?: any; excerpt?: any; content?: any; _embedded?: any; date?: any; slug?: any; }) => {
    // const { 
    //   title : {rendered: title},
    //   excerpt: {rendered: excerpt}, 
    //   content: {rendered: content}, 
    //   date,
    //   author,
    //   slug, 
    // } = post;
    
    const title = post.title.rendered;
    const excerpt = post.excerpt.rendered;
    const content = post.content.rendered;
    const {date, slug} = post;
    const author = post._embedded.author[0].name;
    const featured_media = post._embedded['wp:featuredmedia'] ? post._embedded['wp:featuredmedia'][0].source_url : null;

    return { title, excerpt, content, date, author, slug,featured_media };
  })
  return posts;
}
