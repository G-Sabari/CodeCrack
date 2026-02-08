import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Building2, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { companyMetadata } from "@/data/premiumAptitudeQuestions";

interface CompanyFilterProps {
  selectedCompanies: string[];
  onCompanyToggle: (company: string) => void;
  onClearAll: () => void;
}

export function CompanyFilter({
  selectedCompanies,
  onCompanyToggle,
  onClearAll,
}: CompanyFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showServiceBased, setShowServiceBased] = useState(true);
  const [showProductBased, setShowProductBased] = useState(true);

  const allCompanies = [
    ...companyMetadata.serviceBased.map((c) => ({ name: c, type: "Service-Based" })),
    ...companyMetadata.productBased.map((c) => ({ name: c, type: "Product-Based" })),
  ];

  const filteredCompanies = allCompanies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      (showServiceBased && c.type === "Service-Based") ||
      (showProductBased && c.type === "Product-Based");
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Company Practice Mode
        </h3>
        {selectedCompanies.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs gap-1">
            <X className="w-3 h-3" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Type Filters */}
      <div className="flex gap-2">
        <Button
          variant={showServiceBased ? "default" : "outline"}
          size="sm"
          onClick={() => setShowServiceBased(!showServiceBased)}
          className="text-xs"
        >
          Service-Based
        </Button>
        <Button
          variant={showProductBased ? "default" : "outline"}
          size="sm"
          onClick={() => setShowProductBased(!showProductBased)}
          className="text-xs"
        >
          Product-Based
        </Button>
      </div>

      {/* Selected Companies */}
      {selectedCompanies.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-primary/10">
          <span className="text-xs text-primary font-medium w-full mb-1">
            Selected ({selectedCompanies.length}):
          </span>
          {selectedCompanies.map((company) => (
            <Badge
              key={company}
              variant="default"
              className="gap-1 cursor-pointer"
              onClick={() => onCompanyToggle(company)}
            >
              {company}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Company List */}
      <div className="max-h-60 overflow-y-auto space-y-2">
        {filteredCompanies.map(({ name, type }) => (
          <div
            key={name}
            onClick={() => onCompanyToggle(name)}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              selectedCompanies.includes(name)
                ? "border-primary bg-primary/10"
                : "border-border/50 bg-card/30"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{name}</span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                type === "Service-Based"
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30"
              )}
            >
              {type === "Service-Based" ? "Service" : "Product"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
