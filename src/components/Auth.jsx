import React, { useState } from "react";
import { auth, googlePrivider } from "../config/firbase-config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { async } from "@firebase/util";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log(auth?.currentUser?.email);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {}
  };
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googlePrivider);
    } catch {}
  };
  return (
    <div>
      <input
        placeholder="user Name"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type={"password"}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>Sign In</button>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  );
}
