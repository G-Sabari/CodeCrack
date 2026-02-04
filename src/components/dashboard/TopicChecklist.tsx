import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, CheckCircle2, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface Topic {
  id: string;
  name: string;
  completed: boolean;
  subtopics?: { id: string; name: string; completed: boolean }[];
}

interface TopicCategory {
  id: string;
  name: string;
  topics: Topic[];
}

const defaultCategories: TopicCategory[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    topics: [
      {
        id: "arrays",
        name: "Arrays",
        completed: true,
        subtopics: [
          { id: "arr-basics", name: "Basics & Traversal", completed: true },
          { id: "arr-2ptr", name: "Two Pointers", completed: true },
          { id: "arr-sliding", name: "Sliding Window", completed: false },
          { id: "arr-prefix", name: "Prefix Sum", completed: false },
        ],
      },
      {
        id: "strings",
        name: "Strings",
        completed: true,
        subtopics: [
          { id: "str-basics", name: "Basics", completed: true },
          { id: "str-pattern", name: "Pattern Matching", completed: false },
        ],
      },
      {
        id: "linkedlist",
        name: "Linked Lists",
        completed: false,
        subtopics: [
          { id: "ll-basics", name: "Basics", completed: true },
          { id: "ll-reversal", name: "Reversal", completed: false },
          { id: "ll-cycle", name: "Cycle Detection", completed: false },
        ],
      },
      {
        id: "trees",
        name: "Trees",
        completed: false,
        subtopics: [
          { id: "tree-traversal", name: "Traversals", completed: true },
          { id: "tree-bst", name: "BST", completed: false },
          { id: "tree-problems", name: "Tree Problems", completed: false },
        ],
      },
      {
        id: "graphs",
        name: "Graphs",
        completed: false,
        subtopics: [
          { id: "graph-bfs", name: "BFS", completed: false },
          { id: "graph-dfs", name: "DFS", completed: false },
          { id: "graph-shortest", name: "Shortest Path", completed: false },
        ],
      },
      {
        id: "dp",
        name: "Dynamic Programming",
        completed: false,
        subtopics: [
          { id: "dp-1d", name: "1D DP", completed: false },
          { id: "dp-2d", name: "2D DP", completed: false },
          { id: "dp-strings", name: "String DP", completed: false },
        ],
      },
    ],
  },
  {
    id: "cs-fundamentals",
    name: "CS Fundamentals",
    topics: [
      { id: "oops", name: "OOPs Concepts", completed: true },
      { id: "dbms", name: "DBMS & SQL", completed: false },
      { id: "os", name: "Operating Systems", completed: false },
      { id: "cn", name: "Computer Networks", completed: false },
    ],
  },
  {
    id: "aptitude",
    name: "Aptitude",
    topics: [
      { id: "quant", name: "Quantitative Aptitude", completed: true },
      { id: "logical", name: "Logical Reasoning", completed: false },
      { id: "verbal", name: "Verbal Ability", completed: false },
    ],
  },
];

export function TopicChecklist() {
  const [categories, setCategories] = useState<TopicCategory[]>(defaultCategories);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["dsa"]);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const toggleTopicCompletion = (categoryId: string, topicId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              topics: cat.topics.map((topic) =>
                topic.id === topicId
                  ? { ...topic, completed: !topic.completed }
                  : topic
              ),
            }
          : cat
      )
    );
  };

  const toggleSubtopicCompletion = (
    categoryId: string,
    topicId: string,
    subtopicId: string
  ) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              topics: cat.topics.map((topic) =>
                topic.id === topicId && topic.subtopics
                  ? {
                      ...topic,
                      subtopics: topic.subtopics.map((sub) =>
                        sub.id === subtopicId
                          ? { ...sub, completed: !sub.completed }
                          : sub
                      ),
                    }
                  : topic
              ),
            }
          : cat
      )
    );
  };

  // Calculate overall progress
  const totalTopics = categories.reduce(
    (acc, cat) =>
      acc +
      cat.topics.reduce(
        (topicAcc, topic) =>
          topicAcc + (topic.subtopics ? topic.subtopics.length : 1),
        0
      ),
    0
  );

  const completedTopics = categories.reduce(
    (acc, cat) =>
      acc +
      cat.topics.reduce(
        (topicAcc, topic) =>
          topicAcc +
          (topic.subtopics
            ? topic.subtopics.filter((sub) => sub.completed).length
            : topic.completed
            ? 1
            : 0),
        0
      ),
    0
  );

  const overallProgress = Math.round((completedTopics / totalTopics) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Topic Completion Checklist
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">
            {completedTopics} of {totalTopics} topics completed
          </span>
          <Badge variant="secondary">{overallProgress}%</Badge>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
              onClick={() => toggleCategory(category.id)}
            >
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <span className="font-medium">{category.name}</span>
              <Badge variant="outline" className="ml-auto text-xs">
                {category.topics.filter((t) => t.completed).length}/
                {category.topics.length}
              </Badge>
            </Button>

            {expandedCategories.includes(category.id) && (
              <div className="ml-4 space-y-1">
                {category.topics.map((topic) => (
                  <div key={topic.id}>
                    <div className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-secondary/50">
                      {topic.subtopics ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleTopic(topic.id)}
                        >
                          {expandedTopics.includes(topic.id) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      ) : (
                        <Checkbox
                          id={topic.id}
                          checked={topic.completed}
                          onCheckedChange={() =>
                            toggleTopicCompletion(category.id, topic.id)
                          }
                        />
                      )}
                      <label
                        htmlFor={topic.id}
                        className={cn(
                          "text-sm cursor-pointer flex-1",
                          topic.completed && "text-muted-foreground line-through"
                        )}
                      >
                        {topic.name}
                      </label>
                      {topic.subtopics && (
                        <span className="text-xs text-muted-foreground">
                          {topic.subtopics.filter((s) => s.completed).length}/
                          {topic.subtopics.length}
                        </span>
                      )}
                    </div>

                    {topic.subtopics && expandedTopics.includes(topic.id) && (
                      <div className="ml-8 space-y-1">
                        {topic.subtopics.map((subtopic) => (
                          <div
                            key={subtopic.id}
                            className="flex items-center gap-2 py-1 px-2 rounded hover:bg-secondary/50"
                          >
                            <Checkbox
                              id={subtopic.id}
                              checked={subtopic.completed}
                              onCheckedChange={() =>
                                toggleSubtopicCompletion(
                                  category.id,
                                  topic.id,
                                  subtopic.id
                                )
                              }
                            />
                            <label
                              htmlFor={subtopic.id}
                              className={cn(
                                "text-sm cursor-pointer",
                                subtopic.completed &&
                                  "text-muted-foreground line-through"
                              )}
                            >
                              {subtopic.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
