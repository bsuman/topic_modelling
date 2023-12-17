import './App.css'
import UploadText from './pages/UploadText.tsx';

function App() {

  return (
    <div className="flex flex-col items-center w-full h-full">


      <UploadText apiUrl={'http://localhost:5000/analyze'} />
    </div>
  )
}

export default App
