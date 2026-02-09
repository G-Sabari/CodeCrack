// Weekly Contest System - Mock Data & Configuration
// Extension module - does not modify existing files

export interface ContestParticipant {
  id: string;
  name: string;
  aptitudeScore: number;
  codingScore: number;
  totalScore: number;
  timeTaken: number; // in minutes
  rank: number;
  aptitudeAccuracy: number;
  codingProblems: number;
}

export interface WeeklyContest {
  id: string;
  week: number;
  year: number;
  startTime: string;
  endTime: string;
  status: "upcoming" | "live" | "completed";
  aptitudeQuestions: number;
  codingProblems: number;
  participants: number;
  duration: number; // minutes
}

// 27 mock participants
export const mockParticipants: ContestParticipant[] = [
  { id: "1", name: "Sabari", aptitudeScore: 92, codingScore: 85, totalScore: 177, timeTaken: 48, rank: 1, aptitudeAccuracy: 92, codingProblems: 4 },
  { id: "2", name: "Prasanna", aptitudeScore: 88, codingScore: 90, totalScore: 178, timeTaken: 52, rank: 2, aptitudeAccuracy: 88, codingProblems: 4 },
  { id: "3", name: "Yogesh", aptitudeScore: 85, codingScore: 88, totalScore: 173, timeTaken: 45, rank: 3, aptitudeAccuracy: 85, codingProblems: 4 },
  { id: "4", name: "Nissan", aptitudeScore: 82, codingScore: 80, totalScore: 162, timeTaken: 50, rank: 4, aptitudeAccuracy: 82, codingProblems: 3 },
  { id: "5", name: "Abu Faizil", aptitudeScore: 78, codingScore: 85, totalScore: 163, timeTaken: 55, rank: 5, aptitudeAccuracy: 78, codingProblems: 4 },
  { id: "6", name: "Shyam Sundar", aptitudeScore: 90, codingScore: 70, totalScore: 160, timeTaken: 42, rank: 6, aptitudeAccuracy: 90, codingProblems: 3 },
  { id: "7", name: "Balakumar", aptitudeScore: 75, codingScore: 82, totalScore: 157, timeTaken: 58, rank: 7, aptitudeAccuracy: 75, codingProblems: 3 },
  { id: "8", name: "Abhisekh", aptitudeScore: 80, codingScore: 75, totalScore: 155, timeTaken: 47, rank: 8, aptitudeAccuracy: 80, codingProblems: 3 },
  { id: "9", name: "Sabarinathan", aptitudeScore: 72, codingScore: 80, totalScore: 152, timeTaken: 53, rank: 9, aptitudeAccuracy: 72, codingProblems: 3 },
  { id: "10", name: "Nagulan", aptitudeScore: 85, codingScore: 65, totalScore: 150, timeTaken: 40, rank: 10, aptitudeAccuracy: 85, codingProblems: 3 },
  { id: "11", name: "Premkumar", aptitudeScore: 70, codingScore: 78, totalScore: 148, timeTaken: 56, rank: 11, aptitudeAccuracy: 70, codingProblems: 3 },
  { id: "12", name: "Murali", aptitudeScore: 76, codingScore: 70, totalScore: 146, timeTaken: 49, rank: 12, aptitudeAccuracy: 76, codingProblems: 3 },
  { id: "13", name: "Gokulrraj", aptitudeScore: 68, codingScore: 75, totalScore: 143, timeTaken: 54, rank: 13, aptitudeAccuracy: 68, codingProblems: 3 },
  { id: "14", name: "Sanjay", aptitudeScore: 74, codingScore: 68, totalScore: 142, timeTaken: 51, rank: 14, aptitudeAccuracy: 74, codingProblems: 2 },
  { id: "15", name: "Jeevarathinam", aptitudeScore: 65, codingScore: 75, totalScore: 140, timeTaken: 57, rank: 15, aptitudeAccuracy: 65, codingProblems: 3 },
  { id: "16", name: "Selvendran", aptitudeScore: 72, codingScore: 66, totalScore: 138, timeTaken: 46, rank: 16, aptitudeAccuracy: 72, codingProblems: 2 },
  { id: "17", name: "Dhinesh", aptitudeScore: 60, codingScore: 76, totalScore: 136, timeTaken: 59, rank: 17, aptitudeAccuracy: 60, codingProblems: 3 },
  { id: "18", name: "Gokul", aptitudeScore: 70, codingScore: 64, totalScore: 134, timeTaken: 44, rank: 18, aptitudeAccuracy: 70, codingProblems: 2 },
  { id: "19", name: "Tinakaran", aptitudeScore: 58, codingScore: 72, totalScore: 130, timeTaken: 55, rank: 19, aptitudeAccuracy: 58, codingProblems: 3 },
  { id: "20", name: "Prince Samuel", aptitudeScore: 66, codingScore: 62, totalScore: 128, timeTaken: 48, rank: 20, aptitudeAccuracy: 66, codingProblems: 2 },
  { id: "21", name: "Ratish", aptitudeScore: 55, codingScore: 70, totalScore: 125, timeTaken: 52, rank: 21, aptitudeAccuracy: 55, codingProblems: 3 },
  { id: "22", name: "Prawin Rajulu", aptitudeScore: 62, codingScore: 60, totalScore: 122, timeTaken: 50, rank: 22, aptitudeAccuracy: 62, codingProblems: 2 },
  { id: "23", name: "Ajith", aptitudeScore: 50, codingScore: 68, totalScore: 118, timeTaken: 58, rank: 23, aptitudeAccuracy: 50, codingProblems: 2 },
  { id: "24", name: "Harish", aptitudeScore: 58, codingScore: 55, totalScore: 113, timeTaken: 43, rank: 24, aptitudeAccuracy: 58, codingProblems: 2 },
  { id: "25", name: "Himalkumar", aptitudeScore: 48, codingScore: 62, totalScore: 110, timeTaken: 56, rank: 25, aptitudeAccuracy: 48, codingProblems: 2 },
  { id: "26", name: "Mohammed Aadil", aptitudeScore: 52, codingScore: 52, totalScore: 104, timeTaken: 47, rank: 26, aptitudeAccuracy: 52, codingProblems: 1 },
  { id: "27", name: "Thrisyanth", aptitudeScore: 45, codingScore: 55, totalScore: 100, timeTaken: 60, rank: 27, aptitudeAccuracy: 45, codingProblems: 1 },
];

// Sort by totalScore desc, then timeTaken asc
export const rankedParticipants = [...mockParticipants].sort((a, b) => {
  if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
  return a.timeTaken - b.timeTaken;
}).map((p, i) => ({ ...p, rank: i + 1 }));

export const currentWeekContest: WeeklyContest = {
  id: "wc-2026-06",
  week: 6,
  year: 2026,
  startTime: getNextWeekendDate("saturday", 10), // 10 AM Saturday
  endTime: getNextWeekendDate("saturday", 12), // 12 PM Saturday
  status: getContestStatus(),
  aptitudeQuestions: 50,
  codingProblems: 4,
  participants: 27,
  duration: 120,
};

export const pastContests: WeeklyContest[] = [
  { id: "wc-2026-05", week: 5, year: 2026, startTime: "2026-02-01T10:00:00", endTime: "2026-02-01T12:00:00", status: "completed", aptitudeQuestions: 50, codingProblems: 4, participants: 24, duration: 120 },
  { id: "wc-2026-04", week: 4, year: 2026, startTime: "2026-01-25T10:00:00", endTime: "2026-01-25T12:00:00", status: "completed", aptitudeQuestions: 50, codingProblems: 3, participants: 22, duration: 120 },
  { id: "wc-2026-03", week: 3, year: 2026, startTime: "2026-01-18T10:00:00", endTime: "2026-01-18T12:00:00", status: "completed", aptitudeQuestions: 50, codingProblems: 4, participants: 25, duration: 120 },
];

function getNextWeekendDate(day: "saturday" | "sunday", hour: number): string {
  const now = new Date();
  const dayIndex = day === "saturday" ? 6 : 0;
  const diff = (dayIndex - now.getDay() + 7) % 7 || 7;
  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + diff);
  nextDay.setHours(hour, 0, 0, 0);
  return nextDay.toISOString();
}

function getContestStatus(): "upcoming" | "live" | "completed" {
  const now = new Date();
  const day = now.getDay();
  // Saturday = 6, Sunday = 0
  if (day === 6 || day === 0) {
    const hour = now.getHours();
    if (hour >= 10 && hour < 12) return "live";
  }
  return "upcoming";
}

export function getCountdownToContest(): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const startTime = new Date(currentWeekContest.startTime);
  const diff = Math.max(0, startTime.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// Company simulation tags
export const companyContestProfiles: Record<string, { aptitudeWeight: number; codingWeight: number }> = {
  "TCS": { aptitudeWeight: 0.7, codingWeight: 0.3 },
  "Infosys": { aptitudeWeight: 0.65, codingWeight: 0.35 },
  "Wipro": { aptitudeWeight: 0.7, codingWeight: 0.3 },
  "Accenture": { aptitudeWeight: 0.6, codingWeight: 0.4 },
  "Cognizant": { aptitudeWeight: 0.65, codingWeight: 0.35 },
  "Google": { aptitudeWeight: 0.2, codingWeight: 0.8 },
  "Amazon": { aptitudeWeight: 0.25, codingWeight: 0.75 },
  "Microsoft": { aptitudeWeight: 0.3, codingWeight: 0.7 },
  "Meta": { aptitudeWeight: 0.2, codingWeight: 0.8 },
  "Adobe": { aptitudeWeight: 0.35, codingWeight: 0.65 },
};
