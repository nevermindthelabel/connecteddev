import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';

const ProfileEdu = ({ education: { school, degree, fieldofstudy, from, to, current, description } }) => {
  return (
    <div>
      <h3>{school}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{moment.utc(from)}</Moment> -{' '}
        {current ? 'Now' : <Moment format="YYYY/MM/DD">{moment.utc(to)}</Moment>}
      </p>
      <p>
        <strong>Degree: </strong>{degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>{fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>{description}
      </p>
    </div>
  );
}

ProfileEdu.propTypes = {
  education: PropTypes.object.isRequired
}

export default ProfileEdu;
