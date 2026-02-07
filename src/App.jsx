
import { DataProvider } from './context/DataContext';
import MapViewer from './components/MapViewer';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <DataProvider>
      <div className="flex w-screen h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
        <Sidebar />
        <MapViewer />
      </div>
    </DataProvider>
  );
}

export default App;
