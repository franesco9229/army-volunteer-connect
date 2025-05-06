
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
import { Opportunity, Application, OpportunityStatus, Skill, SkillLevel } from '@/types';
import { Search, Filter, Check, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Skills and experience levels for filtering
const SKILL_OPTIONS = [
  "Web Development", 
  "UX/UI Design", 
  "Data Analysis", 
  "Project Management", 
  "Marketing",
  "Content Writing"
];

const EXPERIENCE_LEVELS = [
  { label: "Any Level", value: "any" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" }
];

const AVAILABILITY_OPTIONS = [
  { label: "Any Time", value: "any" },
  { label: "Evenings", value: "evenings" },
  { label: "Weekends", value: "weekends" },
  { label: "Full-time", value: "fulltime" }
];

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("any");
  const [availability, setAvailability] = useState<string>("any");

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
      // Prepare data for AWS backend integration
      const applicationData = {
        userId: mockCurrentUser.id,
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

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setExperienceLevel("any");
    setAvailability("any");
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
        opp.requiredSkills.includes(skill)
      );
      
    // Experience level filter (this would be more precise with real data)
    const matchesExperience = experienceLevel === "any" || true; // Placeholder until data includes experience level
    
    // Availability filter (this would be more precise with real data)
    const matchesAvailability = availability === "any" || true; // Placeholder until data includes availability
    
    // Tab filters
    if (activeTab === 'all') return matchesSearch && matchesSkills && matchesExperience && matchesAvailability;
    if (activeTab === 'open') return matchesSearch && matchesSkills && matchesExperience && matchesAvailability && opp.status === OpportunityStatus.Open;
    if (activeTab === 'applied') {
      return matchesSearch && matchesSkills && matchesExperience && matchesAvailability && appliedOpportunityIds.includes(opp.id);
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
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {(selectedSkills.length > 0 || experienceLevel !== 'any' || availability !== 'any') && (
                  <span className="bg-sta-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedSkills.length + (experienceLevel !== 'any' ? 1 : 0) + (availability !== 'any' ? 1 : 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filter Opportunities</SheetTitle>
                <SheetDescription>
                  Refine results based on your preferences
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Skills</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SKILL_OPTIONS.map(skill => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <Label htmlFor={`skill-${skill}`} className="text-sm">{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Experience Level</h3>
                  <Select 
                    value={experienceLevel} 
                    onValueChange={setExperienceLevel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Availability</h3>
                  <Select 
                    value={availability} 
                    onValueChange={setAvailability}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABILITY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <SheetFooter className="flex flex-row justify-between sm:justify-between gap-2">
                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-1">
                  <X size={16} />
                  Clear filters
                </Button>
                <SheetClose asChild>
                  <Button>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
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
