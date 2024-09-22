import Goal from '@/goal.ts'
import type { GoalType } from '@/goal.ts'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { OutlineButton } from '@ui/outline-button.tsx'
import { Plus } from 'lucide-react'

function PendingGoals() {
  const queryClient = useQueryClient()
  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: () => new Goal().goals(),
    staleTime: 1000 * 60, // 1 minute
  })

  async function onCompleteGoal(id: string) {
    await new Goal().complete(id).catch(console.error)
    await queryClient.invalidateQueries({ queryKey: ['summary'] })
    await queryClient.invalidateQueries({ queryKey: ['goals'] })
  }

  function renderEmpty() {
    return <p className="text-sm text-zinc-400">Sem metas pendentes.</p>
  }

  function renderGoal(goal: GoalType) {
    const {
      id,
      title,
      completionCount: count,
      desiredWeeklyFrequency: desire,
    } = goal
    return (
      <OutlineButton
        key={id}
        disabled={count >= desire}
        onClick={() => onCompleteGoal(id)}
      >
        <Plus className="size-4 text-zinc-600" />
        {title}
      </OutlineButton>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
      {goals && goals.length > 0 ? goals.map(renderGoal) : renderEmpty()}
    </div>
  )
}

export default PendingGoals
