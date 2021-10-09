import React,{Fragment,useState} from 'react'
import {Link} from 'react-router-dom'

export const Login = () => {
    const [formData,setFormData]=useState({
        email:'',
        password:'',   
    })
    const {email,password}=formData
    const onSubmit =e=>{
        e.preventDefault();
        console.log('SUCCESS');
    }
    const onChange= e=>setFormData({...formData,[e.target.name]:e.target.value})
    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
        <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
        <form className="form"  onSubmit={e=>onSubmit(e)}>
          <div className="form-group">
            <input type="email" placeholder="Email Address" onChange={e=>onChange(e)} name="email" value={email} required />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength="6"
              onChange={e=>onChange(e)}
              value={password}
              required
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/login">Sign In</Link>
        </p>
        </Fragment>
    )
}
export default Login;