import requestService from './request'
export const fetchBlog = (
  filter = {}
) => {
  filter.key = '435bc42a56f46c4710bba1f736'
  filter.include = 'tags,authors,meta'
  const newUrl = 'https://m.services/ghost/api/v2/content/posts/'
  return requestService.send({
    method: 'get',
    query: { ...filter },
    newUrl
  })
}

export const fetchTags = (
  filter = {}
) => {
  filter.key = '435bc42a56f46c4710bba1f736'
  filter.include = 'count.posts'
  const newUrl = 'https://m.services/ghost/api/v2/content/tags/'
  return requestService.send({
    method: 'get',
    query: { ...filter },
    newUrl
  })
}

export const viewBlog = (id) => {
  const filter = { key: '435bc42a56f46c4710bba1f736', include: 'tags,authors' }
  const newUrl = `https://m.services/ghost/api/v2/content/posts/${id}`
  return requestService.send({
    method: 'get',
    newUrl,
    query: filter
  })
}

export default {
  fetchBlog,
  viewBlog,
  fetchTags
}