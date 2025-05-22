import {useState, useEffect} from 'react';
import { FaSignInAlt} from 'react-icons/fa';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {login,reset} from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Login() {
    const[formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const { email, password} = formData;
    const navigate=useNavigate();
    const dispatch = useDispatch();

    const {user, isError, isSuccess, isLoading, message} = useSelector((state)=>state.auth);

      
    useEffect(()=>{
        if(isError){
            toast.error(message);
        }
        if(isSuccess||user){
            navigate('/');
        }

        dispatch(reset());
    },[user,isError,isSuccess,message,navigate,dispatch])

    const onChange = (e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };
    const onSubmit = (e)=>{
        e.preventDefault();
        const userData={
            email,
            password
        }
        
        dispatch(login(userData));
    };

    if(isLoading){
        return <Spinner />;
    }
    
  return (
    <>
        <section className="heading">
            <h1> Sign in to AssetVerse</h1>
        </section>

        <section className="form">
            <form onSubmit={onSubmit} >
                <div className="form-group">
                    <p>Email</p>
                    <input type="email" className="form-control" id="email"
                    name="email" value={email} placeholder="johndoe@gmail.com" onChange={onChange} />
                </div>
                <div className="form-group">
                    <p>Password</p>
                    <input type="password" className="form-control" id="password"
                    name="password" value={password} placeholder="************" onChange={onChange} />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-block">SIGN IN</button>
                </div>
                <p  className="form-group"><a href="/reset-password">Forgot your password?</a></p>
                <p className="form-group"><a href="/register">New to AssetVerse? Register</a></p>
            </form>
        </section>
    </>
  )
}

export default Login