
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  fetchOpportunities, 
  fetchUserApplications, 
  applyForOpportunity,
  mockCurrentUser
} from '@/data/mockData';
import { Opportunity, Application, OpportunityStatus } from '@/types';
import { Search, Filter, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Get IDs of opportunities the user has already applied to
  const appliedOpportunityIds = applications.map(app => app.opportunityId);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [oppsData, appsData] = await Promise.all([
        fetchOpportunities(),
        fetchUserApplications(mockCurrentUser.id)
      ]);
      
      setOpportunities(oppsData);
      setApplications(appsData);
    } catch (error) {
      console.error("Error fetching opportunities data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (opportunityId: string) => {
    try {
      await applyForOpportunity(mockCurrentUser.id, opportunityId);
      toast.success("Application submitted successfully!");
      // Refresh applications data
      const newApplications = await fetchUserApplications(mockCurrentUser.id);
      setApplications(newApplications);
    } catch (error) {
      toast.error("Failed to submit application");
      console.error(error);
    }
  };

  // Filter opportunities based on search term and status
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.requiredSkills.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'open') return matchesSearch && opp.status === OpportunityStatus.Open;
    if (activeTab === 'applied') {
      return matchesSearch && appliedOpportunityIds.includes(opp.id);
    }
    return false;
  });

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Volunteering Opportunities</h1>
          <p className="text-muted-foreground">
            Browse and apply for volunteering opportunities that match your skills.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Opportunities</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="applied" className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              <span>Applied</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onApply={handleApply}
                  hasApplied={appliedOpportunityIds.includes(opportunity.id)}
                />
              ))}
              
              {filteredOpportunities.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No opportunities found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="open" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onApply={handleApply}
                  hasApplied={appliedOpportunityIds.includes(opportunity.id)}
                />
              ))}
              
              {filteredOpportunities.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No open opportunities found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="applied" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onApply={handleApply}
                  hasApplied={true}
                />
              ))}
              
              {filteredOpportunities.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">You haven't applied to any opportunities yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
