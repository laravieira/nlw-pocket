import Goal from '@/goal.ts'
import CreateGoal from '@components/create-goal.tsx'
import EmptyGoals from '@components/empty-goals.tsx'
import Summary from '@components/summary.tsx'
import { useQuery } from '@tanstack/react-query'
import { Dialog } from '@ui/dialog.tsx'

function App() {
  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: new Goal().summary,
    staleTime: 1000 * 60, // 1 minute
  })

  return (
    <Dialog>
      {summary && summary.total > 0 ? (
        <Summary summary={summary} />
      ) : (
        <EmptyGoals />
      )}

      <CreateGoal />
    </Dialog>
  )
}

export default App
