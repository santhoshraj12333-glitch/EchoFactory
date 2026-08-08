export default function PagePlaceholder({ title, description }) {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center justify-center py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-brand-text">{title}</h1>
      <p className="mt-3 max-w-md text-brand-muted">{description}</p>
    </section>
  )
}