import { useState } from 'react';
import { useAppSelector } from '../../redux/hook';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useToast } from '../../hooks/use-toast';
import { motion } from 'framer-motion';

export default function UserProfile() {
  const { user } = useAppSelector((s) => s.auth);
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully.',
        variant: 'success',
      });
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto space-y-8"
    >
      <h2 className="font-display text-3xl font-bold tracking-wide text-primary">
        My Profile
      </h2>

      <motion.div
        className="glass-card p-8 space-y-6 rounded-2xl shadow-xl backdrop-blur-md border border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Full Name */}
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-muted-foreground">Full Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-muted-foreground">Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Enter your email"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-muted-foreground">Phone</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="Enter your phone number"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 shadow-md"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </motion.div>
    </motion.div>
  );
}