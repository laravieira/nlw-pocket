import LetsStartDraw from '@assets/lets-start.svg'
import InOrbitLogo from '@assets/logo-in-orbit.svg'
import { Button } from '@ui/button.tsx'
import { DialogTrigger } from '@ui/dialog.tsx'
import { Plus } from 'lucide-react'

function EmptyGoals() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <InOrbitLogo className="h-9" />
      <LetsStartDraw className="size-80" />
      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        Você ainda não cadastrou nenhuma meta, que tal <u>cadastrar um</u> agora
        mesmo?
      </p>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Cadastrar meta
        </Button>
      </DialogTrigger>
    </div>
  )
}

export default EmptyGoals
