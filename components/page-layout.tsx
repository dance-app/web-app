import { ReactNode } from 'react'

export const PageLayout = ({ header, children }: {
  header: ReactNode
  children: ReactNode
}) => {
  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        {header}
      </header>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        {children}
      </div>
    </div>
  )
}
