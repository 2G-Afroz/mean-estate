import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

export default function OAuth() {
	const nevigate = useNavigate();
	const dispatch = useDispatch();
	const handleGoogleClick = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);
			const result = await signInWithPopup(auth, provider);

			const res = await fetch("/api/auth/google", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
			});
			const resData = await res.json();
			dispatch(signInSuccess(resData));
			nevigate("/");
		}
		catch(err) {
			console.error(err);
		}
	}

	return (
		<button type="button" onClick={handleGoogleClick} className='bg-red-700 p-3 rounded-lg text-white hover:opacity-95'>Continue with Google</button>
	)
}