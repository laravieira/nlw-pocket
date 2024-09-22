import Goal from '@/goal.ts'
import type { Summary as SummaryType } from '@/goal.ts'
import InOrbitLogo from '@assets/logo.svg'
import PendingGoals from '@components/pending-goals.tsx'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@ui/button.tsx'
import { DialogTrigger } from '@ui/dialog.tsx'
import { Progress, ProgressIndicator } from '@ui/progress-bar.tsx'
import { Separator } from '@ui/separator.tsx'
import dayjs from 'dayjs'
import ptbr from 'dayjs/locale/pt-BR'
import { CheckCircle2, Plus } from 'lucide-react'

dayjs.locale(ptbr)

type SummaryProps = {
  summary: SummaryType
}

function Summary({ summary }: SummaryProps) {
  const queryClient = useQueryClient()

  async function onUndoCompletion(id: string) {
    await new Goal().uncomplete(id).catch(console.error)
    await queryClient.invalidateQueries({ queryKey: ['summary'] })
    await queryClient.invalidateQueries({ queryKey: ['goals'] })
  }

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
          <span className="text-lg font-semibold capitalize">
            {dayjs().startOf('week').format('D MMM')} -{' '}
            {dayjs().startOf('week').format('D MMM')}
          </span>
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
    const percentage = Math.round((summary.completed / summary.total) * 100)

    return (
      <div className="flex flex-col gap-3">
        <Progress value={summary.completed} max={summary.total}>
          <ProgressIndicator style={{ width: `${percentage}%` }} />
        </Progress>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{summary.completed}</span> de{' '}
            <span className="text-zinc-100">{summary.total}</span> metas nessa
            semana.
          </span>
          <span>{percentage}%</span>
        </div>
      </div>
    )
  }

  function renderDayCompletedGoal(goal: {
    id: string
    title: string
    completion: string
    completedAt: string
  }) {
    const { id, title, completion, completedAt: time } = goal
    return (
      <li key={id} className="flex items-center gap-2">
        <CheckCircle2 className="size-4 text-pink-500" />
        <span className="text-sm text-zinc-400">
          Você completou "<span className="text-zinc-100">{title}</span>" às{' '}
          <span className="text-zinc-100">{dayjs(time).format('HH[h]mm')}</span>
          .
        </span>
        <button
          type="button"
          className="underline hover:no-underline text-zinc-500 text-sm"
          onClick={() => onUndoCompletion(completion)}
        >
          Desfazer
        </button>
      </li>
    )
  }

  function renderDaySummary([day, goals]: [
    string,
    { id: string; title: string; completion: string; completedAt: string }[],
  ]) {
    return (
      <div key={day} className="flex flex-col gap-4">
        <h3 className="font-medium capitalize">
          {dayjs(day).format('dddd')}{' '}
          <span className="text-zinc-400 text-xs normal-case">
            ({dayjs(day).format('D[ de ]MMMM')})
          </span>
        </h3>

        <ul className="flex flex-col gap-3">
          {goals.map(renderDayCompletedGoal)}
        </ul>
      </div>
    )
  }

  function renderWeekSummary() {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {summary.goalsPerDay
          ? Object.entries(summary.goalsPerDay).map(renderDaySummary)
          : renderEmpty()}
      </div>
    )
  }

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      {renderHeader()}
      {renderProgressBar()}
      <Separator />
      <PendingGoals />
      {renderWeekSummary()}
    </div>
  )
}

export default Summary
