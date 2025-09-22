import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Register = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: '',
		role: 'user',
	});
	const [error, setError] = useState('');
	const { register } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		
		// Validate name field to only allow letters and spaces
		if (name === 'name') {
			// Only allow letters and spaces, reject any numbers
			if (!/^[a-zA-Z\s]*$/.test(value)) {
				return; // Don't update if it contains numbers or special characters
			}
		}
		
		// Validate phone field to only allow numbers and max 10 digits
		if (name === 'phone') {
			// Only allow numbers and limit to 10 digits
			if (!/^\d*$/.test(value) || value.length > 10) {
				return; // Don't update if it contains non-numbers or exceeds 10 digits
			}
		}
		
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		
		// Validate name field
		if (!formData.name.trim()) {
			setError('Name is required');
			return;
		}
		
		if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
			setError('Name can only contain letters and spaces (no numbers allowed)');
			return;
		}
		
		if (formData.name.trim().length < 2) {
			setError('Name must be at least 2 characters long');
			return;
		}
		
		// Validate phone number
		if (!formData.phone.trim()) {
			setError('Phone number is required');
			return;
		}
		
		if (!/^\d{10}$/.test(formData.phone.trim())) {
			setError('Phone number must be exactly 10 digits (numbers only)');
			return;
		}
		
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}
		
		try {
			const userData = {
				name: formData.name.trim(),
				email: formData.email,
				password: formData.password,
				phone: formData.phone,
				role: formData.role
			};
			await register(userData);
			navigate('/');
		} catch (err) {
			setError(err.message || 'Registration failed');
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
			<div style={{ textAlign: 'center', marginBottom: 32 }}>
					  {/* <img src="/favicon.ico" alt="logo" style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 6, boxShadow: '0 2px 8px #ff6b6b22' }} /> */}
					<h2 style={{ color: '#ff6b6b', margin: 0, fontWeight: 800, fontSize: 28, letterSpacing: 1 }}>✨ Luxe Beauty Salon</h2>
					<div style={{ color: '#888', fontSize: 15, marginTop: 2 }}>Create your account to get started.</div>
				</div>
				{error && <div className="error-message">{error}</div>}
				<form onSubmit={handleSubmit} autoComplete="on">
					<div className="form-group">
						<label htmlFor="register-name">Name</label>
						<input
							id="register-name"
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							autoFocus
							aria-label="Name"
							pattern="[a-zA-Z\s]+"
							title="Name can only contain letters and spaces"
							minLength="2"
							maxLength="50"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="register-email">Email</label>
						<input
							id="register-email"
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							aria-label="Email"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="register-phone">Phone</label>
						<input
							id="register-phone"
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							required
							aria-label="Phone"
							pattern="[0-9]{10}"
							title="Phone number must be exactly 10 digits"
							maxLength="10"
							placeholder="1234567890"
						/>
					</div>
					<div className="form-group" style={{ position: 'relative' }}>
						<label htmlFor="register-password">Password</label>
						<input
							id="register-password"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							aria-label="Password"
						/>
					</div>
					<div className="form-group" style={{ position: 'relative' }}>
						<label htmlFor="register-confirm-password">Confirm Password</label>
						<input
							id="register-confirm-password"
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							required
							aria-label="Confirm Password"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="register-role">Account Type</label>
						<select id="register-role" name="role" value={formData.role} onChange={handleChange} required aria-label="Account Type">
							<option value="user">Customer</option>
							<option value="owner">Shop Owner</option>
						</select>
					</div>
					<button type="submit" className="auth-button" style={{ fontWeight: 700, fontSize: 17, marginTop: 8 }}>Register</button>
				</form>
				<div style={{ textAlign: 'center', margin: '1.5rem 0 0.5rem', color: '#aaa', fontSize: 14 }}>or register with</div>
				<div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
					<button style={{ background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: '0.4rem 1.2rem', color: '#333', fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 }} disabled>Google</button>
					<button style={{ background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: '0.4rem 1.2rem', color: '#333', fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 }} disabled>Facebook</button>
				</div>
				<div style={{ textAlign: 'center', marginTop: 10, fontSize: 15 }}>
					Already have an account? <a href="/login" style={{ color: '#ff6b6b', fontWeight: 600, textDecoration: 'none' }}>Login</a>
				</div>
			</div>
		</div>
		);
};

export default Register;
