// "use client"

// import { Button } from "./ui/button"
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
// import { auth } from "../lib/firebase"
// import { useSession } from "../hooks/useSession"

// const SignInButton = () => {
//   const { loading } = useSession()

//   if (loading) return <p>Loading...</p>

//   const signIn = async () => {
//     const provider = new GoogleAuthProvider()
//     await signInWithPopup(auth, provider)
//   }

//   return <Button onClick={signIn}>Sign in with Google</Button>
// }

// export default SignInButton
