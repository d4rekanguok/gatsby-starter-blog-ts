import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

// import { BlogIndexQuery } from '../graphqlTypes'

interface IBlogIndexProps {
  // uncomment this when type is generated
  // data: BlogIndexQuery;
  data: any;
  location: Location;
}

class BlogIndex extends React.Component<IBlogIndexProps> {
  render() {
    const { data, location } = this.props
    if (
      !data || 
      !data.site || 
      !data.site.siteMetadata ||
      !data.site.siteMetadata.title || 
      !data.allMarkdownRemark
    ) throw new Error('no data')
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        {posts.map(({ node }) => {
          if (
            !node.frontmatter ||
            !node.excerpt ||
            !node.fields ||
            !node.fields.slug
          ) throw new Error('missing data')

          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query BlogIndex {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
