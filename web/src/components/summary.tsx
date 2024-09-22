import InOrbitLogo from '@assets/logo-in-orbit.svg'
import { Button } from '@ui/button.tsx'
import { DialogTrigger } from '@ui/dialog.tsx'
import { OutlineButton } from '@ui/outline-button.tsx'
import { Progress, ProgressIndicator } from '@ui/progress-bar.tsx'
import { Separator } from '@ui/separator.tsx'
import { CheckCircle2, Plus } from 'lucide-react'

function Summary() {
  function renderEmpty() {
    return (
      <p className="text-sm text-zinc-400">
        Você ainda não completou nenhuma meta essa semana.
      </p>
    )
  }

  function renderHeader() {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitLogo className="h-6" />
          <span className="text-lg font-semibold">5 a 10 de agosto</span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>
    )
  }

  function renderProgressBar() {
    return (
      <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
          <ProgressIndicator style={{ width: '50%' }} />
        </Progress>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou <span className="text-zinc-100">8</span> de{' '}
            <span className="text-zinc-100">15</span> metas nessa semana.
          </span>
          <span>50%</span>
        </div>
      </div>
    )
  }

  function renderPendingGoals() {
    return (
      <div className="flex flex-wrap gap-3">
        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Meditar
        </OutlineButton>
        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Nadar
        </OutlineButton>
        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Praticar exercício
        </OutlineButton>
        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Ouvir música
        </OutlineButton>
      </div>
    )
  }

  function renderDayCompletedGoal() {
    return (
      <li className="flex items-center gap-2">
        <CheckCircle2 className="size-4 text-pink-500" />
        <span className="text-sm text-zinc-400">
          Você completou "<span className="text-zinc-100">Acordar cedo</span>"
          às <span className="text-zinc-100">06h00</span>.
        </span>
        <button
          type="button"
          className="underline hover:no-underline text-zinc-500 text-sm"
        >
          Desfazer
        </button>
      </li>
    )
  }

  function renderDaySummary() {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-medium">
          Domingo <span className="text-zinc-400 text-xs">(10 de Agosto)</span>
        </h3>

        <ul className="flex flex-col gap-3">{renderDayCompletedGoal()}</ul>
      </div>
    )
  }

  function renderWeekSummary() {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {/*{renderEmpty()}*/}
        {renderDaySummary()}
      </div>
    )
  }

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      {renderHeader()}
      {renderProgressBar()}
      <Separator />
      {renderPendingGoals()}
      {renderWeekSummary()}
    </div>
  )
}

export default Summary
