import axios from 'axios'
import { GetServerSideProps } from 'next'
import Image from 'next/image'

import styles from '../styles/index.module.css'

interface Props {
  posts: Array<object>
}

const Home = ({ posts }: Props) => {
  return (
    <div>
      <main className={styles.main}>
        {posts.map((post: any) => (
          <div key={post.id} className={styles.item}>
            <a href={post.url} target="_blank" rel="noreferrer">
              <Image
                src={post.image.url}
                width={post.image.width}
                height={post.image.height}
                alt=""
              />
            </a>
          </div>
        ))}
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const requests = ['0x001a', '0x002b', '0x001e', '0x003d'].map(blogName => {
      return [0, 20, 40, 60, 80, 100, 120, 140].map(offset => {
        return axios(
          `https://api.tumblr.com/v2/blog/${blogName}.tumblr.com/posts?api_key=${process.env.TUMBLR_API_KEY}&npf=true&offset=${offset}`
        )
      })
    })

    const responses = await Promise.all(requests.flat())
    const tumblrs = responses.map(response => response.data.response)

    let rawPosts: any[] = []
    for (const tumblr of tumblrs) {
      rawPosts = [...rawPosts, ...tumblr.posts]
    }

    const posts = rawPosts
      .filter(post => post.content.length > 0 || post.trail.length > 0)
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .map(post => {
        const content =
          post.content.length > 0 ? post.content : post.trail[0]?.content

        const images = content.find((item: any) => item.type === 'image')
        const image = images.media.find(
          (i: any) => i.width >= 500 && i.width <= 800
        )

        return {
          id: post.id,
          image,
          url: post.post_url
        }
      })
      .filter(post => post.image)

    return { props: { posts } }
  } catch (error: any) {
    // Let the page 500
    throw new Error(error)
  }
}

export default Home
