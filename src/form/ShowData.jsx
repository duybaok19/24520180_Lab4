import { Fragment } from 'react';

function ShowData({ data }) {
  return (
    <dl>
      {Object.entries(data).map(([k, v]) => (
        <Fragment key={k}>
          <dt>{k}</dt>
          <dd>{String(v)}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

export default ShowData;