export function resolvePageParam(pageParam: string): number {
  let page = Number(pageParam)
  if (!Number.isFinite(page) || page < 1) {
    page = 1
  }
  return page
}

export function resolvePageInfo(pageInfo: {
  currentPage?: number
  hasNextPage?: boolean
}) {
  const currentPage = pageInfo.currentPage ?? 1
  const previousPage = currentPage > 1 ? currentPage - 1 : undefined
  const nextPage = pageInfo.hasNextPage ? currentPage + 1 : undefined
  return { currentPage, previousPage, nextPage }
}
