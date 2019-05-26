import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile';

const AddEducation = ({ history, addEducation }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  const { school, degree, fieldofstudy, from, to, current, description } = formData;

  const onChange = event => setFormData({ ...formData, [event.target.name]: event.target.value });

  return (
    <Fragment>
      <h1 className="large text-primary">Add Your Education</h1>
      <p className="lead">
        <i className="fas fa-graduation-cap" /> Add any school, bootcamp, etc that you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={event => {
        event.preventDefault();
        addEducation(formData, history)
      }} >
        <div className="form-group">
          <input type="text" placeholder="* School or Bootcamp" name="school" value={school} onChange={event => onChange(event)} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Degree or Certificate" name="degree" value={degree} onChange={event => onChange(event)} required/>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Field Of Study" name="fieldofstudy" value={fieldofstudy} onChange={event => onChange(event)} />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={event => onChange(event)} />
        </div>
        <div className="form-group">
          <p>
            <input type="checkbox" name="current" value={current} checked={current} onChange={() => {
              setFormData({ ...formData, current: !current});
              toggleDisabled(!toDateDisabled);
            }} />{' '} Current School or Bootcamp
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={event => onChange(event)} disabled={toDateDisabled ? 'disabled' : '' } />
        </div>
        <div className="form-group">
          <textarea name="description" cols="30" rows="5" placeholder="Program Description" value={description} onChange={event => onChange(event)} />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
};

export default connect(null, { addEducation })(withRouter(AddEducation));
