import BusinessDetailsClient from './client'

export default async function BusinessDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <BusinessDetailsClient slug={slug} />
}
