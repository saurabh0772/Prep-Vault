import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await register(name, email, password);
    setIsSubmitting(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row h-screen lg:h-[700px] lg:rounded-[2rem] lg:overflow-hidden lg:shadow-2xl lg:border border-border/50 relative z-10 m-4">
        
        {/* Left Branding Side */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-green to-teal-600 p-10 flex-col relative overflow-hidden text-white">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-extrabold text-xl backdrop-blur-sm border border-white/30">
                P
              </div>
              <span className="text-2xl font-extrabold tracking-tight">PrepVault</span>
            </div>
            
            <h1 className="text-4xl font-extrabold leading-tight mb-5 mt-16">
              Start building your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-white">career vault.</span>
            </h1>
            <p className="text-lg text-emerald-50 max-w-md font-medium leading-relaxed">
              Join thousands of professionals organizing their preparation materials and acing their interviews.
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-card/80 backdrop-blur-xl relative">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
              P
            </div>
            <span className="text-2xl font-extrabold text-foreground tracking-tight">PrepVault</span>
          </div>

          <div className="max-w-sm w-full mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700">
            <h2 className="text-2xl font-extrabold text-foreground mb-2 tracking-tight">Create an account</h2>
            <p className="text-foreground/60 mb-6 text-sm">Enter your details below to get started.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-foreground/80 pl-1 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all font-medium group-hover:border-foreground/20 text-sm"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-foreground/80 pl-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all font-medium group-hover:border-foreground/20 text-sm"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-foreground/80 pl-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all font-medium group-hover:border-foreground/20 text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-3 bg-brand-green hover:bg-teal-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-brand-green/20 text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-foreground/60 font-medium text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-green font-bold hover:text-teal-500 hover:underline transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
