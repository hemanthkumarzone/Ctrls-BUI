import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerOrg, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    orgName: '',
    orgSlug: '',
    orgPlan: 'starter',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Auto-generate org slug from org name
  const generateOrgSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      orgName: value,
      orgSlug: generateOrgSlug(value),
    }));
  };

  const validateForm = () => {
    if (!formData.orgName.trim()) return 'Organization name is required';
    if (!formData.orgSlug.trim()) return 'Organization slug is required';
    if (!formData.adminName.trim()) return 'Admin name is required';
    if (!formData.adminEmail.includes('@')) return 'Valid admin email is required';
    if (formData.adminPassword.length < 6) return 'Password must be at least 6 characters';
    if (formData.adminPassword !== formData.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await registerOrg(
        formData.orgName,
        formData.orgSlug,
        formData.orgPlan,
        formData.adminEmail,
        formData.adminPassword,
        formData.adminName
      );
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Organization creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = (() => {
    const pwd = formData.adminPassword;
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return Math.min(5, strength);
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
            <span className="text-2xl font-bold text-white">🏢</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Organization</h1>
          <p className="text-slate-300">Set up your FinOps workspace</p>
        </div>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Create Organization</CardTitle>
            <CardDescription>
              Set up your organization and create admin account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Organization Section */}
              <div className="border-b border-slate-700 pb-4">
                <h3 className="text-white font-semibold mb-3">Organization Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="orgName" className="text-white">
                    Organization Name *
                  </Label>
                  <Input
                    id="orgName"
                    name="orgName"
                    type="text"
                    placeholder="My Company Inc."
                    value={formData.orgName}
                    onChange={handleOrgNameChange}
                    disabled={isSubmitting || isLoading}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                  <p className="text-xs text-slate-400">The official name of your organization</p>
                </div>

                <div className="space-y-2 mt-3">
                  <Label htmlFor="orgSlug" className="text-white">
                    Organization Slug *
                  </Label>
                  <Input
                    id="orgSlug"
                    name="orgSlug"
                    type="text"
                    placeholder="my-company-inc"
                    value={formData.orgSlug}
                    onChange={handleChange}
                    disabled={isSubmitting || isLoading}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                  <p className="text-xs text-slate-400">A unique identifier (auto-generated from name, lowercase with hyphens)</p>
                </div>

                <div className="space-y-2 mt-3">
                  <Label htmlFor="orgPlan" className="text-white">
                    Organization Plan *
                  </Label>
                  <select
                    id="orgPlan"
                    name="orgPlan"
                    value={formData.orgPlan}
                    onChange={handleChange}
                    disabled={isSubmitting || isLoading}
                    className="w-full rounded-md border border-slate-600 bg-slate-700 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="starter">Starter (Basic features)</option>
                    <option value="pro">Pro (Advanced features)</option>
                    <option value="enterprise">Enterprise (All features)</option>
                  </select>
                </div>
              </div>

              {/* Admin Section */}
              <div className="pt-4">
                <h3 className="text-white font-semibold mb-3">Organization Admin</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="adminName" className="text-white">
                    Admin Full Name *
                  </Label>
                  <Input
                    id="adminName"
                    name="adminName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.adminName}
                    onChange={handleChange}
                    disabled={isSubmitting || isLoading}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                  <p className="text-xs text-slate-400">The name of the organization administrator</p>
                </div>

                <div className="space-y-2 mt-3">
                  <Label htmlFor="adminEmail" className="text-white">
                    Admin Email Address *
                  </Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    placeholder="admin@mycompany.com"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    disabled={isSubmitting || isLoading}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="space-y-2 mt-3">
                  <Label htmlFor="adminPassword" className="text-white">
                    Admin Password *
                  </Label>
                  <Input
                    id="adminPassword"
                    name="adminPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    disabled={isSubmitting || isLoading}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                  {formData.adminPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1 h-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-colors ${
                              i < passwordStrength
                                ? 'bg-green-500'
                                : 'bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {passwordStrength < 3 ? 'Weak' : passwordStrength < 5 ? 'Good' : 'Strong'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mt-3">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting || isLoading}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                  {formData.confirmPassword && formData.adminPassword === formData.confirmPassword && (
                    <div className="flex items-center gap-2 text-green-400 text-sm mt-1">
                      <CheckCircle className="h-4 w-4" />
                      Passwords match
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium mt-6"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating Organization...
                  </>
                ) : (
                  'Create Organization'
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">Already have an account?</span>
              </div>
            </div>

            <Link to="/login">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-700"
              >
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-center text-slate-400 text-xs mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
