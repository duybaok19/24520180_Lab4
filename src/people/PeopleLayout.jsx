
import { NavLink, Outlet } from 'react-router';

function PeopleLayout({ people = [] }) {
  return (
    <section className="people-frame">
      <nav aria-label="People">
        <ul>
          {people.map((person) => (
            <li key={person.id}>
              <NavLink
                to={`/people/${person.id}`}
                className={({ isActive }) =>
                  isActive ? 'active-link' : 'link'
                }
              >
                {person.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </section>
  );
}

export default PeopleLayout;
