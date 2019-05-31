import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';

const ProfileExp = ({ experience: { title, company, from, to, current, description } }) => {
  return (
    <div>
      <h3 className="text-dark">{company}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{moment.utc(from)}</Moment> -{' '}
        {current ? 'Now' : <Moment format="YYYY/MM/DD">{moment.utc(to)}</Moment>}
      </p>
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

ProfileExp.propTypes = {
  experience: PropTypes.object.isRequired
};

export default ProfileExp;
