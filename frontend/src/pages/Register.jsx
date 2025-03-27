import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import {register,reset} from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Register() {
    const[formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })
    const {name, email, password, password2} = formData;

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

        if(password !== password2){
            toast.error('Passwords do not match');
        }
        else{
            const userData={
                name,
                email,
                password
            }
            dispatch(register(userData));
        }
    };

    if(isLoading){
        return <Spinner />
    }

    return (
    <>
        <section className="heading">
            <h1>Register on AssetVerse</h1>
        </section>

        <section className="form">
            <form onSubmit={onSubmit} >
                <div className="form-group">
                    <p>Email</p>
                    <input type="email" className="form-control" id="email"
                    name="email" value={email} placeholder="johndoe@gmail.com" onChange={onChange} />
                </div>
                <div className="form-group">
                    <p>Username</p>
                    <input type="text" className="form-control" id="name"
                    name="name" value={name} placeholder="John Doe" onChange={onChange} />
                </div>
                <div className="form-group">
                    <p>Password</p>
                    <input type="password" className="form-control" id="password"
                    name="password" value={password} placeholder="************" onChange={onChange} />
                </div>
                <div className="form-group">
                    <p>Repeat Password</p>
                    <input type="password" className="form-control" id="password2"
                    name="password2" value={password2} placeholder="************" onChange={onChange} />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-block">REGISTER</button>
                </div>
                <p className="form-group"><a href="/login">Do you have an account? Sign in</a></p>
            </form>
        </section>
    </>
  )
}

export default Register