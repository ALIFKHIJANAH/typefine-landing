import { motion } from 'motion/react'
import { Apple, ShieldCheck } from 'lucide-react'
import { EASE } from '../lib/motion'
import { DemoButton, DownloadButton } from './ui'
import { ProductStage } from './ProductStage'

const rise = (delay) => ({
  initial: { opacity: 0, y: 28, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.8, ease: EASE, delay },
})

export function Hero() {
  return (
    <section className="container-page flex flex-col gap-8 pt-10 md:gap-10 md:pt-[72px]">
      <motion.p
        {...rise(0.05)}
        className="hairline flex w-fit items-center gap-2.5 rounded-full bg-surface py-[5px] pr-3.5 pl-[5px]"
      >
        <span className="hairline flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[13px] font-semibold text-ink">
          <Apple className="size-3" aria-hidden />
          macOS
        </span>
        <span className="text-[13px] text-muted sm:text-sm">For anyone who writes in English all day</span>
      </motion.p>

      <h1 className="text-[clamp(2.75rem,7.4vw,5.75rem)] leading-[1.02] font-semibold tracking-[-0.043em] text-balance">
        <motion.span {...rise(0.12)} className="block text-ink">
          Better English,
        </motion.span>
        <motion.span {...rise(0.2)} className="block text-subtle">
          without switching apps.
        </motion.span>
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <motion.p {...rise(0.3)} className="max-w-[520px] text-[17px] leading-[27px] text-muted md:text-[19px] md:leading-[29px]">
          Select a sentence you’re not sure about and press ⌥E. Typefine rewrites it in plain, natural English, and
          you decide whether to use it.
        </motion.p>

        <motion.div {...rise(0.38)} className="flex flex-col gap-4 lg:items-end">
          <div className="flex flex-wrap gap-3">
            <DownloadButton />
            <DemoButton />
          </div>
          <p className="flex items-center gap-2 text-sm text-muted">
            <ShieldCheck className="size-[15px]" aria-hidden />
            Nothing is sent until you press ⌥E.
          </p>
        </motion.div>
      </div>

      <ProductStage />
    </section>
  )
}
