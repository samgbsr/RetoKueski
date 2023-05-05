import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './index.js'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user/:id" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
