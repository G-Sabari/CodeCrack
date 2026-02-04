import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Building2, BookOpen, Code, Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  title: string;
  type: "company" | "problem" | "pyq";
  category?: string;
  difficulty?: string;
  path: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Fetch companies
  const { data: companies = [] } = useQuery({
    queryKey: ["search-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, category")
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  // Fetch problems
  const { data: problems = [] } = useQuery({
    queryKey: ["search-problems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("problems")
        .select("id, title, topic, difficulty")
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  // Fetch PYQ questions
  const { data: pyqQuestions = [] } = useQuery({
    queryKey: ["search-pyq"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pyq_questions")
        .select("id, question, topic, year, difficulty")
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  // Build search results
  const searchResults: SearchResult[] = [];

  if (query.length >= 2) {
    const lowerQuery = query.toLowerCase();

    companies.forEach((company) => {
      if (company.name.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: company.id,
          title: company.name,
          type: "company",
          category: company.category,
          path: `/companies/${company.id}`,
        });
      }
    });

    problems.forEach((problem) => {
      if (
        problem.title.toLowerCase().includes(lowerQuery) ||
        problem.topic.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          id: problem.id,
          title: problem.title,
          type: "problem",
          category: problem.topic,
          difficulty: problem.difficulty,
          path: `/problems/${problem.id}`,
        });
      }
    });

    pyqQuestions.forEach((pyq) => {
      if (
        pyq.question.toLowerCase().includes(lowerQuery) ||
        pyq.topic.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          id: pyq.id,
          title: `${pyq.topic} - ${pyq.year}`,
          type: "pyq",
          category: pyq.topic,
          difficulty: pyq.difficulty,
          path: "/pyq-database",
        });
      }
    });
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "company":
        return <Building2 className="h-4 w-4 text-muted-foreground" />;
      case "problem":
        return <Code className="h-4 w-4 text-muted-foreground" />;
      case "pyq":
        return <BookOpen className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies, problems, questions..."
            className="pl-10"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(e.target.value.length >= 2);
            }}
            onFocus={() => query.length >= 2 && setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandList>
            {searchResults.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <>
                {searchResults.filter((r) => r.type === "company").length > 0 && (
                  <CommandGroup heading="Companies">
                    {searchResults
                      .filter((r) => r.type === "company")
                      .slice(0, 5)
                      .map((result) => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => {
                            navigate(result.path);
                            setOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          {getTypeIcon(result.type)}
                          <div className="flex-1">
                            <p className="font-medium">{result.title}</p>
                            {result.category && (
                              <p className="text-xs text-muted-foreground">{result.category}</p>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {searchResults.filter((r) => r.type === "problem").length > 0 && (
                  <CommandGroup heading="Problems">
                    {searchResults
                      .filter((r) => r.type === "problem")
                      .slice(0, 5)
                      .map((result) => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => {
                            navigate(result.path);
                            setOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          {getTypeIcon(result.type)}
                          <div className="flex-1">
                            <p className="font-medium">{result.title}</p>
                            {result.category && (
                              <p className="text-xs text-muted-foreground">{result.category}</p>
                            )}
                          </div>
                          {result.difficulty && (
                            <Badge
                              variant="outline"
                              className={
                                result.difficulty === "Easy"
                                  ? "text-[hsl(var(--success))]"
                                  : result.difficulty === "Medium"
                                  ? "text-[hsl(var(--warning))]"
                                  : "text-destructive"
                              }
                            >
                              {result.difficulty}
                            </Badge>
                          )}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {searchResults.filter((r) => r.type === "pyq").length > 0 && (
                  <CommandGroup heading="PYQ Questions">
                    {searchResults
                      .filter((r) => r.type === "pyq")
                      .slice(0, 5)
                      .map((result) => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => {
                            navigate(result.path);
                            setOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          {getTypeIcon(result.type)}
                          <div className="flex-1">
                            <p className="font-medium">{result.title}</p>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
