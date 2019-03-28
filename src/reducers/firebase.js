import { SET_USER } from "../actions/firebase.js";

const firebase = (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
};

export default firebase;
