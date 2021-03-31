import './App.css';
import TrendingCoins from './components/TrendingCoins';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ReactNotification></ReactNotification>
        <TrendingCoins></TrendingCoins>
      </header>
    </div>
  );
}

export default App;
