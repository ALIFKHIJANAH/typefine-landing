import { CircleDot, Code, Compass, Globe, Mail, MessageCircle, NotebookPen, Send } from 'lucide-react'
import { Item, Stagger } from './ui'

const APPS = [
  { name: 'Slack', Icon: MessageCircle },
  { name: 'Gmail', Icon: Mail },
  { name: 'Notion', Icon: NotebookPen },
  { name: 'Linear', Icon: CircleDot },
  { name: 'VS Code', Icon: Code },
  { name: 'Chrome', Icon: Globe },
  { name: 'Safari', Icon: Compass },
  { name: 'Telegram', Icon: Send },
]

export function AppStrip() {
  return (
    <section className="container-page flex flex-col gap-8 pt-14 lg:flex-row lg:items-center lg:gap-16 lg:pt-16">
      <div className="flex shrink-0 flex-col gap-1.5 lg:w-[250px]">
        <h2 className="text-base font-semibold text-ink">Works in the apps you use</h2>
        <p className="text-sm leading-5 text-muted">Plus any other app whose text fields support macOS Accessibility.</p>
      </div>

      <Stagger
        as="ul"
        gap={0.05}
        className="grid flex-1 grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 xl:flex xl:items-center xl:justify-between"
      >
        {APPS.map(({ name, Icon }) => (
          <Item as="li" key={name} className="flex items-center gap-2 text-subtle">
            <Icon className="size-[18px]" aria-hidden />
            <span className="text-[17px] font-semibold tracking-[-0.3px]">{name}</span>
          </Item>
        ))}
      </Stagger>
    </section>
  )
}
