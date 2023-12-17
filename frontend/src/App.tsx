import './App.css'
import UploadText from './pages/UploadText.tsx';

function App() {

  return (
    <div className="flex flex-col items-center w-full h-full">


      <UploadText apiUrl={'www.google.com'} />
    </div>
  )
}

export default App
