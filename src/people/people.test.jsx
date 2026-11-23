
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';

import { PEOPLE } from '../data/people';
import PeopleLayout from './PeopleLayout';
import PersonDetail from './PersonDetail';
import NotFound from './NotFound';

function renderAtRoute(initialPath) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/people" element={<PeopleLayout people={PEOPLE} />}>
          <Route
            index
            element={<p>Chọn một người ở danh sách bên trái.</p>}
          />
          <Route
            path=":id"
            element={<PersonDetail people={PEOPLE} />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Exercise 1 - People Router', () => {
  it('renders all five people links and the selection message at /people', () => {
    renderAtRoute('/people');

    PEOPLE.forEach((person) => {
      expect(
        screen.getByRole('link', { name: person.name })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText('Chọn một người ở danh sách bên trái.')
    ).toBeInTheDocument();

    expect(screen.getAllByRole('link')).toHaveLength(5);
  });

  it('marks the selected person link as active and renders their details', () => {
    renderAtRoute('/people/p-2');

    const selectedPerson = PEOPLE.find(
      (person) => person.id === 'p-2'
    );

    const selectedLink = screen.getByRole('link', {
      name: selectedPerson.name,
    });

    expect(selectedLink).toHaveClass('active-link');

    const links = screen.getAllByRole('link');

    links
      .filter((link) => link !== selectedLink)
      .forEach((link) => {
        expect(link).not.toHaveClass('active-link');
      });

    const main = screen.getByRole('main');
    const definitionList = main.querySelector('dl');

    expect(definitionList).toBeInTheDocument();

    expect(
      within(definitionList).getByText('Name', { selector: 'dt' })
    ).toBeInTheDocument();

    expect(
      within(definitionList).getByText('Role', { selector: 'dt' })
    ).toBeInTheDocument();

    expect(
      within(definitionList).getByText(selectedPerson.name, {
        selector: 'dd',
      })
    ).toBeInTheDocument();

    expect(
      within(definitionList).getByText(selectedPerson.role, {
        selector: 'dd',
      })
    ).toBeInTheDocument();
  });

  it('renders a 404 alert when the person ID does not exist', () => {
    renderAtRoute('/people/khong-co');

    expect(screen.getByRole('alert')).toHaveTextContent('404');
  });

  it('renders NotFound for an unknown route', () => {
    renderAtRoute('/duong-dan-la');

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
