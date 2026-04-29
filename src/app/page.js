import { HomeHero } from '@/components/HomeHero/HomeHero'
import { HomeWhatIDo } from '@/components/HomeWhatIDo/HomeWhatIDo'
import { HomeHowIWork } from '@/components/HomeHowIWork/HomeHowIWork'
import { HomeProjects } from '@/components/HomeProjects/HomeProjects'
import { HomeScrollOrchestrator } from '@/components/HomeScrollOrchestrator/HomeScrollOrchestrator'

export default function HomePage() {
  return (
    <main>
      <HomeScrollOrchestrator />
      <HomeHero />
      <HomeWhatIDo />
      <HomeHowIWork />
      <HomeProjects />
    </main>
  )
}
