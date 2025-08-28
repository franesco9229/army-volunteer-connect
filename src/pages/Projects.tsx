import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader, Plus, Edit2, Trash2, Database, RefreshCw, Bug, ChevronDown, ChevronUp, Copy, Terminal, TestTube, Zap } from 'lucide-react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjects';
import { Project } from '@/services/apiGatewayService';
import { toast } from '@/components/ui/sonner';
import AppLayout from '@/components/layout/AppLayout';

interface ProjectFormData {
  name: string;
  description: string;
}

interface DebugLog {
  timestamp: string;
  type: 'error' | 'request' | 'response' | 'info';
  message: string;
  data?: any;
}

function ProjectsContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({ name: '', description: '' });
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [currentToken, setCurrentToken] = useState<string>('');

  const { data: projects, isLoading, error, refetch } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  // Capture console errors and logs
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleLog = console.log;
    const originalConsoleInfo = console.info;

    console.error = (...args) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: 'error',
        message,
        data: args
      }]);
      originalConsoleError(...args);
    };

    console.log = (...args) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
      if (message.includes('GraphQL') || message.includes('error') || message.includes('request') || message.includes('response')) {
        setDebugLogs(prev => [...prev, {
          timestamp: new Date().toISOString(),
          type: message.toLowerCase().includes('error') ? 'error' : 
                message.toLowerCase().includes('request') ? 'request' :
                message.toLowerCase().includes('response') ? 'response' : 'info',
          message,
          data: args
        }]);
      }
      originalConsoleLog(...args);
    };

    console.info = (...args) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
      if (message.includes('GraphQL') || message.includes('Session') || message.includes('Making')) {
        setDebugLogs(prev => [...prev, {
          timestamp: new Date().toISOString(),
          type: 'info',
          message,
          data: args
        }]);
      }
      originalConsoleInfo(...args);
    };

    return () => {
      console.error = originalConsoleError;
      console.log = originalConsoleLog;
      console.info = originalConsoleInfo;
    };
  }, []);

  // Add error to debug logs
  useEffect(() => {
    if (error) {
      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: 'error',
        message: `Query Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: error
      }]);
    }
  }, [error]);

  // New function to get current token for manual testing
  const getCurrentTokenForTesting = async () => {
    try {
      const { getCurrentUser, fetchAuthSession } = await import('aws-amplify/auth');
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() || '';
      setCurrentToken(token);
      
      const curlCommand = `curl -X GET \\
  https://0x1xt3auh4.execute-api.us-west-2.amazonaws.com/dev/projects \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}"`;
      
      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: 'info',
        message: `CURL Command for manual testing:\n${curlCommand}`,
        data: { token: token.substring(0, 50) + '...', curlCommand }
      }]);
      
      return { token, curlCommand };
    } catch (error) {
      console.error('Failed to get token:', error);
      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: 'error',
        message: `Failed to get current token: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: error
      }]);
      return null;
    }
  };

  // Function to test token validity
  const testTokenManually = async () => {
    try {
      const tokenInfo = await getCurrentTokenForTesting();
      if (!tokenInfo) return;
      
      // Make a direct fetch request to test
      const response = await fetch('https://0x1xt3auh4.execute-api.us-west-2.amazonaws.com/dev/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenInfo.token}`
        }
      });

      const responseText = await response.text();
      
      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: response.ok ? 'info' : 'error',
        message: `Manual token test result:\nStatus: ${response.status}\nResponse: ${responseText}`,
        data: { 
          status: response.status, 
          ok: response.ok, 
          response: responseText,
          headers: Object.fromEntries(response.headers.entries())
        }
      }]);

      if (response.status === 401) {
        toast.error('Token is invalid or expired');
      } else if (response.status === 200) {
        toast.success('Token is valid, issue is in the resolver');
      } else {
        toast.error(`Unexpected status: ${response.status}`);
      }
      
    } catch (error) {
      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: 'error',
        message: `Manual token test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: error
      }]);
    }
  };

  // Add new function to test createProject mutation directly
  const testCreateProjectMutation = async () => {
    try {
      const { getCurrentUser, fetchAuthSession } = await import('aws-amplify/auth');
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() || '';
      
      const testProjectData = {
        name: `Test Project ${Date.now()}`,
        description: 'This is a test project created from debug window'
      };

      const createMutation = `
        mutation CreateProject($name: String!, $description: String) {
          createProject(name: $name, description: $description) {
            id
            name
            description
          }
        }
      `;

      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: 'info',
        message: `Testing createProject mutation with data: ${JSON.stringify(testProjectData)}`,
        data: testProjectData
      }]);

      const response = await fetch('https://0x1xt3auh4.execute-api.us-west-2.amazonaws.com/dev/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testProjectData)
      });

      const responseText = await response.text();
      
      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: response.ok ? 'info' : 'error',
        message: `CreateProject test result:\nStatus: ${response.status}\nResponse: ${responseText}`,
        data: { 
          status: response.status, 
          ok: response.ok, 
          response: responseText,
          mutation: createMutation,
          variables: testProjectData
        }
      }]);

      if (response.ok) {
        const result = JSON.parse(responseText);
        if (result.errors) {
          toast.error(`CreateProject has errors: ${result.errors.map(e => e.message).join(', ')}`);
        } else {
          toast.success('CreateProject mutation works! Check debug logs for details.');
          // Trigger a refetch to see if the new project appears
          refetch();
        }
      } else {
        toast.error(`CreateProject failed with status: ${response.status}`);
      }
      
    } catch (error) {
      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: 'error',
        message: `CreateProject test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: error
      }]);
      toast.error('CreateProject test failed - check debug logs');
    }
  };

  // Function to create 2 test projects for backend testing
  const createTwoMockProjects = async () => {
    try {
      const { getCurrentUser, fetchAuthSession } = await import('aws-amplify/auth');
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() || '';
      
      const mockProjects = [
        {
          name: 'Community Garden Project',
          description: 'A volunteer initiative to create and maintain community gardens in urban areas. This project helps provide fresh produce to local communities while promoting environmental sustainability.'
        },
        {
          name: 'Digital Literacy Program',
          description: 'Teaching digital skills to seniors and underserved communities. Volunteers help people learn basic computer skills, internet safety, and how to use smartphones and tablets.'
        }
      ];

      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: 'info',
        message: `Creating 2 mock projects for testing: ${JSON.stringify(mockProjects, null, 2)}`,
        data: mockProjects
      }]);

      const results = [];
      
      for (let i = 0; i < mockProjects.length; i++) {
        const projectData = mockProjects[i];
        
        const response = await fetch('https://0x1xt3auh4.execute-api.us-west-2.amazonaws.com/dev/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(projectData)
        });

        const responseText = await response.text();
        
        setDebugLogs(prev => [...prev, {
          timestamp: new Date().toISOString(),
          type: response.ok ? 'info' : 'error',
          message: `Mock Project ${i + 1} result:\nStatus: ${response.status}\nResponse: ${responseText}`,
          data: { 
            projectIndex: i + 1,
            status: response.status, 
            ok: response.ok, 
            response: responseText,
            projectData
          }
        }]);

        results.push({
          success: response.ok,
          status: response.status,
          response: responseText,
          project: projectData
        });

        // Wait a bit between requests
        if (i < mockProjects.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const successCount = results.filter(r => r.success).length;
      
      if (successCount === mockProjects.length) {
        toast.success(`Successfully created ${successCount} mock projects! Check the Projects list.`);
        // Trigger a refetch to see the new projects
        refetch();
      } else if (successCount > 0) {
        toast.success(`Created ${successCount} out of ${mockProjects.length} mock projects. Check debug logs for details.`);
        refetch();
      } else {
        toast.error('Failed to create any mock projects. Check debug logs for details.');
      }
      
    } catch (error) {
      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        type: 'error',
        message: `Create mock projects failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: error
      }]);
      toast.error('Failed to create mock projects - check debug logs');
    }
  };

  const copyDebugInfo = () => {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : error,
      logs: debugLogs,
      projectsData: projects,
      isLoading,
      mutations: {
        createPending: createProject.isPending,
        updatePending: updateProject.isPending,
        deletePending: deleteProject.isPending
      },
      currentToken: currentToken ? currentToken.substring(0, 50) + '...' : 'No token captured',
      apiGatewayEndpoint: 'https://0x1xt3auh4.execute-api.us-west-2.amazonaws.com/dev'
    };
    
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    toast.success('Debug info copied to clipboard');
  };

  const copyCurlCommand = async () => {
    const tokenInfo = await getCurrentTokenForTesting();
    if (tokenInfo) {
      navigator.clipboard.writeText(tokenInfo.curlCommand);
      toast.success('CURL command copied to clipboard');
    }
  };

  const clearDebugLogs = () => {
    setDebugLogs([]);
    toast.success('Debug logs cleared');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      if (editingProject) {
        await updateProject.mutateAsync({
          id: editingProject.id,
          name: formData.name.trim(),
          description: formData.description.trim() || undefined
        });
        setEditingProject(null);
      } else {
        await createProject.mutateAsync({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined
        });
        setIsCreateDialogOpen(false);
      }
      
      setFormData({ name: '', description: '' });
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || ''
    });
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        await deleteProject.mutateAsync(project.id);
      } catch (error) {
        // Error handling is done in the mutation hook
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingProject(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-sta-purple" />
            <p className="text-gray-600 dark:text-gray-400">Loading projects from REST API...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Debug Window */}
      <Collapsible open={isDebugOpen} onOpenChange={setIsDebugOpen} className="mb-6">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Advanced Debug Console ({debugLogs.length} logs)
              {error && <Badge variant="destructive">Error</Badge>}
            </div>
            {isDebugOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-red-600 dark:text-red-400">API Gateway Debug & Testing</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={testTokenManually}>
                    <TestTube className="h-4 w-4 mr-1" />
                    Test Query
                  </Button>
                  <Button size="sm" variant="outline" onClick={testCreateProjectMutation}>
                    <Zap className="h-4 w-4 mr-1" />
                    Test Create
                  </Button>
                  <Button size="sm" variant="outline" onClick={createTwoMockProjects} className="bg-green-50 hover:bg-green-100 border-green-200">
                    <Plus className="h-4 w-4 mr-1" />
                    Create 2 Mock Projects
                  </Button>
                  <Button size="sm" variant="outline" onClick={copyCurlCommand}>
                    <Terminal className="h-4 w-4 mr-1" />
                    Copy CURL
                  </Button>
                  <Button size="sm" variant="outline" onClick={copyDebugInfo}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy All
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearDebugLogs}>
                    Clear Logs
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Current Error:</h4>
                  <pre className="text-sm text-red-600 dark:text-red-300 whitespace-pre-wrap">
                    {error instanceof Error ? error.message : JSON.stringify(error, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Mutation vs Query Testing:</h4>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                  <li>Click "Test Query" to test listProjects (currently failing)</li>
                  <li>Click "Test Create" to test createProject mutation</li>
                  <li>Compare the responses to see which resolvers work</li>
                  <li>If Create works but Query fails: different resolver configurations</li>
                  <li>If both fail the same way: general AppSync issue</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-96 overflow-y-auto">
                <h4 className="font-semibold mb-2">Console Logs & Test Results:</h4>
                {debugLogs.length === 0 ? (
                  <p className="text-gray-500">No debug logs captured yet. Click "Test Token" to start debugging.</p>
                ) : (
                  <div className="space-y-2">
                    {debugLogs.slice(-20).map((log, index) => (
                      <div key={index} className={`text-xs p-2 rounded ${
                        log.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                        log.type === 'request' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                        log.type === 'response' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                      }`}>
                        <div className="font-mono text-xs text-gray-500 mb-1">
                          {new Date(log.timestamp).toLocaleTimeString()} - {log.type.toUpperCase()}
                        </div>
                        <pre className="whitespace-pre-wrap break-words">{log.message}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <p><strong>Debug Process:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Click "Test Token" to verify authentication works</li>
                  <li>Copy all debug info and paste to ChatGPT with your question</li>
                  <li>Include the CURL command result from your terminal</li>
                  <li>Current error suggests resolver configuration issue, not token problem</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your projects via AWS API Gateway + Lambda
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              REST API + DynamoDB
            </Badge>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sta-purple hover:bg-sta-purple/90" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter project description (optional)"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProject.isPending || !formData.name.trim()}
                  className="bg-sta-purple hover:bg-sta-purple/90"
                >
                  {createProject.isPending ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Failed to Load Projects
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </p>
            <Button onClick={() => refetch()} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      ) : !projects || projects.length === 0 ? (
        <div className="text-center py-12">
          <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Projects Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first project to get started.
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-sta-purple hover:bg-sta-purple/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{project.name}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(project)}
                      disabled={updateProject.isPending}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(project)}
                      disabled={deleteProject.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {project.description || 'No description provided'}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  <p>ID: {project.id}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Project Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter project description (optional)"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingProject(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProject.isPending || !formData.name.trim()}
                className="bg-sta-purple hover:bg-sta-purple/90"
              >
                {updateProject.isPending ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Project'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Projects() {
  return (
    <AppLayout>
      <ProjectsContent />
    </AppLayout>
  );
}
