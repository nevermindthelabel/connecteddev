import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import { deleteComment } from '../../actions/post';

const CommentItem = ({ comment: { text, avatar, date, name, user, _id }, postId, auth, deleteComment }) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt="user avatar" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on <Moment format="YYYY/MM/DD">{moment.utc(date)}</Moment>
        </p>
        {!auth.loading && user === auth.user._id && (
          <button onClick={() => deleteComment(postId, _id) } className='btn btn-danger' type='button' >
            <i className="fas fa-times" />
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  // postId: PropTypes.number.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment }
)(CommentItem);