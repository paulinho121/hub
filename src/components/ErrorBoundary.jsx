import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-[#111] border border-red-500/20 rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Ops! Algo deu errado.</h2>
            <p className="text-gray-400 mb-6">
              Ocorreu um erro inesperado ao carregar a aplicação. Tente recarregar a página.
            </p>

            {this.state.error && (
              <div className="bg-black/50 p-3 rounded border border-white/10 text-left mb-6 overflow-auto max-h-32">
                <code className="text-xs text-red-300 font-mono">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex justify-center">
              <Button 
                onClick={this.handleReload}
                className="bg-white text-black hover:bg-gray-200 font-bold"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar Página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;