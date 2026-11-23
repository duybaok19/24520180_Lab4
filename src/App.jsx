
import { Routes, Route, Navigate } from 'react-router';

import { PEOPLE } from './data/people';
import PeopleLayout from './people/PeopleLayout';
import NotFound from './people/NotFound';

import './people/people.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/people" replace />} />

      <Route path="/people" element={<PeopleLayout people={PEOPLE} />}>
        <Route
          index
          element={<p>Chọn một người ở danh sách bên trái.</p>}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

