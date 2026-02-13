import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Play, Lock, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AdminBootstrapPage = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [testEmail, setTestEmail] = useState('john.flavio@gmail.com');
  const [testPassword, setTestPassword] = useState('Admin#1234835');
  const { toast } = useToast();

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleBootstrap = async () => {
    setLoading(true);
    setLogs([]); // Clear previous logs
    addLog('Starting bootstrap process...', 'info');

    try {
      addLog(`Targeting user: ${testEmail}`, 'info');
      
      const { data, error } = await supabase.functions.invoke('bootstrap-admin', {
        body: { 
          email: testEmail, 
          password: testPassword 
        }
      });

      if (error) throw new Error(error.message || 'Function invocation failed');
      if (data?.error) throw new Error(data.error);

      addLog('✅ Success! User created/updated in Auth.', 'success');
      addLog(`UserId: ${data.userId}`, 'success');
      addLog('✅ Database record upserted.', 'success');
      
      toast({
        title: "Bootstrap Complete",
        description: "Admin user has been configured successfully.",
        className: "bg-green-600 text-white"
      });

    } catch (error) {
      console.error(error);
      addLog(`❌ Error: ${error.message}`, 'error');
      toast({
        title: "Bootstrap Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    addLog('Attempting login verification...', 'info');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (error) throw error;

      addLog('✅ Login Successful!', 'success');
      addLog(`Session User ID: ${data.user.id}`, 'success');
      addLog(`Role from Metadata: ${data.user.user_metadata?.role}`, 'success');
      
      // Check database role explicitly
      const { data: dbUser, error: dbError } = await supabase
        .from('usuarios')
        .select('tipo_usuario')
        .eq('id', data.user.id)
        .single();

      if (dbError) {
        addLog(`⚠️ Could not verify DB role: ${dbError.message}`, 'warning');
      } else {
        addLog(`DB Role: ${dbUser.tipo_usuario}`, dbUser.tipo_usuario === 'super_admin' ? 'success' : 'error');
      }

      await supabase.auth.signOut();
      addLog('Signed out after verification.', 'info');

    } catch (error) {
      addLog(`❌ Login Failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 font-mono">
      <Helmet><title>Admin Bootstrap - HubLumi</title></Helmet>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-900/50">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Bootstrap Tool</h1>
            <p className="text-gray-400">Force create/update Super Admin credentials.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Action Card */}
          <div className="bg-[#111] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-500" />
              1. Execute Fix
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              This will invoke the <code>bootstrap-admin</code> Edge Function to force-update the account:
              <br/><br/>
              <span className="text-green-400">Email:</span> {testEmail}<br/>
              <span className="text-green-400">Pass:</span> {testPassword}
            </p>
            <Button 
              onClick={handleBootstrap} 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" /> Run Bootstrap
            </Button>
          </div>

          {/* Test Card */}
          <div className="bg-[#111] border border-white/10 rounded-xl p-6">
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-500" />
              2. Verify Login
            </h2>
            <form onSubmit={handleTestLogin} className="space-y-4">
              <div className="space-y-2">
                <input 
                  type="email" 
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white text-sm"
                />
                <input 
                  type="text" 
                  value={testPassword}
                  onChange={e => setTestPassword(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                variant="outline"
                className="w-full border-green-600 text-green-500 hover:bg-green-900/20"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Test Credentials
              </Button>
            </form>
          </div>
        </div>

        {/* Logs Console */}
        <div className="bg-black border border-white/10 rounded-xl p-4 h-96 overflow-y-auto font-mono text-sm shadow-inner">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
            <span className="text-gray-500 text-xs uppercase tracking-wider">Execution Logs</span>
            {loading && <span className="text-xs text-yellow-500 animate-pulse">Processing...</span>}
          </div>
          <div className="space-y-2">
            {logs.length === 0 && <span className="text-gray-600 italic">Waiting for input...</span>}
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-3 ${
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'success' ? 'text-green-400' : 
                log.type === 'warning' ? 'text-yellow-400' : 'text-blue-300'
              }`}>
                <span className="text-gray-600 text-xs whitespace-nowrap">[{log.time}]</span>
                <span>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBootstrapPage;