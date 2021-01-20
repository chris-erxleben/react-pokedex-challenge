import { QueryClient, QueryClientProvider } from 'react-query'
import { List } from './List'
import { Detail } from './Detail'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route exact path="/" component={List} />
          <Route path="/:num" component={Detail} />
        </Switch>
      </Router>
    </QueryClientProvider>
  )
}

export default App
