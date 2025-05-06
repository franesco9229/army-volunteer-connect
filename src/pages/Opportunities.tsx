
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunitiesFilter } from '@/components/opportunities/OpportunitiesFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  fetchOpportunities, 
  fetchUserApplications, 
  applyForOpportunity,
  mockCurrentUser
} from '@/data/mockData';
import { Opportunity, Application, OpportunityStatus } from '@/types';
import { Check, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function Opportunities() {
  const { isAuthenticated, user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState<string>("any");
  const [roleType, setRoleType] = useState<string>("any");
  const [skillInputValue, setSkillInputValue] = useState('');

  // Get IDs of opportunities the user has already applied to
  const appliedOpportunityIds = applications.map(app => app.opportunityId);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch opportunities for all users (whether logged in or not)
      const oppsData = await fetchOpportunities();
      setOpportunities(oppsData);
      
      // Only fetch applications if the user is logged in
      if (isAuthenticated && user) {
        const appsData = await fetchUserApplications(user.id);
        setApplications(appsData);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching opportunities data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, user]);

  const handleApply = async (opportunityId: string) => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to apply for opportunities");
      return;
    }
    
    try {
      // Prepare data for AWS backend integration
      const applicationData = {
        userId: user.id,
        opportunityId: opportunityId,
        timestamp: new Date().toISOString(),
        // Additional fields that would be sent to AWS API Gateway
        metadata: {
          source: 'web-platform',
          userAgent: navigator.userAgent,
        }
      };
      
      console.log("Sending application data to backend:", applicationData);
      
      // This will be replaced with actual AWS API call
      // Using DynamoDB and integrating with Jira and HubSpot
      await applyForOpportunity(user.id, opportunityId);
      
      toast.success("Application submitted successfully!");
      
      // Refresh applications data
      const newApplications = await fetchUserApplications(user.id);
      setApplications(newApplications);
    } catch (error) {
      toast.error("Failed to submit application");
      console.error(error);
    }
  };

  const handleAddSkill = () => {
    if (skillInputValue.trim() && selectedSkills.length < 2) {
      setSelectedSkills([...selectedSkills, skillInputValue.trim()]);
      setSkillInputValue('');
    }
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setTimeCommitment("any");
    setRoleType("any");
    setSkillInputValue('');
  };

  // Filter opportunities based on search term, filters, and status
  const filteredOpportunities = opportunities.filter(opp => {
    // Text search filter
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.requiredSkills.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Skills filter
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => 
        opp.requiredSkills.some(oppSkill => 
          oppSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
    // Role type filter
    const matchesRole = roleType === "any" || (opp.role && opp.role.toLowerCase() === roleType.toLowerCase());
      
    // Time commitment filter
    let matchesTimeCommitment = true;
    if (timeCommitment !== "any" && opp.timeCommitment) {
      const hours = opp.timeCommitment.toLowerCase();
      
      if (timeCommitment === "under5" && hours.includes("5+")) {
        matchesTimeCommitment = false;
      } else if (timeCommitment === "5to10" && !hours.includes("5-10")) {
        matchesTimeCommitment = false;
      } else if (timeCommitment === "10to20" && !hours.includes("10-20")) {
        matchesTimeCommitment = false;
      } else if (timeCommitment === "over20" && !hours.includes("20+")) {
        matchesTimeCommitment = false;
      }
    }
    
    // Tab filters
    if (activeTab === 'all') return matchesSearch && matchesSkills && matchesRole && matchesTimeCommitment;
    if (activeTab === 'open') return matchesSearch && matchesSkills && matchesRole && matchesTimeCommitment && opp.status === OpportunityStatus.Open;
    if (activeTab === 'applied') {
      return matchesSearch && matchesSkills && matchesRole && matchesTimeCommitment && appliedOpportunityIds.includes(opp.id);
    }
    return false;
  });

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-sta-purple-dark">Volunteering Opportunities</h1>
          <p className="text-muted-foreground">
            Browse and apply for volunteering opportunities that match your skills.
          </p>
        </div>
        
        <OpportunitiesFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSkills={selectedSkills}
          onSkillsChange={setSelectedSkills}
          timeCommitment={timeCommitment}
          onTimeCommitmentChange={setTimeCommitment}
          roleType={roleType}
          onRoleTypeChange={setRoleType}
          onClearFilters={clearFilters}
          skillInputValue={skillInputValue}
          onSkillInputChange={setSkillInputValue}
          onAddSkill={handleAddSkill}
        />
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Opportunities</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            {isAuthenticated && (
              <TabsTrigger value="applied" className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                <span>Applied</span>
              </TabsTrigger>
            )}
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
              
              {isLoading && (
                <div className="col-span-full py-10 text-center">
                  <p>Loading opportunities...</p>
                </div>
              )}
              
              {!isLoading && filteredOpportunities.length === 0 && (
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
              
              {isLoading && (
                <div className="col-span-full py-10 text-center">
                  <p>Loading opportunities...</p>
                </div>
              )}
              
              {!isLoading && filteredOpportunities.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No open opportunities found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          {isAuthenticated && (
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
                
                {isLoading && (
                  <div className="col-span-full py-10 text-center">
                    <p>Loading your applications...</p>
                  </div>
                )}
                
                {!isLoading && filteredOpportunities.length === 0 && (
                  <div className="col-span-full py-10 text-center">
                    <p className="text-muted-foreground">You haven't applied to any opportunities yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
}
