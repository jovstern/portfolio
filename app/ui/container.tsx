import clsx from 'clsx'

type ContainerProps = {
  as?: 'div' | 'section' | 'article' | 'header' | 'nav'
  className?: string
  children: React.ReactNode
}

/** The page column: 72rem wide at most, with the 20 / 32 / 40 px gutters of spec §6. */
export default function Container({ as: Element = 'div', className, children }: ContainerProps) {
  return (
    <Element className={clsx('mx-auto max-w-page px-5 md:px-8 lg:px-10', className)}>
      {children}
    </Element>
  )
}
