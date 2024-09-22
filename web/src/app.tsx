import CreateGoal from '@components/create-goal.tsx'
import EmptyGoals from '@components/empty-goals.tsx'
import Summary from '@components/summary.tsx'
import { Dialog } from '@ui/dialog.tsx'

function App() {
  return (
    <Dialog>
      {/*<EmptyGoals />*/}
      <Summary />
      <CreateGoal />
    </Dialog>
  )
}

export default App
