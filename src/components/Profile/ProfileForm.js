import { useRef } from "react";
import classes from "./ProfileForm.module.css";
import { APIKey } from "../../apiKey";
import { useContext } from "react";
import { AuthContext } from "../../store/auth-context";
import { useHistory } from "react-router-dom";

const ProfileForm = () => {
  const changePasswordRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();
    const currentChangedPassword = changePasswordRef.current.value;
    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${APIKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: currentChangedPassword,
          returnSecureToken: false,
        }),
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => {
      history.replace("/");
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={changePasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
