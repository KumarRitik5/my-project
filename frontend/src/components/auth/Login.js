import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Login = () => {
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			await login(formData.email, formData.password);
			navigate('/');
		} catch (err) {
			setError('Invalid email or password');
		}
	};

	return (
			<div className="auth-container" style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(120deg, #f8fafc 60%, #ffe5e5 100%)',
			}}>
				<div className="auth-box" style={{
					boxShadow: '0 4px 24px #ff6b6b22',
					borderRadius: 12,
					padding: '1.3rem 1.2rem',
					maxWidth: 350,
					width: '100%',
					background: 'rgba(255,255,255,0.98)',
					position: 'relative',
					border: '1px solid #ffe5e5',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}>
				<div style={{ textAlign: 'center', marginBottom: 18 }}>
					  {/* <img src="/favicon.ico" alt="logo" style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 6, boxShadow: '0 2px 8px #ff6b6b22' }} /> */}
					<h2 style={{ color: '#ff6b6b', margin: 0, fontWeight: 800, fontSize: 28, letterSpacing: 1 }}>✨ Luxe Beauty Salon</h2>
					<div style={{ color: '#888', fontSize: 15, marginTop: 2 }}>Welcome back! Please login to continue.</div>
				</div>
				{error && <div className="error-message">{error}</div>}
				<form onSubmit={handleSubmit} autoComplete="on">
					<div className="form-group">
						<label htmlFor="login-email">Email</label>
						<input
							id="login-email"
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							autoFocus
							aria-label="Email"
						/>
					</div>
					<div className="form-group" style={{ position: 'relative' }}>
						<label htmlFor="login-password">Password</label>
						<input
							id="login-password"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							style={{ paddingRight: 36 }}
							aria-label="Password"
						/>
					</div>
					<button type="submit" className="auth-button" style={{ fontWeight: 700, fontSize: 17, marginTop: 8 }}>Login</button>
					<div style={{ marginTop: 12, textAlign: 'center' }}>
						<Link to="/forgot-password" style={{ color: '#ff6b6b', textDecoration: 'underline', fontSize: 14 }}>
							Forgot Password?
						</Link>
					</div>
				</form>
				<div style={{ textAlign: 'center', margin: '1.5rem 0 0.5rem', color: '#aaa', fontSize: 14 }}>or login with</div>
				<div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
					<button style={{ background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: '0.4rem 1.2rem', color: '#333', fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 }} disabled>Google</button>
					<button style={{ background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: '0.4rem 1.2rem', color: '#333', fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 }} disabled>Facebook</button>
				</div>
				<div style={{ textAlign: 'center', marginTop: 10, fontSize: 15 }}>
					Don't have an account? <Link to="/register" style={{ color: '#ff6b6b', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
