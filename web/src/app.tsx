import Goal from '@/goal.ts'
import CreateGoal from '@components/create-goal.tsx'
import EmptyGoals from '@components/empty-goals.tsx'
import Summary from '@components/summary.tsx'
import { useQuery } from '@tanstack/react-query'
import { Dialog } from '@ui/dialog.tsx'
import { useState } from 'react'

function App() {
  const [openCreateGoal, setOpenCreateGoal] = useState(false)
  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: new Goal().summary,
    staleTime: 1000 * 60, // 1 minute
  })

  return (
    <Dialog open={openCreateGoal} onOpenChange={setOpenCreateGoal}>
      {summary && summary.total > 0 ? (
        <Summary summary={summary} />
      ) : (
        <EmptyGoals />
      )}

      <CreateGoal setOpenCreateGoal={setOpenCreateGoal} />
    </Dialog>
  )
}

export default App
