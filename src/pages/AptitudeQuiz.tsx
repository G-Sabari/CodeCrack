import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { PracticeQuiz } from "@/components/aptitude/quiz/PracticeQuiz";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  Brain,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Star,
  Trophy,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { aptitudeCategories } from "@/data/aptitudeData";
import { getAllPremiumQuestions, type PremiumAptitudeQuestion } from "@/data/premiumAptitudeIndex";

// Logical Reasoning Questions (sample - additive content)
const logicalReasoningQuestions: PremiumAptitudeQuestion[] = [
  {
    id: "lr-1",
    topic: "Number Series",
    topicId: "number-series",
    difficulty: "Easy",
    question: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    explanation: "Pattern: +4, +6, +8, +10, +12. So 30 + 12 = 42",
    shortcut: "Differences form an AP: 4, 6, 8, 10, 12",
    timeLimit: 60,
    companies: ["TCS", "Infosys", "Wipro"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Number series pattern"
  },
  {
    id: "lr-2",
    topic: "Number Series",
    topicId: "number-series",
    difficulty: "Easy",
    question: "What comes next: 1, 4, 9, 16, 25, ?",
    options: ["30", "36", "49", "35"],
    correctAnswer: 1,
    explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6² = 36",
    shortcut: "Perfect squares pattern",
    timeLimit: 45,
    companies: ["Cognizant", "Capgemini"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Square numbers"
  },
  {
    id: "lr-3",
    topic: "Blood Relations",
    topicId: "blood-relations",
    difficulty: "Medium",
    question: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
    options: ["Mother", "Grandmother", "Sister", "Aunt"],
    correctAnswer: 0,
    explanation: "Only daughter of my mother = the woman herself. So the man's mother is the woman. Hence, she is his mother.",
    shortcut: "Draw family tree step by step",
    timeLimit: 90,
    companies: ["Amazon", "Google", "Microsoft"],
    companyType: "Product-Based",
    year: 2025,
    conceptTested: "Family relations"
  },
  {
    id: "lr-4",
    topic: "Syllogism",
    topicId: "syllogism",
    difficulty: "Medium",
    question: "Statements: All cats are dogs. All dogs are animals. Conclusions: I. All cats are animals. II. All animals are cats.",
    options: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    correctAnswer: 0,
    explanation: "Cats ⊂ Dogs ⊂ Animals. So all cats are animals (I follows). But not all animals are cats (II doesn't follow).",
    shortcut: "Use Venn diagrams for syllogism",
    timeLimit: 75,
    companies: ["TCS", "Accenture", "Deloitte"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Logical deduction"
  },
  {
    id: "lr-5",
    topic: "Coding Decoding",
    topicId: "coding-decoding",
    difficulty: "Easy",
    question: "If APPLE is coded as ELPPA, how is MANGO coded?",
    options: ["OGNAM", "ONAGM", "NAMOG", "GOMAN"],
    correctAnswer: 0,
    explanation: "The word is reversed. MANGO reversed = OGNAM",
    shortcut: "Simple reverse pattern",
    timeLimit: 45,
    companies: ["Wipro", "HCL", "Tech Mahindra"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Reverse coding"
  },
  {
    id: "lr-6",
    topic: "Direction Sense",
    topicId: "direction-sense",
    difficulty: "Medium",
    question: "A man walks 5km North, turns right and walks 3km, turns right again and walks 5km. How far is he from starting point?",
    options: ["3 km", "5 km", "8 km", "0 km"],
    correctAnswer: 0,
    explanation: "After walking N 5km, E 3km, S 5km, he is 3km East of start. Distance = 3km",
    shortcut: "Draw the path on paper",
    timeLimit: 90,
    companies: ["Infosys", "Cognizant", "IBM"],
    companyType: "Service-Based",
    year: 2025,
    conceptTested: "Direction and distance"
  },
  {
    id: "lr-7",
    topic: "Seating Arrangement",
    topicId: "seating-arrangement",
    difficulty: "Hard",
    question: "Six people A, B, C, D, E, F sit in a row. A sits 3rd from left. B sits to immediate right of A. C sits at one of the ends. D doesn't sit next to C. Who sits at the right end?",
    options: ["Cannot be determined", "F", "E", "B"],
    correctAnswer: 0,
    explanation: "Multiple arrangements possible with given conditions. Right end could be E or F.",
    shortcut: "Check all possible arrangements systematically",
    timeLimit: 120,
    companies: ["Google", "Amazon", "Meta"],
    companyType: "Product-Based",
    year: 2026,
    conceptTested: "Linear arrangement"
  },
  {
    id: "lr-8",
    topic: "Puzzles",
    topicId: "puzzles",
    difficulty: "Hard",
    question: "If day after tomorrow is Saturday, what day was it 3 days before yesterday?",
    options: ["Sunday", "Monday", "Tuesday", "Wednesday"],
    correctAnswer: 1,
    explanation: "Day after tomorrow = Saturday. Today = Thursday. Yesterday = Wednesday. 3 days before = Monday",
    shortcut: "Work backwards step by step",
    timeLimit: 75,
    companies: ["Flipkart", "Walmart", "Adobe"],
    companyType: "Product-Based",
    year: 2024,
    conceptTested: "Calendar problems"
  },
  {
    id: "lr-9",
    topic: "Number Series",
    topicId: "number-series",
    difficulty: "Hard",
    question: "Find the next: 3, 5, 9, 17, 33, ?",
    options: ["49", "65", "57", "63"],
    correctAnswer: 1,
    explanation: "Pattern: ×2 - 1. 3×2-1=5, 5×2-1=9, 9×2-1=17, 17×2-1=33, 33×2-1=65",
    shortcut: "Look for multiplication pattern",
    timeLimit: 90,
    companies: ["Microsoft", "Oracle", "SAP"],
    companyType: "Product-Based",
    year: 2025,
    conceptTested: "Complex series"
  },
  {
    id: "lr-10",
    topic: "Blood Relations",
    topicId: "blood-relations",
    difficulty: "Easy",
    question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?",
    options: ["Granddaughter", "Daughter", "Grandmother", "Great granddaughter"],
    correctAnswer: 0,
    explanation: "D is C's father (A's grandfather). So A is D's granddaughter.",
    shortcut: "Draw family tree: E→D→C→B,A",
    timeLimit: 60,
    companies: ["EY", "KPMG", "PWC"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Multi-level relations"
  },
  {
    id: "lr-11",
    topic: "Coding Decoding",
    topicId: "coding-decoding",
    difficulty: "Medium",
    question: "If CAT = 24 and DOG = 26, what is PIG?",
    options: ["24", "26", "28", "32"],
    correctAnswer: 2,
    explanation: "CAT = 3+1+20=24. DOG = 4+15+7=26. PIG = 16+9+7=32",
    shortcut: "Sum of letter positions (A=1, B=2...)",
    timeLimit: 75,
    companies: ["TCS", "Infosys", "Accenture"],
    companyType: "Service-Based",
    year: 2025,
    conceptTested: "Letter value coding"
  },
  {
    id: "lr-12",
    topic: "Syllogism",
    topicId: "syllogism",
    difficulty: "Easy",
    question: "Statements: Some books are pens. All pens are pencils. Conclusions: I. Some books are pencils. II. All pencils are pens.",
    options: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    correctAnswer: 0,
    explanation: "Some books = pens, and all pens = pencils, so some books = pencils. But not all pencils are pens.",
    shortcut: "Venn diagram with overlapping sets",
    timeLimit: 60,
    companies: ["Capgemini", "HCL", "Wipro"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Some-All syllogism"
  },
  {
    id: "lr-13",
    topic: "Puzzles",
    topicId: "puzzles",
    difficulty: "Medium",
    question: "A clock shows 3:15. What is the angle between hour and minute hands?",
    options: ["0°", "7.5°", "52.5°", "37.5°"],
    correctAnswer: 1,
    explanation: "At 3:15, minute = 90°. Hour = 90° + (15/60×30°) = 97.5°. Angle = 7.5°",
    shortcut: "Hour moves 0.5°/min, minute moves 6°/min",
    timeLimit: 90,
    companies: ["Google", "Amazon", "Microsoft"],
    companyType: "Product-Based",
    year: 2025,
    conceptTested: "Clock angles"
  },
  {
    id: "lr-14",
    topic: "Direction Sense",
    topicId: "direction-sense",
    difficulty: "Easy",
    question: "Facing North, Ravi turns 90° clockwise, then 180°, then 90° anticlockwise. Which direction is he facing now?",
    options: ["North", "South", "East", "West"],
    correctAnswer: 1,
    explanation: "N → E (90° clockwise) → W (180°) → S (90° anticlockwise)",
    shortcut: "Track each turn on compass",
    timeLimit: 60,
    companies: ["Cognizant", "Tech Mahindra", "IBM"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Direction turns"
  },
  {
    id: "lr-15",
    topic: "Number Series",
    topicId: "number-series",
    difficulty: "Medium",
    question: "Find the odd one: 8, 27, 64, 100, 125, 216",
    options: ["27", "64", "100", "125"],
    correctAnswer: 2,
    explanation: "All are cubes except 100. 2³=8, 3³=27, 4³=64, 5³=125, 6³=216. 100 = 10²",
    shortcut: "Check if each is a perfect cube",
    timeLimit: 75,
    companies: ["PayPal", "Cisco", "Intel"],
    companyType: "Product-Based",
    year: 2025,
    conceptTested: "Odd one out - cubes"
  },
];

// Verbal Ability Questions (sample - additive content)
const verbalAbilityQuestions: PremiumAptitudeQuestion[] = [
  {
    id: "va-1",
    topic: "Synonyms",
    topicId: "synonyms-antonyms",
    difficulty: "Easy",
    question: "Choose the word most similar in meaning to BENEVOLENT:",
    options: ["Cruel", "Kind", "Angry", "Lazy"],
    correctAnswer: 1,
    explanation: "Benevolent means well-meaning and kindly. Kind is the closest synonym.",
    shortcut: "Bene- prefix means good/well",
    timeLimit: 30,
    companies: ["TCS", "Infosys", "Wipro"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Word meaning"
  },
  {
    id: "va-2",
    topic: "Antonyms",
    topicId: "synonyms-antonyms",
    difficulty: "Easy",
    question: "Choose the word opposite in meaning to ABUNDANT:",
    options: ["Plentiful", "Scarce", "Sufficient", "Excess"],
    correctAnswer: 1,
    explanation: "Abundant means plentiful. Scarce means insufficient/rare, the opposite.",
    shortcut: "Abundant = plenty, opposite = lack",
    timeLimit: 30,
    companies: ["Cognizant", "Accenture", "Capgemini"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Opposite meaning"
  },
  {
    id: "va-3",
    topic: "Sentence Correction",
    topicId: "sentence-correction",
    difficulty: "Medium",
    question: "Choose the correct sentence:",
    options: [
      "He is more taller than his brother.",
      "He is taller than his brother.",
      "He is much more tall than his brother.",
      "He is very taller than his brother."
    ],
    correctAnswer: 1,
    explanation: "Comparative adjectives don't use 'more' with '-er' form. 'Taller' is correct, not 'more taller'.",
    shortcut: "Never use 'more' with '-er' adjectives",
    timeLimit: 45,
    companies: ["Amazon", "Google", "Microsoft"],
    companyType: "Product-Based",
    year: 2025,
    conceptTested: "Comparative adjectives"
  },
  {
    id: "va-4",
    topic: "Fill Blanks",
    topicId: "fill-blanks",
    difficulty: "Medium",
    question: "The company's profits _____ by 20% last quarter due to _____ marketing strategies.",
    options: [
      "decreased, effective",
      "increased, ineffective",
      "increased, effective",
      "decreased, innovative"
    ],
    correctAnswer: 2,
    explanation: "Profits increase due to effective (successful) strategies, not ineffective ones.",
    shortcut: "Match cause and effect logically",
    timeLimit: 60,
    companies: ["Deloitte", "EY", "KPMG"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Context-based fill"
  },
  {
    id: "va-5",
    topic: "Idioms",
    topicId: "idioms-phrases",
    difficulty: "Easy",
    question: "What does 'break the ice' mean?",
    options: [
      "Literally break ice cubes",
      "Start a conversation in a social setting",
      "Cause damage",
      "Cool down"
    ],
    correctAnswer: 1,
    explanation: "'Break the ice' is an idiom meaning to initiate conversation and reduce tension.",
    shortcut: "Common interview/social idiom",
    timeLimit: 30,
    companies: ["TCS", "Wipro", "HCL"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Idiom meaning"
  },
  {
    id: "va-6",
    topic: "Para Jumbles",
    topicId: "para-jumbles",
    difficulty: "Hard",
    question: "Arrange: A) However, persistence led to success. B) The project started poorly. C) Finally, we achieved our goals. D) The team faced many obstacles.",
    options: ["BDAC", "DBAC", "ABCD", "CADB"],
    correctAnswer: 0,
    explanation: "Logical flow: B (started poorly) → D (obstacles) → A (but persistence) → C (achieved goals)",
    shortcut: "Find opening, link words, and conclusion",
    timeLimit: 90,
    companies: ["Flipkart", "Amazon", "Walmart"],
    companyType: "Product-Based",
    year: 2025,
    conceptTested: "Sentence arrangement"
  },
  {
    id: "va-7",
    topic: "Sentence Correction",
    topicId: "sentence-correction",
    difficulty: "Easy",
    question: "Identify the error: 'Each of the students have completed their assignments.'",
    options: [
      "Each of",
      "have completed",
      "their assignments",
      "No error"
    ],
    correctAnswer: 1,
    explanation: "'Each' is singular, so it should be 'has completed', not 'have completed'.",
    shortcut: "Each = singular = has",
    timeLimit: 45,
    companies: ["Infosys", "Tech Mahindra", "IBM"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Subject-verb agreement"
  },
  {
    id: "va-8",
    topic: "Synonyms",
    topicId: "synonyms-antonyms",
    difficulty: "Medium",
    question: "Choose the word most similar to METICULOUS:",
    options: ["Careless", "Detailed", "Quick", "Simple"],
    correctAnswer: 1,
    explanation: "Meticulous means showing great attention to detail. Detailed is the closest.",
    shortcut: "Meticulous = very careful/precise",
    timeLimit: 45,
    companies: ["Google", "Meta", "Apple"],
    companyType: "Product-Based",
    year: 2025,
    conceptTested: "Advanced vocabulary"
  },
  {
    id: "va-9",
    topic: "Reading Comprehension",
    topicId: "reading-comprehension",
    difficulty: "Hard",
    question: "Read: 'Technology has transformed education, making learning accessible globally. However, the digital divide remains a concern.' What is the main concern?",
    options: [
      "Technology is bad",
      "Education is too accessible",
      "Unequal access to technology",
      "Global learning is slow"
    ],
    correctAnswer: 2,
    explanation: "'Digital divide' refers to the gap between those with and without technology access.",
    shortcut: "Digital divide = inequality in tech access",
    timeLimit: 90,
    companies: ["Amazon", "Microsoft", "Oracle"],
    companyType: "Product-Based",
    year: 2024,
    conceptTested: "Inference from passage"
  },
  {
    id: "va-10",
    topic: "Idioms",
    topicId: "idioms-phrases",
    difficulty: "Medium",
    question: "What does 'bite the bullet' mean?",
    options: [
      "Eat quickly",
      "Face a difficult situation bravely",
      "Be aggressive",
      "Make a quick decision"
    ],
    correctAnswer: 1,
    explanation: "'Bite the bullet' means to endure a painful situation with courage.",
    shortcut: "Military origin - brace for pain",
    timeLimit: 45,
    companies: ["Accenture", "Cognizant", "Capgemini"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Idiom interpretation"
  },
  {
    id: "va-11",
    topic: "Antonyms",
    topicId: "synonyms-antonyms",
    difficulty: "Medium",
    question: "Choose the opposite of ELOQUENT:",
    options: ["Articulate", "Inarticulate", "Fluent", "Persuasive"],
    correctAnswer: 1,
    explanation: "Eloquent means fluent and persuasive in speaking. Inarticulate is the opposite.",
    shortcut: "In- prefix often means 'not'",
    timeLimit: 45,
    companies: ["PWC", "EY", "Deloitte"],
    companyType: "Service-Based",
    year: 2025,
    conceptTested: "Opposite with prefix"
  },
  {
    id: "va-12",
    topic: "Fill Blanks",
    topicId: "fill-blanks",
    difficulty: "Easy",
    question: "The manager _____ the team for their excellent performance.",
    options: ["criticized", "praised", "ignored", "questioned"],
    correctAnswer: 1,
    explanation: "Excellent performance would logically be followed by praise, not criticism.",
    shortcut: "Positive performance = positive response",
    timeLimit: 30,
    companies: ["TCS", "Infosys", "Wipro"],
    companyType: "Service-Based",
    year: 2024,
    conceptTested: "Logical word choice"
  },
  {
    id: "va-13",
    topic: "Sentence Correction",
    topicId: "sentence-correction",
    difficulty: "Hard",
    question: "Choose the correct sentence:",
    options: [
      "Neither the CEO nor the directors was present.",
      "Neither the CEO nor the directors were present.",
      "Neither the CEO nor the directors are present.",
      "Neither CEO nor directors was present."
    ],
    correctAnswer: 1,
    explanation: "With 'neither...nor', verb agrees with nearer subject. 'Directors' (plural) takes 'were'.",
    shortcut: "Neither/nor = verb matches closer noun",
    timeLimit: 60,
    companies: ["Samsung", "Intel", "Nvidia"],
    companyType: "Product-Based",
    year: 2026,
    conceptTested: "Correlative conjunctions"
  },
  {
    id: "va-14",
    topic: "Reading Comprehension",
    topicId: "reading-comprehension",
    difficulty: "Medium",
    question: "'Remote work offers flexibility but may impact team collaboration.' The passage suggests:",
    options: [
      "Remote work is entirely positive",
      "Remote work has both advantages and disadvantages",
      "Team collaboration is impossible remotely",
      "Flexibility is not important"
    ],
    correctAnswer: 1,
    explanation: "The use of 'but' indicates a contrast between benefit (flexibility) and drawback (collaboration impact).",
    shortcut: "'But' signals contrasting ideas",
    timeLimit: 60,
    companies: ["Meta", "Google", "Atlassian"],
    companyType: "Product-Based",
    year: 2025,
    conceptTested: "Tone and implication"
  },
  {
    id: "va-15",
    topic: "Para Jumbles",
    topicId: "para-jumbles",
    difficulty: "Medium",
    question: "Arrange: A) He started small. B) Now he runs a successful company. C) John always dreamed of entrepreneurship. D) His dedication paid off.",
    options: ["CADB", "ABCD", "CDAB", "DCBA"],
    correctAnswer: 0,
    explanation: "Flow: C (dream) → A (started small) → D (dedication) → B (success now)",
    shortcut: "Chronological order with linking words",
    timeLimit: 75,
    companies: ["PayPal", "Cisco", "ServiceNow"],
    companyType: "Product-Based",
    year: 2024,
    conceptTested: "Narrative sequence"
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  quantitative: <Calculator className="h-6 w-6" />,
  logical: <Brain className="h-6 w-6" />,
  verbal: <BookOpen className="h-6 w-6" />,
};

export default function AptitudeQuiz() {
  const navigate = useNavigate();
  const { categoryId, topicId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "quantitative");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(topicId || null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Get premium questions
  const premiumQuestions = useMemo(() => getAllPremiumQuestions(), []);

  // Get questions based on category
  const getQuestionsForCategory = (catId: string): PremiumAptitudeQuestion[] => {
    switch (catId) {
      case "quantitative":
        return premiumQuestions;
      case "logical":
        return logicalReasoningQuestions;
      case "verbal":
        return verbalAbilityQuestions;
      default:
        return premiumQuestions;
    }
  };

  // Get questions for selected topic
  const getQuestionsForTopic = (catId: string, topId: string): PremiumAptitudeQuestion[] => {
    const allQuestions = getQuestionsForCategory(catId);
    return allQuestions.filter((q) => q.topicId === topId);
  };

  const currentCategory = aptitudeCategories.find((c) => c.id === selectedCategory);

  const handleTopicSelect = (topId: string) => {
    setSelectedTopic(topId);
    setShowQuiz(true);
  };

  const handleBack = () => {
    if (showQuiz) {
      setShowQuiz(false);
      setSelectedTopic(null);
    } else {
      navigate("/aptitude");
    }
  };

  const handleCategoryQuiz = () => {
    setSelectedTopic(null);
    setShowQuiz(true);
  };

  if (showQuiz) {
    const quizQuestions = selectedTopic
      ? getQuestionsForTopic(selectedCategory, selectedTopic)
      : getQuestionsForCategory(selectedCategory);

    const topicName = selectedTopic
      ? currentCategory?.topics.find((t) => t.id === selectedTopic)?.name
      : undefined;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
            <PracticeQuiz
              questions={quizQuestions.length > 0 ? quizQuestions : premiumQuestions.slice(0, 15)}
              categoryName={currentCategory?.name || "Quantitative Aptitude"}
              topicName={topicName}
              onBack={handleBack}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/aptitude")} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              Practice Quiz Center
            </h1>
            <p className="text-muted-foreground">
              Master placement aptitude with topic-wise and company-based practice
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="w-full justify-center flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
              {aptitudeCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 px-6 py-3"
                >
                  {categoryIcons[category.id]}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {aptitudeCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0 animate-fade-in">
                {/* Quick Start */}
                <Card className="mb-6 border-primary/30 bg-gradient-to-r from-primary/10 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <Star className="w-5 h-5 text-[hsl(var(--warning))]" />
                          Quick {category.name} Quiz
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          Take a 15-question mixed quiz from all topics
                        </p>
                      </div>
                      <Button onClick={handleCategoryQuiz} className="gap-2">
                        Start Mixed Quiz
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Topics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.topics.map((topic) => {
                    const topicQuestions = getQuestionsForTopic(category.id, topic.id);
                    const hasQuestions = topicQuestions.length > 0;

                    return (
                      <Card
                        key={topic.id}
                        className={cn(
                          "transition-all hover:border-primary/50 hover:shadow-lg",
                          hasQuestions ? "cursor-pointer" : "opacity-60"
                        )}
                        onClick={() => hasQuestions && handleTopicSelect(topic.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{topic.name}</CardTitle>
                            <Badge variant="secondary">
                              {hasQuestions ? `${topicQuestions.length} Q` : "Coming Soon"}
                            </Badge>
                          </div>
                          <CardDescription>{topic.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {hasQuestions && (
                            <>
                              <div className="flex gap-2 mb-3">
                                <Badge variant="outline" className="text-xs bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">
                                  Easy: {topicQuestions.filter((q) => q.difficulty === "Easy").length}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]">
                                  Medium: {topicQuestions.filter((q) => q.difficulty === "Medium").length}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive">
                                  Hard: {topicQuestions.filter((q) => q.difficulty === "Hard").length}
                                </Badge>
                              </div>
                              <Button variant="outline" size="sm" className="w-full gap-2">
                                Practice Now
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
