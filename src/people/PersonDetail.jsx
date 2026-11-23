
import { useParams } from 'react-router';

function PersonDetail({ people = [] }) {
  const { id } = useParams();
  const person = people.find((p) => p.id === id);

  if (!person) {
    return <p role="alert">404: Person Not Found</p>;
  }

  return (
    <article>
      <h2>{person.name}</h2>

      <dl>
        <dt>Name</dt>
        <dd>{person.name}</dd>

        <dt>Role</dt>
        <dd>{person.role}</dd>

        <dt>Bio</dt>
        <dd>{person.bio}</dd>
      </dl>
    </article>
  );
}

export default PersonDetail;
