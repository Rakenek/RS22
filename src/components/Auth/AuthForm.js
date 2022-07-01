import { useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { APIKey } from "../../apiKey";
import { AuthContext } from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const passwordRef = useRef();
  const emailRef = useRef();

  const authCtx = useContext(AuthContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const enteredPassword = passwordRef.current.value;
    const enteredEmail = emailRef.current.value;

    const loginOrRegister = async (url) => {
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setIsLoading(false);

        if (response.ok) {
          const expirationTime = new Date(
            new Date(new Date().getTime() + (0 + data.expiresIn) * 1000)
          );
          authCtx.login(data.idToken, expirationTime.toISOString());
          console.log(data);
          history.replace("/");
        } else if (data && data.error && data.error.message) {
          alert(data.error.message);
          throw new Error(data.error.message);
        }
      } catch (e) {
        console.error(e.message);
      }
    };
    setIsLoading(true);
    if (isLogin) {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKey}`;
      await loginOrRegister(url);
    } else {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKey}`;
      await loginOrRegister(url);
    }
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={onSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input ref={passwordRef} type="password" id="password" required />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Loading...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
