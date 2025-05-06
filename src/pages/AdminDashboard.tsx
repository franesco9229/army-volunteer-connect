
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertCircle, User, Calendar, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/sonner';

// Mock data for applications pending review
const MOCK_APPLICATIONS = [
  {
    id: 'app-1',
    userId: 'user-1',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    opportunityId: 'opp-1',
    opportunityTitle: 'Frontend Developer for Charity Website',
    clientName: 'Animal Rescue Center',
    status: 'pending',
    appliedDate: '2023-05-10T09:30:00',
    skills: ['React', 'TypeScript', 'UI Design'],
    notes: '',
  },
  {
    id: 'app-2',
    userId: 'user-2',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    opportunityId: 'opp-2',
    opportunityTitle: 'Data Analysis for Environmental Campaign',
    clientName: 'Green Earth Initiative',
    status: 'pending',
    appliedDate: '2023-05-12T14:20:00',
    skills: ['Python', 'Data Visualization', 'Statistical Analysis'],
    notes: '',
  },
  {
    id: 'app-3',
    userId: 'user-3',
    userName: 'Michael Brown',
    userEmail: 'michael.brown@example.com',
    opportunityId: 'opp-3',
    opportunityTitle: 'Project Manager for Community Event',
    clientName: 'Local Community Center',
    status: 'pending',
    appliedDate: '2023-05-15T11:45:00',
    skills: ['Project Management', 'Event Planning', 'Budgeting'],
    notes: '',
  },
];

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  useEffect(() => {
    // In a real application, this would fetch data from the API
    // Example: fetchAdminApplications()
  }, []);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[80vh] flex-col space-y-4">
          <AlertCircle className="h-12 w-12 text-sta-purple" />
          <h1 className="text-2xl font-bold text-sta-purple-dark">Access Denied</h1>
          <p className="text-muted-foreground">
            You need administrator privileges to access this page.
          </p>
        </div>
      </AppLayout>
    );
  }

  const handleApprove = (applicationId: string) => {
    // In production, this would call the API
    // Example: VolunteeringApi.updateApplicationStatus(applicationId, 'approved', reviewNotes)
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: 'approved' } : app
    ));
    toast.success("Application approved successfully");
    setIsReviewDialogOpen(false);
    setReviewNotes('');
  };

  const handleReject = (applicationId: string) => {
    // In production, this would call the API
    // Example: VolunteeringApi.updateApplicationStatus(applicationId, 'rejected', reviewNotes)
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: 'rejected' } : app
    ));
    toast.success("Application rejected");
    setIsReviewDialogOpen(false);
    setReviewNotes('');
  };

  const openReviewDialog = (application: any) => {
    setSelectedApplication(application);
    setReviewNotes('');
    setIsReviewDialogOpen(true);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.opportunityTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sta-purple-dark">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Review and manage volunteer applications
            </p>
          </div>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>Pending Review</span>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              <span>Approved</span>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-1">
              <X className="h-4 w-4" />
              <span>Rejected</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by volunteer or opportunity..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications Pending Review</CardTitle>
                <CardDescription>
                  Review and approve volunteer applications for open opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Opportunity</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications
                      .filter(app => app.status === 'pending')
                      .map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="font-medium">{application.userName}</div>
                            <div className="text-sm text-muted-foreground">{application.userEmail}</div>
                          </TableCell>
                          <TableCell>
                            <div>{application.opportunityTitle}</div>
                            <div className="text-sm text-muted-foreground">{application.clientName}</div>
                          </TableCell>
                          <TableCell>
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openReviewDialog(application)}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    
                    {filteredApplications.filter(app => app.status === 'pending').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">No pending applications found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Approved Applications</CardTitle>
                <CardDescription>
                  Applications that have been approved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Opportunity</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications
                      .filter(app => app.status === 'approved')
                      .map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="font-medium">{application.userName}</div>
                            <div className="text-sm text-muted-foreground">{application.userEmail}</div>
                          </TableCell>
                          <TableCell>
                            <div>{application.opportunityTitle}</div>
                            <div className="text-sm text-muted-foreground">{application.clientName}</div>
                          </TableCell>
                          <TableCell>
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    
                    {filteredApplications.filter(app => app.status === 'approved').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">No approved applications found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Applications</CardTitle>
                <CardDescription>
                  Applications that have been rejected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Opportunity</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications
                      .filter(app => app.status === 'rejected')
                      .map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="font-medium">{application.userName}</div>
                            <div className="text-sm text-muted-foreground">{application.userEmail}</div>
                          </TableCell>
                          <TableCell>
                            <div>{application.opportunityTitle}</div>
                            <div className="text-sm text-muted-foreground">{application.clientName}</div>
                          </TableCell>
                          <TableCell>
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    
                    {filteredApplications.filter(app => app.status === 'rejected').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">No rejected applications found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Review this volunteer application and approve or reject it
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Volunteer</h4>
                  <p>{selectedApplication.userName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Opportunity</h4>
                  <p>{selectedApplication.opportunityTitle}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Organization</h4>
                  <p>{selectedApplication.clientName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date Applied</h4>
                  <p>{new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Review Notes</h4>
                <Textarea
                  placeholder="Add notes about this application..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2 sm:justify-between">
            <Button 
              variant="destructive" 
              onClick={() => selectedApplication && handleReject(selectedApplication.id)}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button 
              onClick={() => selectedApplication && handleApprove(selectedApplication.id)}
              className="flex-1 bg-sta-purple hover:bg-sta-purple/90"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
