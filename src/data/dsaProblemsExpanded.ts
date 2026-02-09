// Expanded DSA Problem Library - 100+ curated placement-grade problems
// This module extends the existing problem library without modifying original files

export interface ExpandedProblem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  company: string;
  companies: string[];
  frequency: "high" | "medium" | "low";
  solved: boolean;
  pattern: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  explanation: string;
  referenceLink: string;
  timeComplexity: string;
  spaceComplexity: string;
  hints: string[];
}

export const expandedProblems: ExpandedProblem[] = [
  // ===== ARRAYS =====
  {
    id: 11, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Arrays",
    company: "Amazon", companies: ["Amazon", "Microsoft", "Google", "Meta"], frequency: "high", solved: false, pattern: "Sliding Window",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    inputFormat: "An array of integers prices", outputFormat: "Maximum profit integer",
    constraints: "1 <= prices.length <= 10^5, 0 <= prices[i] <= 10^4",
    sampleInput: "[7,1,5,3,6,4]", sampleOutput: "5",
    explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
    referenceLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Track minimum price seen so far", "At each step, calculate potential profit"]
  },
  {
    id: 12, title: "Maximum Subarray (Kadane's Algorithm)", difficulty: "Medium", topic: "Arrays",
    company: "Google", companies: ["Google", "Amazon", "Microsoft", "Adobe"], frequency: "high", solved: false, pattern: "Dynamic Programming",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    inputFormat: "An array of integers nums", outputFormat: "Maximum subarray sum",
    constraints: "1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4",
    sampleInput: "[-2,1,-3,4,-1,2,1,-5,4]", sampleOutput: "6",
    explanation: "The subarray [4,-1,2,1] has the largest sum = 6.",
    referenceLink: "https://leetcode.com/problems/maximum-subarray/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Use Kadane's algorithm", "Reset current sum when it goes negative"]
  },
  {
    id: 13, title: "Container With Most Water", difficulty: "Medium", topic: "Arrays",
    company: "Meta", companies: ["Meta", "Amazon", "Google"], frequency: "high", solved: false, pattern: "Two Pointer",
    description: "Given n non-negative integers a1, a2, ..., an where each represents a point at coordinate (i, ai). Find two lines that together with the x-axis form a container that holds the most water.",
    inputFormat: "Array of heights", outputFormat: "Maximum water area",
    constraints: "n >= 2, 0 <= height[i] <= 10^4",
    sampleInput: "[1,8,6,2,5,4,8,3,7]", sampleOutput: "49",
    explanation: "The lines at index 1 and 8 form a container with area min(8,7)*7 = 49.",
    referenceLink: "https://leetcode.com/problems/container-with-most-water/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Use two pointers from both ends", "Move the pointer with smaller height"]
  },
  {
    id: 14, title: "Product of Array Except Self", difficulty: "Medium", topic: "Arrays",
    company: "Microsoft", companies: ["Microsoft", "Amazon", "Apple", "Meta"], frequency: "high", solved: false, pattern: "Prefix Sum",
    description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i]. You must solve it without division and in O(n) time.",
    inputFormat: "Array of integers", outputFormat: "Product array",
    constraints: "2 <= nums.length <= 10^5",
    sampleInput: "[1,2,3,4]", sampleOutput: "[24,12,8,6]",
    explanation: "Use prefix and suffix products to compute the result without division.",
    referenceLink: "https://leetcode.com/problems/product-of-array-except-self/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Calculate prefix products first", "Then multiply with suffix products in reverse"]
  },
  {
    id: 15, title: "3Sum", difficulty: "Medium", topic: "Arrays",
    company: "Amazon", companies: ["Amazon", "Meta", "Google", "Adobe"], frequency: "high", solved: false, pattern: "Two Pointer",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0.",
    inputFormat: "Array of integers", outputFormat: "List of triplets",
    constraints: "3 <= nums.length <= 3000, -10^5 <= nums[i] <= 10^5",
    sampleInput: "[-1,0,1,2,-1,-4]", sampleOutput: "[[-1,-1,2],[-1,0,1]]",
    explanation: "Sort the array, fix one element, then use two pointers on the rest.",
    referenceLink: "https://leetcode.com/problems/3sum/",
    timeComplexity: "O(n²)", spaceComplexity: "O(1)", hints: ["Sort the array first", "Skip duplicates to avoid repeated triplets"]
  },
  {
    id: 16, title: "Next Permutation", difficulty: "Medium", topic: "Arrays",
    company: "Google", companies: ["Google", "Amazon", "Microsoft"], frequency: "medium", solved: false, pattern: "Array Manipulation",
    description: "Find the next lexicographically greater permutation of an array of integers. If not possible, rearrange to the lowest possible order.",
    inputFormat: "Array of integers", outputFormat: "Modified array in-place",
    constraints: "1 <= nums.length <= 100",
    sampleInput: "[1,2,3]", sampleOutput: "[1,3,2]",
    explanation: "Find the first decreasing element from right, swap with the next larger element, reverse the suffix.",
    referenceLink: "https://leetcode.com/problems/next-permutation/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Find the pivot point", "Reverse the suffix after swapping"]
  },
  {
    id: 17, title: "Merge Intervals", difficulty: "Medium", topic: "Arrays",
    company: "Meta", companies: ["Meta", "Google", "Amazon", "Microsoft"], frequency: "high", solved: false, pattern: "Sorting",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    inputFormat: "Array of interval pairs", outputFormat: "Array of merged intervals",
    constraints: "1 <= intervals.length <= 10^4",
    sampleInput: "[[1,3],[2,6],[8,10],[15,18]]", sampleOutput: "[[1,6],[8,10],[15,18]]",
    explanation: "Sort by start time, then merge intervals that overlap.",
    referenceLink: "https://leetcode.com/problems/merge-intervals/",
    timeComplexity: "O(n log n)", spaceComplexity: "O(n)", hints: ["Sort intervals by start time", "Compare current interval end with next start"]
  },
  {
    id: 18, title: "First Missing Positive", difficulty: "Hard", topic: "Arrays",
    company: "Amazon", companies: ["Amazon", "Google", "Microsoft"], frequency: "medium", solved: false, pattern: "Cyclic Sort",
    description: "Given an unsorted integer array nums, return the smallest missing positive integer. Must run in O(n) time and O(1) auxiliary space.",
    inputFormat: "Unsorted integer array", outputFormat: "Smallest missing positive",
    constraints: "1 <= nums.length <= 10^5",
    sampleInput: "[3,4,-1,1]", sampleOutput: "2",
    explanation: "Place each number at its correct index (1 at index 0, 2 at index 1...), then find first mismatch.",
    referenceLink: "https://leetcode.com/problems/first-missing-positive/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Use cyclic sort / index marking", "Numbers > n or <= 0 can be ignored"]
  },
  {
    id: 19, title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Arrays",
    company: "Google", companies: ["Google", "Amazon", "Microsoft", "Apple"], frequency: "high", solved: false, pattern: "Binary Search",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays in O(log(m+n)) time.",
    inputFormat: "Two sorted arrays", outputFormat: "Median value (double)",
    constraints: "0 <= m, n <= 1000, 1 <= m + n <= 2000",
    sampleInput: "nums1 = [1,3], nums2 = [2]", sampleOutput: "2.0",
    explanation: "Binary search on the smaller array to partition both arrays correctly.",
    referenceLink: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    timeComplexity: "O(log(min(m,n)))", spaceComplexity: "O(1)", hints: ["Binary search on the smaller array", "Ensure partition condition: maxLeft <= minRight"]
  },

  // ===== STRINGS =====
  {
    id: 20, title: "Valid Anagram", difficulty: "Easy", topic: "Strings",
    company: "TCS", companies: ["TCS", "Infosys", "Wipro", "Amazon"], frequency: "high", solved: false, pattern: "Hashing",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    inputFormat: "Two strings s, t", outputFormat: "Boolean",
    constraints: "1 <= s.length, t.length <= 5*10^4",
    sampleInput: 's = "anagram", t = "nagaram"', sampleOutput: "true",
    explanation: "Count character frequencies in both strings and compare.",
    referenceLink: "https://leetcode.com/problems/valid-anagram/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Use a frequency counter array of size 26"]
  },
  {
    id: 21, title: "Longest Palindromic Substring", difficulty: "Medium", topic: "Strings",
    company: "Amazon", companies: ["Amazon", "Microsoft", "Google", "Adobe"], frequency: "high", solved: false, pattern: "Expand Around Center",
    description: "Given a string s, return the longest palindromic substring in s.",
    inputFormat: "String s", outputFormat: "Longest palindromic substring",
    constraints: "1 <= s.length <= 1000",
    sampleInput: '"babad"', sampleOutput: '"bab" or "aba"',
    explanation: "Expand around each center (both odd and even length palindromes).",
    referenceLink: "https://leetcode.com/problems/longest-palindromic-substring/",
    timeComplexity: "O(n²)", spaceComplexity: "O(1)", hints: ["Try expanding from each character as center", "Handle both odd and even length cases"]
  },
  {
    id: 22, title: "Group Anagrams", difficulty: "Medium", topic: "Strings",
    company: "Meta", companies: ["Meta", "Amazon", "Google"], frequency: "high", solved: false, pattern: "Hashing",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    inputFormat: "Array of strings", outputFormat: "Grouped anagrams",
    constraints: '1 <= strs.length <= 10^4',
    sampleInput: '["eat","tea","tan","ate","nat","bat"]', sampleOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
    explanation: "Use sorted string as key in a hash map to group anagrams.",
    referenceLink: "https://leetcode.com/problems/group-anagrams/",
    timeComplexity: "O(n * k log k)", spaceComplexity: "O(n * k)", hints: ["Sort each string to create a key", "Use a hashmap with sorted key"]
  },
  {
    id: 23, title: "Minimum Window Substring", difficulty: "Hard", topic: "Strings",
    company: "Google", companies: ["Google", "Meta", "Amazon", "Microsoft"], frequency: "high", solved: false, pattern: "Sliding Window",
    description: "Given two strings s and t, return the minimum window substring of s such that every character in t is included in the window.",
    inputFormat: "Two strings s, t", outputFormat: "Minimum window substring",
    constraints: "1 <= s.length, t.length <= 10^5",
    sampleInput: 's = "ADOBECODEBANC", t = "ABC"', sampleOutput: '"BANC"',
    explanation: "Use sliding window with two pointers and a frequency map.",
    referenceLink: "https://leetcode.com/problems/minimum-window-substring/",
    timeComplexity: "O(n)", spaceComplexity: "O(k)", hints: ["Expand right pointer to include all chars", "Shrink left pointer to minimize window"]
  },

  // ===== LINKED LIST =====
  {
    id: 24, title: "Detect Cycle in Linked List", difficulty: "Easy", topic: "Linked List",
    company: "TCS", companies: ["TCS", "Infosys", "Amazon", "Microsoft"], frequency: "high", solved: false, pattern: "Two Pointer",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    inputFormat: "Head of linked list", outputFormat: "Boolean",
    constraints: "0 <= n <= 10^4",
    sampleInput: "[3,2,0,-4], pos = 1", sampleOutput: "true",
    explanation: "Use Floyd's cycle detection (slow and fast pointers).",
    referenceLink: "https://leetcode.com/problems/linked-list-cycle/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Use slow and fast pointers", "If they meet, there's a cycle"]
  },
  {
    id: 25, title: "Merge K Sorted Lists", difficulty: "Hard", topic: "Linked List",
    company: "Amazon", companies: ["Amazon", "Google", "Meta", "Microsoft"], frequency: "high", solved: false, pattern: "Heap",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.",
    inputFormat: "Array of k sorted linked lists", outputFormat: "Single merged sorted list",
    constraints: "k == lists.length, 0 <= k <= 10^4",
    sampleInput: "[[1,4,5],[1,3,4],[2,6]]", sampleOutput: "[1,1,2,3,4,4,5,6]",
    explanation: "Use a min-heap to always pick the smallest head across all lists.",
    referenceLink: "https://leetcode.com/problems/merge-k-sorted-lists/",
    timeComplexity: "O(N log k)", spaceComplexity: "O(k)", hints: ["Use a priority queue / min-heap", "Always poll the minimum and advance that list"]
  },
  {
    id: 26, title: "Remove Nth Node From End", difficulty: "Medium", topic: "Linked List",
    company: "Microsoft", companies: ["Microsoft", "Amazon", "Adobe"], frequency: "medium", solved: false, pattern: "Two Pointer",
    description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    inputFormat: "Head node and integer n", outputFormat: "Modified list head",
    constraints: "1 <= sz <= 30, 1 <= n <= sz",
    sampleInput: "[1,2,3,4,5], n = 2", sampleOutput: "[1,2,3,5]",
    explanation: "Use two pointers with n gap between them.",
    referenceLink: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Advance fast pointer n steps first", "Then move both until fast reaches end"]
  },

  // ===== STACK =====
  {
    id: 27, title: "Min Stack", difficulty: "Medium", topic: "Stack",
    company: "Amazon", companies: ["Amazon", "Microsoft", "Google"], frequency: "high", solved: false, pattern: "Stack",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    inputFormat: "Stack operations", outputFormat: "Results of operations",
    constraints: "-2^31 <= val <= 2^31 - 1",
    sampleInput: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()", sampleOutput: "-3, 0, -2",
    explanation: "Maintain an auxiliary stack that tracks the minimum at each level.",
    referenceLink: "https://leetcode.com/problems/min-stack/",
    timeComplexity: "O(1) per operation", spaceComplexity: "O(n)", hints: ["Use two stacks", "Track minimum alongside each push"]
  },
  {
    id: 28, title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack",
    company: "Google", companies: ["Google", "Amazon", "Microsoft"], frequency: "high", solved: false, pattern: "Monotonic Stack",
    description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    inputFormat: "Array of heights", outputFormat: "Maximum rectangle area",
    constraints: "1 <= heights.length <= 10^5",
    sampleInput: "[2,1,5,6,2,3]", sampleOutput: "10",
    explanation: "Use a monotonic stack to find nearest smaller on left and right for each bar.",
    referenceLink: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    timeComplexity: "O(n)", spaceComplexity: "O(n)", hints: ["Use a monotonic increasing stack", "Pop when current height < stack top"]
  },
  {
    id: 29, title: "Daily Temperatures", difficulty: "Medium", topic: "Stack",
    company: "Meta", companies: ["Meta", "Amazon", "Google"], frequency: "medium", solved: false, pattern: "Monotonic Stack",
    description: "Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
    inputFormat: "Array of temperatures", outputFormat: "Array of wait days",
    constraints: "1 <= temperatures.length <= 10^5",
    sampleInput: "[73,74,75,71,69,72,76,73]", sampleOutput: "[1,1,4,2,1,1,0,0]",
    explanation: "Use a stack to track indices of unresolved temperatures.",
    referenceLink: "https://leetcode.com/problems/daily-temperatures/",
    timeComplexity: "O(n)", spaceComplexity: "O(n)", hints: ["Use a decreasing monotonic stack of indices"]
  },

  // ===== QUEUE =====
  {
    id: 30, title: "Implement Queue using Stacks", difficulty: "Easy", topic: "Queue",
    company: "TCS", companies: ["TCS", "Infosys", "Amazon"], frequency: "medium", solved: false, pattern: "Stack",
    description: "Implement a first in first out (FIFO) queue using only two stacks.",
    inputFormat: "Queue operations", outputFormat: "Results of operations",
    constraints: "1 <= x <= 9, At most 100 calls",
    sampleInput: "push(1), push(2), peek(), pop(), empty()", sampleOutput: "1, 1, false",
    explanation: "Use two stacks: one for push, transfer to second for pop/peek.",
    referenceLink: "https://leetcode.com/problems/implement-queue-using-stacks/",
    timeComplexity: "O(1) amortized", spaceComplexity: "O(n)", hints: ["Use lazy transfer between stacks"]
  },
  {
    id: 31, title: "Sliding Window Maximum", difficulty: "Hard", topic: "Queue",
    company: "Google", companies: ["Google", "Amazon", "Microsoft", "Meta"], frequency: "high", solved: false, pattern: "Monotonic Deque",
    description: "Given an array nums and a sliding window of size k, return the max sliding window.",
    inputFormat: "Array and window size k", outputFormat: "Array of maximums",
    constraints: "1 <= nums.length <= 10^5, 1 <= k <= nums.length",
    sampleInput: "nums = [1,3,-1,-3,5,3,6,7], k = 3", sampleOutput: "[3,3,5,5,6,7]",
    explanation: "Use a monotonic decreasing deque to maintain potential maximums.",
    referenceLink: "https://leetcode.com/problems/sliding-window-maximum/",
    timeComplexity: "O(n)", spaceComplexity: "O(k)", hints: ["Use a deque to maintain decreasing order", "Remove elements outside window from front"]
  },

  // ===== TREES =====
  {
    id: 32, title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "Trees",
    company: "TCS", companies: ["TCS", "Amazon", "Microsoft"], frequency: "high", solved: false, pattern: "DFS",
    description: "Given the root of a binary tree, return its maximum depth.",
    inputFormat: "Root of binary tree", outputFormat: "Maximum depth integer",
    constraints: "0 <= n <= 10^4",
    sampleInput: "[3,9,20,null,null,15,7]", sampleOutput: "3",
    explanation: "Recursively find max(left depth, right depth) + 1.",
    referenceLink: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    timeComplexity: "O(n)", spaceComplexity: "O(h)", hints: ["Base case: null node returns 0", "Return 1 + max(left, right)"]
  },
  {
    id: 33, title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Trees",
    company: "Amazon", companies: ["Amazon", "Microsoft", "Google"], frequency: "high", solved: false, pattern: "DFS",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    inputFormat: "Root of binary tree", outputFormat: "Boolean",
    constraints: "1 <= n <= 10^4",
    sampleInput: "[2,1,3]", sampleOutput: "true",
    explanation: "Use in-order traversal or pass min/max bounds recursively.",
    referenceLink: "https://leetcode.com/problems/validate-binary-search-tree/",
    timeComplexity: "O(n)", spaceComplexity: "O(h)", hints: ["Pass valid range (min, max) to each node", "In-order traversal should be strictly increasing"]
  },
  {
    id: 34, title: "Lowest Common Ancestor of BST", difficulty: "Medium", topic: "Trees",
    company: "Meta", companies: ["Meta", "Amazon", "Microsoft"], frequency: "high", solved: false, pattern: "BST",
    description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes.",
    inputFormat: "Root, node p, node q", outputFormat: "LCA node",
    constraints: "2 <= n <= 10^5",
    sampleInput: "root = [6,2,8,0,4,7,9], p = 2, q = 8", sampleOutput: "6",
    explanation: "If both p and q < root, go left. If both > root, go right. Otherwise, root is LCA.",
    referenceLink: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    timeComplexity: "O(h)", spaceComplexity: "O(1)", hints: ["Leverage BST property", "Split point is the LCA"]
  },
  {
    id: 35, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Trees",
    company: "Google", companies: ["Google", "Amazon", "Meta", "Microsoft"], frequency: "high", solved: false, pattern: "BFS/DFS",
    description: "Design an algorithm to serialize and deserialize a binary tree.",
    inputFormat: "Binary tree root", outputFormat: "String / Tree",
    constraints: "0 <= n <= 10^4",
    sampleInput: "[1,2,3,null,null,4,5]", sampleOutput: '"1,2,null,null,3,4,null,null,5,null,null"',
    explanation: "Use preorder traversal for serialization, reconstruct using queue for deserialization.",
    referenceLink: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    timeComplexity: "O(n)", spaceComplexity: "O(n)", hints: ["Use preorder DFS with null markers", "Use a queue/index for deserialization"]
  },
  {
    id: 36, title: "Binary Tree Right Side View", difficulty: "Medium", topic: "Trees",
    company: "Amazon", companies: ["Amazon", "Meta", "Microsoft"], frequency: "medium", solved: false, pattern: "BFS",
    description: "Given the root of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.",
    inputFormat: "Root of binary tree", outputFormat: "Array of node values",
    constraints: "0 <= n <= 100",
    sampleInput: "[1,2,3,null,5,null,4]", sampleOutput: "[1,3,4]",
    explanation: "BFS level by level, take the last node of each level.",
    referenceLink: "https://leetcode.com/problems/binary-tree-right-side-view/",
    timeComplexity: "O(n)", spaceComplexity: "O(n)", hints: ["Use BFS with level tracking", "Take the rightmost element per level"]
  },

  // ===== GRAPHS =====
  {
    id: 37, title: "Clone Graph", difficulty: "Medium", topic: "Graphs",
    company: "Meta", companies: ["Meta", "Amazon", "Google"], frequency: "high", solved: false, pattern: "DFS/BFS",
    description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
    inputFormat: "Node reference", outputFormat: "Cloned graph node",
    constraints: "1 <= n <= 100",
    sampleInput: "[[2,4],[1,3],[2,4],[1,3]]", sampleOutput: "[[2,4],[1,3],[2,4],[1,3]]",
    explanation: "Use DFS/BFS with a hashmap mapping old nodes to new cloned nodes.",
    referenceLink: "https://leetcode.com/problems/clone-graph/",
    timeComplexity: "O(V+E)", spaceComplexity: "O(V)", hints: ["Use a visited hashmap to avoid cycles", "Clone neighbors recursively"]
  },
  {
    id: 38, title: "Course Schedule", difficulty: "Medium", topic: "Graphs",
    company: "Amazon", companies: ["Amazon", "Google", "Microsoft", "Meta"], frequency: "high", solved: false, pattern: "Topological Sort",
    description: "There are a total of numCourses courses. Some courses have prerequisites. Determine if it is possible to finish all courses.",
    inputFormat: "numCourses, prerequisites array", outputFormat: "Boolean",
    constraints: "1 <= numCourses <= 2000",
    sampleInput: "numCourses = 2, prerequisites = [[1,0]]", sampleOutput: "true",
    explanation: "Detect cycle in directed graph using DFS or BFS (Kahn's algorithm).",
    referenceLink: "https://leetcode.com/problems/course-schedule/",
    timeComplexity: "O(V+E)", spaceComplexity: "O(V+E)", hints: ["Build adjacency list", "Detect cycle using topological sort"]
  },
  {
    id: 39, title: "Word Ladder", difficulty: "Hard", topic: "Graphs",
    company: "Google", companies: ["Google", "Amazon", "Meta"], frequency: "medium", solved: false, pattern: "BFS",
    description: "Given two words beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence.",
    inputFormat: "beginWord, endWord, wordList", outputFormat: "Shortest path length",
    constraints: "1 <= beginWord.length <= 10, 1 <= wordList.length <= 5000",
    sampleInput: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', sampleOutput: "5",
    explanation: 'The shortest transformation is "hit" -> "hot" -> "dot" -> "dog" -> "cog".',
    referenceLink: "https://leetcode.com/problems/word-ladder/",
    timeComplexity: "O(M² × N)", spaceComplexity: "O(M × N)", hints: ["BFS from beginWord", "Try changing each character to a-z"]
  },
  {
    id: 40, title: "Dijkstra's Shortest Path", difficulty: "Medium", topic: "Graphs",
    company: "Microsoft", companies: ["Microsoft", "Google", "Amazon"], frequency: "medium", solved: false, pattern: "Shortest Path",
    description: "Given a weighted graph and a source vertex, find the shortest path from source to all other vertices using Dijkstra's algorithm.",
    inputFormat: "Adjacency list with weights, source vertex", outputFormat: "Array of shortest distances",
    constraints: "1 <= V <= 10^5, 0 <= weight <= 10^4",
    sampleInput: "V=5, edges=[[0,1,2],[0,3,6],[1,2,3],[1,3,8],[2,3,1],[3,4,5]], src=0", sampleOutput: "[0,2,5,6,11]",
    explanation: "Use a min-heap priority queue. Greedily pick the nearest unvisited vertex.",
    referenceLink: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
    timeComplexity: "O((V+E) log V)", spaceComplexity: "O(V)", hints: ["Use a min-heap / priority queue", "Relax edges from the closest vertex"]
  },

  // ===== DYNAMIC PROGRAMMING =====
  {
    id: 41, title: "Climbing Stairs", difficulty: "Easy", topic: "Dynamic Programming",
    company: "TCS", companies: ["TCS", "Amazon", "Microsoft", "Google"], frequency: "high", solved: false, pattern: "DP",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    inputFormat: "Integer n", outputFormat: "Number of ways",
    constraints: "1 <= n <= 45",
    sampleInput: "n = 3", sampleOutput: "3",
    explanation: "dp[i] = dp[i-1] + dp[i-2]. Same as Fibonacci!",
    referenceLink: "https://leetcode.com/problems/climbing-stairs/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["It's Fibonacci!", "Base cases: dp[1]=1, dp[2]=2"]
  },
  {
    id: 42, title: "House Robber", difficulty: "Medium", topic: "Dynamic Programming",
    company: "Amazon", companies: ["Amazon", "Microsoft", "Google"], frequency: "high", solved: false, pattern: "DP",
    description: "Given an integer array nums representing the amount of money of each house, return the maximum amount you can rob without robbing two adjacent houses.",
    inputFormat: "Array of integers", outputFormat: "Maximum amount",
    constraints: "1 <= nums.length <= 100",
    sampleInput: "[2,7,9,3,1]", sampleOutput: "12",
    explanation: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Either skip or rob current house.",
    referenceLink: "https://leetcode.com/problems/house-robber/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["At each house, decide: rob or skip", "Track two previous results"]
  },
  {
    id: 43, title: "Longest Common Subsequence", difficulty: "Medium", topic: "Dynamic Programming",
    company: "Google", companies: ["Google", "Amazon", "Microsoft", "Adobe"], frequency: "high", solved: false, pattern: "2D DP",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
    inputFormat: "Two strings", outputFormat: "LCS length",
    constraints: "1 <= text1.length, text2.length <= 1000",
    sampleInput: 'text1 = "abcde", text2 = "ace"', sampleOutput: "3",
    explanation: "Build a 2D DP table. If chars match, dp[i][j] = dp[i-1][j-1]+1, else max of skip either.",
    referenceLink: "https://leetcode.com/problems/longest-common-subsequence/",
    timeComplexity: "O(m×n)", spaceComplexity: "O(m×n)", hints: ["Use a 2D DP table", "Match → diagonal + 1, else max(up, left)"]
  },
  {
    id: 44, title: "0/1 Knapsack Problem", difficulty: "Medium", topic: "Dynamic Programming",
    company: "Wipro", companies: ["Wipro", "TCS", "Infosys", "Amazon"], frequency: "high", solved: false, pattern: "2D DP",
    description: "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value.",
    inputFormat: "Values array, weights array, capacity W", outputFormat: "Maximum value",
    constraints: "1 <= n <= 1000, 1 <= W <= 1000",
    sampleInput: "values=[60,100,120], weights=[10,20,30], W=50", sampleOutput: "220",
    explanation: "dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i]).",
    referenceLink: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
    timeComplexity: "O(n×W)", spaceComplexity: "O(n×W)", hints: ["For each item, either include or exclude", "Can optimize space to 1D"]
  },
  {
    id: 45, title: "Edit Distance", difficulty: "Hard", topic: "Dynamic Programming",
    company: "Google", companies: ["Google", "Amazon", "Microsoft"], frequency: "high", solved: false, pattern: "2D DP",
    description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2 (insert, delete, replace).",
    inputFormat: "Two strings", outputFormat: "Minimum operations",
    constraints: "0 <= word1.length, word2.length <= 500",
    sampleInput: 'word1 = "horse", word2 = "ros"', sampleOutput: "3",
    explanation: "dp[i][j] = min(insert, delete, replace) operations.",
    referenceLink: "https://leetcode.com/problems/edit-distance/",
    timeComplexity: "O(m×n)", spaceComplexity: "O(m×n)", hints: ["If chars match, no operation needed", "Otherwise take min of 3 operations + 1"]
  },
  {
    id: 46, title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "Dynamic Programming",
    company: "Amazon", companies: ["Amazon", "Google", "Microsoft", "Samsung"], frequency: "high", solved: false, pattern: "Binary Search + DP",
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    inputFormat: "Array of integers", outputFormat: "LIS length",
    constraints: "1 <= nums.length <= 2500",
    sampleInput: "[10,9,2,5,3,7,101,18]", sampleOutput: "4",
    explanation: "The LIS is [2,3,7,101]. Use DP or patience sorting with binary search.",
    referenceLink: "https://leetcode.com/problems/longest-increasing-subsequence/",
    timeComplexity: "O(n log n)", spaceComplexity: "O(n)", hints: ["Binary search + tails array for O(n log n)", "DP approach: dp[i] = max(dp[j]+1) for all j < i where nums[j] < nums[i]"]
  },

  // ===== GREEDY =====
  {
    id: 47, title: "Jump Game", difficulty: "Medium", topic: "Greedy",
    company: "Amazon", companies: ["Amazon", "Google", "Microsoft"], frequency: "high", solved: false, pattern: "Greedy",
    description: "You are given an integer array nums. You are initially at the first index. Each element represents your maximum jump length. Determine if you can reach the last index.",
    inputFormat: "Array of integers", outputFormat: "Boolean",
    constraints: "1 <= nums.length <= 10^4",
    sampleInput: "[2,3,1,1,4]", sampleOutput: "true",
    explanation: "Track the farthest reachable position. If current index > farthest, return false.",
    referenceLink: "https://leetcode.com/problems/jump-game/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Track max reachable index", "If you can't reach current, return false"]
  },
  {
    id: 48, title: "Activity Selection / Meeting Rooms", difficulty: "Easy", topic: "Greedy",
    company: "TCS", companies: ["TCS", "Infosys", "Wipro", "Amazon"], frequency: "high", solved: false, pattern: "Sorting + Greedy",
    description: "Given a set of activities with start and finish times, find the maximum number of activities that can be performed by a single person.",
    inputFormat: "Start and end time arrays", outputFormat: "Maximum activities count",
    constraints: "1 <= n <= 10^5",
    sampleInput: "start=[1,3,0,5,8,5], finish=[2,4,6,7,9,9]", sampleOutput: "4",
    explanation: "Sort by finish time, greedily pick non-overlapping activities.",
    referenceLink: "https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/",
    timeComplexity: "O(n log n)", spaceComplexity: "O(1)", hints: ["Sort by end time", "Pick activity if start >= last picked end"]
  },
  {
    id: 49, title: "Fractional Knapsack", difficulty: "Medium", topic: "Greedy",
    company: "Infosys", companies: ["Infosys", "TCS", "Wipro", "Accenture"], frequency: "medium", solved: false, pattern: "Greedy",
    description: "Given weights and values of N items, put these items in a knapsack of capacity W. You can break items for maximizing total value.",
    inputFormat: "Values, weights arrays, capacity W", outputFormat: "Maximum value (float)",
    constraints: "1 <= N <= 10^5",
    sampleInput: "values=[60,100,120], weights=[10,20,30], W=50", sampleOutput: "240.0",
    explanation: "Sort by value/weight ratio. Pick items greedily, take fraction of last item if needed.",
    referenceLink: "https://www.geeksforgeeks.org/fractional-knapsack-problem/",
    timeComplexity: "O(n log n)", spaceComplexity: "O(1)", hints: ["Sort by value-to-weight ratio in descending order", "Take fractions of the last item"]
  },

  // ===== BINARY SEARCH =====
  {
    id: 50, title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search",
    company: "Amazon", companies: ["Amazon", "Meta", "Google", "Microsoft"], frequency: "high", solved: false, pattern: "Binary Search",
    description: "Given a rotated sorted array and a target, return the index of target, or -1 if not found. Must be O(log n).",
    inputFormat: "Rotated sorted array, target", outputFormat: "Index or -1",
    constraints: "1 <= nums.length <= 5000",
    sampleInput: "nums = [4,5,6,7,0,1,2], target = 0", sampleOutput: "4",
    explanation: "Modified binary search: determine which half is sorted and search accordingly.",
    referenceLink: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    timeComplexity: "O(log n)", spaceComplexity: "O(1)", hints: ["Find which half is sorted", "Check if target lies in sorted half"]
  },
  {
    id: 51, title: "Find Peak Element", difficulty: "Medium", topic: "Binary Search",
    company: "Google", companies: ["Google", "Amazon", "Meta"], frequency: "medium", solved: false, pattern: "Binary Search",
    description: "A peak element is an element that is strictly greater than its neighbors. Find any peak element index in O(log n).",
    inputFormat: "Array of integers", outputFormat: "Peak index",
    constraints: "1 <= nums.length <= 1000",
    sampleInput: "[1,2,3,1]", sampleOutput: "2",
    explanation: "Binary search: if mid < mid+1, peak is on the right; otherwise on the left.",
    referenceLink: "https://leetcode.com/problems/find-peak-element/",
    timeComplexity: "O(log n)", spaceComplexity: "O(1)", hints: ["Move towards the ascending side", "Compare mid with mid+1"]
  },
  {
    id: 52, title: "Koko Eating Bananas", difficulty: "Medium", topic: "Binary Search",
    company: "Meta", companies: ["Meta", "Google", "Amazon"], frequency: "medium", solved: false, pattern: "Binary Search on Answer",
    description: "Koko can eat bananas at speed k per hour. Find the minimum integer k such that she can eat all bananas within h hours.",
    inputFormat: "Piles array, hours h", outputFormat: "Minimum speed k",
    constraints: "1 <= piles.length <= 10^4",
    sampleInput: "piles = [3,6,7,11], h = 8", sampleOutput: "4",
    explanation: "Binary search on the answer k from 1 to max(piles).",
    referenceLink: "https://leetcode.com/problems/koko-eating-bananas/",
    timeComplexity: "O(n log m)", spaceComplexity: "O(1)", hints: ["Binary search on speed", "For each k, check if total hours <= h"]
  },

  // ===== HASHING =====
  {
    id: 53, title: "Subarray Sum Equals K", difficulty: "Medium", topic: "Hashing",
    company: "Meta", companies: ["Meta", "Google", "Amazon"], frequency: "high", solved: false, pattern: "Prefix Sum + Hashing",
    description: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.",
    inputFormat: "Array, target sum k", outputFormat: "Count of subarrays",
    constraints: "1 <= nums.length <= 2*10^4",
    sampleInput: "nums = [1,1,1], k = 2", sampleOutput: "2",
    explanation: "Use prefix sum with hashmap. If prefix[j] - prefix[i] == k, count it.",
    referenceLink: "https://leetcode.com/problems/subarray-sum-equals-k/",
    timeComplexity: "O(n)", spaceComplexity: "O(n)", hints: ["Store prefix sum frequencies in hashmap", "Check if (currentSum - k) exists"]
  },
  {
    id: 54, title: "Longest Consecutive Sequence", difficulty: "Medium", topic: "Hashing",
    company: "Google", companies: ["Google", "Amazon", "Microsoft", "Meta"], frequency: "high", solved: false, pattern: "Hashing",
    description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.",
    inputFormat: "Array of integers", outputFormat: "Longest consecutive length",
    constraints: "0 <= nums.length <= 10^5",
    sampleInput: "[100,4,200,1,3,2]", sampleOutput: "4",
    explanation: "Use a HashSet, only start counting from numbers that don't have (num-1) in set.",
    referenceLink: "https://leetcode.com/problems/longest-consecutive-sequence/",
    timeComplexity: "O(n)", spaceComplexity: "O(n)", hints: ["Add all to a set", "Only start sequence from beginning of a chain"]
  },

  // ===== MATH =====
  {
    id: 55, title: "Reverse Integer", difficulty: "Easy", topic: "Math",
    company: "TCS", companies: ["TCS", "Infosys", "Wipro", "Accenture"], frequency: "high", solved: false, pattern: "Math",
    description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing causes overflow, return 0.",
    inputFormat: "Integer x", outputFormat: "Reversed integer",
    constraints: "-2^31 <= x <= 2^31 - 1",
    sampleInput: "x = 123", sampleOutput: "321",
    explanation: "Pop digits from x and push to result. Check overflow before pushing.",
    referenceLink: "https://leetcode.com/problems/reverse-integer/",
    timeComplexity: "O(log x)", spaceComplexity: "O(1)", hints: ["Use modulo to get last digit", "Check overflow before multiplying by 10"]
  },
  {
    id: 56, title: "Pow(x, n) - Fast Exponentiation", difficulty: "Medium", topic: "Math",
    company: "Google", companies: ["Google", "Amazon", "Microsoft"], frequency: "medium", solved: false, pattern: "Divide and Conquer",
    description: "Implement pow(x, n), which calculates x raised to the power n.",
    inputFormat: "Double x, integer n", outputFormat: "x^n",
    constraints: "-100.0 < x < 100.0, -2^31 <= n <= 2^31 - 1",
    sampleInput: "x = 2.0, n = 10", sampleOutput: "1024.0",
    explanation: "Binary exponentiation: x^n = (x^(n/2))^2 for even n.",
    referenceLink: "https://leetcode.com/problems/powx-n/",
    timeComplexity: "O(log n)", spaceComplexity: "O(log n)", hints: ["If n is even: x^n = (x^(n/2))^2", "Handle negative n by using 1/x"]
  },
  {
    id: 57, title: "Count Primes (Sieve of Eratosthenes)", difficulty: "Medium", topic: "Math",
    company: "Infosys", companies: ["Infosys", "TCS", "Amazon"], frequency: "medium", solved: false, pattern: "Sieve",
    description: "Given an integer n, return the number of prime numbers that are strictly less than n.",
    inputFormat: "Integer n", outputFormat: "Count of primes",
    constraints: "0 <= n <= 5 * 10^6",
    sampleInput: "n = 10", sampleOutput: "4",
    explanation: "Sieve of Eratosthenes: mark composites starting from 2.",
    referenceLink: "https://leetcode.com/problems/count-primes/",
    timeComplexity: "O(n log log n)", spaceComplexity: "O(n)", hints: ["Start from 2, mark all multiples as non-prime", "Only need to sieve up to √n"]
  },

  // ===== BIT MANIPULATION =====
  {
    id: 58, title: "Single Number", difficulty: "Easy", topic: "Bit Manipulation",
    company: "TCS", companies: ["TCS", "Infosys", "Amazon", "Google"], frequency: "high", solved: false, pattern: "XOR",
    description: "Given a non-empty array where every element appears twice except for one, find that single one.",
    inputFormat: "Array of integers", outputFormat: "Single number",
    constraints: "1 <= nums.length <= 3*10^4",
    sampleInput: "[4,1,2,1,2]", sampleOutput: "4",
    explanation: "XOR all elements. Pairs cancel out, leaving the single number.",
    referenceLink: "https://leetcode.com/problems/single-number/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["a XOR a = 0, a XOR 0 = a"]
  },
  {
    id: 59, title: "Number of 1 Bits", difficulty: "Easy", topic: "Bit Manipulation",
    company: "Wipro", companies: ["Wipro", "TCS", "Microsoft"], frequency: "medium", solved: false, pattern: "Bit Counting",
    description: "Write a function that takes the binary representation of a positive integer and returns the number of set bits.",
    inputFormat: "Integer n", outputFormat: "Count of 1 bits",
    constraints: "0 <= n <= 2^31 - 1",
    sampleInput: "n = 11 (binary: 1011)", sampleOutput: "3",
    explanation: "Use n & (n-1) to clear the lowest set bit, count iterations.",
    referenceLink: "https://leetcode.com/problems/number-of-1-bits/",
    timeComplexity: "O(k) where k = set bits", spaceComplexity: "O(1)", hints: ["n & (n-1) removes lowest set bit", "Count how many times you can do this"]
  },
  {
    id: 60, title: "Counting Bits", difficulty: "Easy", topic: "Bit Manipulation",
    company: "Accenture", companies: ["Accenture", "TCS", "Amazon"], frequency: "medium", solved: false, pattern: "DP + Bits",
    description: "Given an integer n, return an array ans of length n+1 such that ans[i] is the number of 1's in the binary representation of i.",
    inputFormat: "Integer n", outputFormat: "Array of bit counts",
    constraints: "0 <= n <= 10^5",
    sampleInput: "n = 5", sampleOutput: "[0,1,1,2,1,2]",
    explanation: "ans[i] = ans[i >> 1] + (i & 1). Use previously computed results.",
    referenceLink: "https://leetcode.com/problems/counting-bits/",
    timeComplexity: "O(n)", spaceComplexity: "O(n)", hints: ["dp[i] = dp[i/2] + i%2"]
  },

  // ===== RECURSION =====
  {
    id: 61, title: "Generate Parentheses", difficulty: "Medium", topic: "Recursion",
    company: "Amazon", companies: ["Amazon", "Google", "Meta"], frequency: "high", solved: false, pattern: "Backtracking",
    description: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    inputFormat: "Integer n", outputFormat: "List of valid strings",
    constraints: "1 <= n <= 8",
    sampleInput: "n = 3", sampleOutput: '["((()))","(()())","(())()","()(())","()()()"]',
    explanation: "Backtrack: add '(' if open < n, add ')' if close < open.",
    referenceLink: "https://leetcode.com/problems/generate-parentheses/",
    timeComplexity: "O(4^n/√n)", spaceComplexity: "O(n)", hints: ["Track count of open and close parens", "Only add ')' when close < open"]
  },
  {
    id: 62, title: "Tower of Hanoi", difficulty: "Medium", topic: "Recursion",
    company: "TCS", companies: ["TCS", "Infosys", "Wipro", "Cognizant"], frequency: "high", solved: false, pattern: "Recursion",
    description: "Move n disks from source peg to destination peg using an auxiliary peg, following the rules of Tower of Hanoi.",
    inputFormat: "Integer n (number of disks)", outputFormat: "Sequence of moves",
    constraints: "1 <= n <= 20",
    sampleInput: "n = 3", sampleOutput: "7 moves total",
    explanation: "Move n-1 disks to auxiliary, move nth disk to destination, move n-1 from auxiliary to destination.",
    referenceLink: "https://www.geeksforgeeks.org/c-program-for-tower-of-hanoi/",
    timeComplexity: "O(2^n)", spaceComplexity: "O(n)", hints: ["Recursive formula: T(n) = 2*T(n-1) + 1"]
  },

  // ===== BACKTRACKING =====
  {
    id: 63, title: "N-Queens", difficulty: "Hard", topic: "Backtracking",
    company: "Google", companies: ["Google", "Amazon", "Microsoft"], frequency: "high", solved: false, pattern: "Backtracking",
    description: "Place n queens on an n×n chessboard such that no two queens attack each other. Return all distinct solutions.",
    inputFormat: "Integer n", outputFormat: "List of board configurations",
    constraints: "1 <= n <= 9",
    sampleInput: "n = 4", sampleOutput: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
    explanation: "Place queens row by row, backtrack when conflicts arise. Use sets for columns and diagonals.",
    referenceLink: "https://leetcode.com/problems/n-queens/",
    timeComplexity: "O(N!)", spaceComplexity: "O(N²)", hints: ["Track occupied columns and diagonals", "Diagonals: row-col and row+col"]
  },
  {
    id: 64, title: "Sudoku Solver", difficulty: "Hard", topic: "Backtracking",
    company: "Amazon", companies: ["Amazon", "Google", "Microsoft"], frequency: "medium", solved: false, pattern: "Backtracking",
    description: "Write a program to solve a Sudoku puzzle by filling the empty cells.",
    inputFormat: "9x9 board with empty cells as '.'", outputFormat: "Solved board",
    constraints: "Board is 9x9, valid input guaranteed",
    sampleInput: "Standard Sudoku board", sampleOutput: "Completed valid board",
    explanation: "Try digits 1-9 in empty cells, validate row/col/box constraints, backtrack on conflict.",
    referenceLink: "https://leetcode.com/problems/sudoku-solver/",
    timeComplexity: "O(9^(n*n))", spaceComplexity: "O(n*n)", hints: ["Check row, column, and 3x3 box constraints", "Backtrack when no valid digit works"]
  },
  {
    id: 65, title: "Word Search", difficulty: "Medium", topic: "Backtracking",
    company: "Meta", companies: ["Meta", "Amazon", "Microsoft", "Google"], frequency: "high", solved: false, pattern: "DFS + Backtracking",
    description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid (adjacent cells, each cell used once).",
    inputFormat: "2D character grid, word string", outputFormat: "Boolean",
    constraints: "m, n <= 6, word.length <= 15",
    sampleInput: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', sampleOutput: "true",
    explanation: "DFS from each cell, mark visited, backtrack when path doesn't match.",
    referenceLink: "https://leetcode.com/problems/word-search/",
    timeComplexity: "O(m*n*4^L)", spaceComplexity: "O(L)", hints: ["DFS from each starting cell", "Mark cell as visited, unmark on backtrack"]
  },
  {
    id: 66, title: "Permutations", difficulty: "Medium", topic: "Backtracking",
    company: "Microsoft", companies: ["Microsoft", "Amazon", "Google"], frequency: "high", solved: false, pattern: "Backtracking",
    description: "Given an array nums of distinct integers, return all the possible permutations.",
    inputFormat: "Array of distinct integers", outputFormat: "List of permutations",
    constraints: "1 <= nums.length <= 6",
    sampleInput: "[1,2,3]", sampleOutput: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
    explanation: "Swap elements and recurse, backtrack by swapping back.",
    referenceLink: "https://leetcode.com/problems/permutations/",
    timeComplexity: "O(n!)", spaceComplexity: "O(n)", hints: ["Fix one element at each position", "Swap and recurse"]
  },

  // ===== HEAP =====
  {
    id: 67, title: "Kth Largest Element", difficulty: "Medium", topic: "Heap",
    company: "Amazon", companies: ["Amazon", "Meta", "Google", "Microsoft"], frequency: "high", solved: false, pattern: "Heap",
    description: "Given an integer array nums and an integer k, return the kth largest element in the array.",
    inputFormat: "Array, integer k", outputFormat: "Kth largest value",
    constraints: "1 <= k <= nums.length <= 10^5",
    sampleInput: "nums = [3,2,1,5,6,4], k = 2", sampleOutput: "5",
    explanation: "Use a min-heap of size k. The top is the kth largest.",
    referenceLink: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    timeComplexity: "O(n log k)", spaceComplexity: "O(k)", hints: ["Min-heap of size k", "Or use QuickSelect for O(n) average"]
  },
  {
    id: 68, title: "Top K Frequent Elements", difficulty: "Medium", topic: "Heap",
    company: "Google", companies: ["Google", "Amazon", "Meta"], frequency: "high", solved: false, pattern: "Heap + Hashing",
    description: "Given an integer array nums and an integer k, return the k most frequent elements.",
    inputFormat: "Array, integer k", outputFormat: "Array of k most frequent",
    constraints: "1 <= nums.length <= 10^5, 1 <= k <= unique elements",
    sampleInput: "nums = [1,1,1,2,2,3], k = 2", sampleOutput: "[1,2]",
    explanation: "Count frequencies with hashmap, then use min-heap of size k or bucket sort.",
    referenceLink: "https://leetcode.com/problems/top-k-frequent-elements/",
    timeComplexity: "O(n log k)", spaceComplexity: "O(n)", hints: ["Count with hashmap", "Use heap or bucket sort"]
  },
  {
    id: 69, title: "Find Median from Data Stream", difficulty: "Hard", topic: "Heap",
    company: "Amazon", companies: ["Amazon", "Google", "Microsoft", "Meta"], frequency: "high", solved: false, pattern: "Two Heaps",
    description: "Design a data structure that supports adding integers and finding the median of all elements added so far.",
    inputFormat: "Stream of addNum and findMedian operations", outputFormat: "Median values",
    constraints: "-10^5 <= num <= 10^5, At most 5*10^4 calls",
    sampleInput: "addNum(1), addNum(2), findMedian(), addNum(3), findMedian()", sampleOutput: "1.5, 2.0",
    explanation: "Use a max-heap for lower half and min-heap for upper half. Balance sizes.",
    referenceLink: "https://leetcode.com/problems/find-median-from-data-stream/",
    timeComplexity: "O(log n) per add", spaceComplexity: "O(n)", hints: ["Max-heap stores smaller half", "Min-heap stores larger half", "Keep sizes balanced"]
  },

  // ===== MORE ARRAYS / MIXED =====
  {
    id: 70, title: "Rotate Image (Matrix)", difficulty: "Medium", topic: "Arrays",
    company: "Microsoft", companies: ["Microsoft", "Amazon", "Google"], frequency: "medium", solved: false, pattern: "Matrix",
    description: "Rotate an n x n 2D matrix by 90 degrees clockwise in-place.",
    inputFormat: "n x n matrix", outputFormat: "Rotated matrix (in-place)",
    constraints: "1 <= n <= 20",
    sampleInput: "[[1,2,3],[4,5,6],[7,8,9]]", sampleOutput: "[[7,4,1],[8,5,2],[9,6,3]]",
    explanation: "Transpose the matrix, then reverse each row.",
    referenceLink: "https://leetcode.com/problems/rotate-image/",
    timeComplexity: "O(n²)", spaceComplexity: "O(1)", hints: ["Step 1: Transpose (swap a[i][j] with a[j][i])", "Step 2: Reverse each row"]
  },
  {
    id: 71, title: "Spiral Matrix", difficulty: "Medium", topic: "Arrays",
    company: "Amazon", companies: ["Amazon", "Microsoft", "Google", "Adobe"], frequency: "medium", solved: false, pattern: "Matrix",
    description: "Given an m x n matrix, return all elements of the matrix in spiral order.",
    inputFormat: "m x n matrix", outputFormat: "Array in spiral order",
    constraints: "1 <= m, n <= 10",
    sampleInput: "[[1,2,3],[4,5,6],[7,8,9]]", sampleOutput: "[1,2,3,6,9,8,7,4,5]",
    explanation: "Use four boundaries (top, bottom, left, right) and traverse in a spiral.",
    referenceLink: "https://leetcode.com/problems/spiral-matrix/",
    timeComplexity: "O(m*n)", spaceComplexity: "O(1)", hints: ["Maintain 4 boundary pointers", "Shrink boundaries after each direction"]
  },
  {
    id: 72, title: "Set Matrix Zeroes", difficulty: "Medium", topic: "Arrays",
    company: "Meta", companies: ["Meta", "Amazon", "Microsoft"], frequency: "medium", solved: false, pattern: "Matrix",
    description: "Given an m x n matrix, if an element is 0, set its entire row and column to 0. Do it in-place.",
    inputFormat: "m x n matrix", outputFormat: "Modified matrix",
    constraints: "1 <= m, n <= 200",
    sampleInput: "[[1,1,1],[1,0,1],[1,1,1]]", sampleOutput: "[[1,0,1],[0,0,0],[1,0,1]]",
    explanation: "Use first row and first column as markers to avoid extra space.",
    referenceLink: "https://leetcode.com/problems/set-matrix-zeroes/",
    timeComplexity: "O(m*n)", spaceComplexity: "O(1)", hints: ["Use first row/col as markers", "Handle first row/col separately"]
  },

  // ===== MORE GRAPHS =====
  {
    id: 73, title: "Detect Cycle in Directed Graph", difficulty: "Medium", topic: "Graphs",
    company: "Samsung", companies: ["Samsung", "Amazon", "Google"], frequency: "medium", solved: false, pattern: "DFS",
    description: "Given a directed graph, detect if there is a cycle.",
    inputFormat: "Number of vertices, edges list", outputFormat: "Boolean",
    constraints: "1 <= V <= 10^5",
    sampleInput: "V=4, edges=[[0,1],[1,2],[2,3],[3,1]]", sampleOutput: "true",
    explanation: "Use DFS with 3 colors: white (unvisited), gray (in progress), black (done). Cycle exists if we visit a gray node.",
    referenceLink: "https://www.geeksforgeeks.org/detect-cycle-in-a-graph/",
    timeComplexity: "O(V+E)", spaceComplexity: "O(V)", hints: ["Use recursion stack / 3-color approach", "Gray node in DFS path = cycle"]
  },
  {
    id: 74, title: "Bellman-Ford Algorithm", difficulty: "Medium", topic: "Graphs",
    company: "Microsoft", companies: ["Microsoft", "Google", "Amazon"], frequency: "low", solved: false, pattern: "Shortest Path",
    description: "Find shortest paths from a source vertex to all vertices, even with negative weight edges.",
    inputFormat: "Edges list with weights, source vertex", outputFormat: "Distance array",
    constraints: "1 <= V <= 10^4",
    sampleInput: "V=5, edges with weights, src=0", sampleOutput: "Shortest distances from source",
    explanation: "Relax all edges V-1 times. If any edge can still be relaxed, there's a negative cycle.",
    referenceLink: "https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/",
    timeComplexity: "O(V*E)", spaceComplexity: "O(V)", hints: ["Relax all edges V-1 times", "Check for negative cycles with one more pass"]
  },

  // ===== MORE DP =====
  {
    id: 75, title: "Matrix Chain Multiplication", difficulty: "Hard", topic: "Dynamic Programming",
    company: "Google", companies: ["Google", "Amazon", "Samsung"], frequency: "medium", solved: false, pattern: "Interval DP",
    description: "Given a sequence of matrices, find the most efficient way to multiply them (minimum number of scalar multiplications).",
    inputFormat: "Array of matrix dimensions", outputFormat: "Minimum multiplication cost",
    constraints: "2 <= n <= 100",
    sampleInput: "p = [40, 20, 30, 10, 30]", sampleOutput: "26000",
    explanation: "dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j].",
    referenceLink: "https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/",
    timeComplexity: "O(n³)", spaceComplexity: "O(n²)", hints: ["Try all split points k between i and j", "Bottom-up: solve smaller chains first"]
  },
  {
    id: 76, title: "Partition Equal Subset Sum", difficulty: "Medium", topic: "Dynamic Programming",
    company: "Amazon", companies: ["Amazon", "Microsoft", "Google"], frequency: "medium", solved: false, pattern: "DP / Knapsack",
    description: "Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal.",
    inputFormat: "Array of positive integers", outputFormat: "Boolean",
    constraints: "1 <= nums.length <= 200, 1 <= nums[i] <= 100",
    sampleInput: "[1,5,11,5]", sampleOutput: "true (subsets: [1,5,5] and [11])",
    explanation: "If total sum is odd, return false. Otherwise, solve subset sum for total/2.",
    referenceLink: "https://leetcode.com/problems/partition-equal-subset-sum/",
    timeComplexity: "O(n * sum/2)", spaceComplexity: "O(sum/2)", hints: ["Reduce to subset sum = totalSum/2", "Use 1D DP array"]
  },

  // ===== MORE STRINGS =====
  {
    id: 77, title: "String to Integer (atoi)", difficulty: "Medium", topic: "Strings",
    company: "TCS", companies: ["TCS", "Infosys", "Amazon", "Microsoft"], frequency: "high", solved: false, pattern: "String Parsing",
    description: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
    inputFormat: "String s", outputFormat: "Integer",
    constraints: "0 <= s.length <= 200",
    sampleInput: '"   -42"', sampleOutput: "-42",
    explanation: "Skip whitespace, check sign, parse digits, handle overflow.",
    referenceLink: "https://leetcode.com/problems/string-to-integer-atoi/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Handle edge cases: whitespace, sign, overflow", "Clamp to INT_MIN/INT_MAX on overflow"]
  },
  {
    id: 78, title: "Longest Common Prefix", difficulty: "Easy", topic: "Strings",
    company: "Wipro", companies: ["Wipro", "TCS", "Infosys", "Cognizant"], frequency: "high", solved: false, pattern: "String",
    description: "Write a function to find the longest common prefix string amongst an array of strings.",
    inputFormat: "Array of strings", outputFormat: "Common prefix string",
    constraints: "1 <= strs.length <= 200",
    sampleInput: '["flower","flow","flight"]', sampleOutput: '"fl"',
    explanation: "Compare characters at each position across all strings.",
    referenceLink: "https://leetcode.com/problems/longest-common-prefix/",
    timeComplexity: "O(S) where S = sum of all chars", spaceComplexity: "O(1)", hints: ["Compare character by character", "Stop at first mismatch"]
  },

  // ===== MORE TREES =====
  {
    id: 79, title: "Diameter of Binary Tree", difficulty: "Easy", topic: "Trees",
    company: "Meta", companies: ["Meta", "Amazon", "Google"], frequency: "high", solved: false, pattern: "DFS",
    description: "Given the root of a binary tree, return the length of the diameter (longest path between any two nodes).",
    inputFormat: "Root of binary tree", outputFormat: "Diameter length",
    constraints: "1 <= n <= 10^4",
    sampleInput: "[1,2,3,4,5]", sampleOutput: "3",
    explanation: "At each node, diameter through it = leftHeight + rightHeight. Track global max.",
    referenceLink: "https://leetcode.com/problems/diameter-of-binary-tree/",
    timeComplexity: "O(n)", spaceComplexity: "O(h)", hints: ["Diameter = left height + right height", "Track max diameter globally"]
  },
  {
    id: 80, title: "Invert Binary Tree", difficulty: "Easy", topic: "Trees",
    company: "Google", companies: ["Google", "Amazon", "TCS"], frequency: "high", solved: false, pattern: "DFS",
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    inputFormat: "Root of binary tree", outputFormat: "Inverted tree root",
    constraints: "0 <= n <= 100",
    sampleInput: "[4,2,7,1,3,6,9]", sampleOutput: "[4,7,2,9,6,3,1]",
    explanation: "Recursively swap left and right children of every node.",
    referenceLink: "https://leetcode.com/problems/invert-binary-tree/",
    timeComplexity: "O(n)", spaceComplexity: "O(h)", hints: ["Swap left and right at each node", "Process children recursively"]
  },

  // ===== ADDITIONAL PROBLEMS FOR COVERAGE =====
  {
    id: 81, title: "Implement Trie (Prefix Tree)", difficulty: "Medium", topic: "Trees",
    company: "Google", companies: ["Google", "Amazon", "Microsoft"], frequency: "high", solved: false, pattern: "Trie",
    description: "Implement a Trie with insert, search, and startsWith methods.",
    inputFormat: "Trie operations", outputFormat: "Operation results",
    constraints: "1 <= word.length <= 2000",
    sampleInput: 'insert("apple"), search("apple"), startsWith("app")', sampleOutput: "null, true, true",
    explanation: "Use a tree of nodes where each node has up to 26 children.",
    referenceLink: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    timeComplexity: "O(m) per operation", spaceComplexity: "O(m)", hints: ["Each node stores children map and isEnd flag"]
  },
  {
    id: 82, title: "Combination Sum", difficulty: "Medium", topic: "Backtracking",
    company: "Amazon", companies: ["Amazon", "Google", "Meta"], frequency: "high", solved: false, pattern: "Backtracking",
    description: "Given an array of distinct integers candidates and a target integer, return all unique combinations that sum to target. Same number can be used unlimited times.",
    inputFormat: "Candidates array, target", outputFormat: "List of combinations",
    constraints: "1 <= candidates.length <= 30, 2 <= target <= 40",
    sampleInput: "candidates = [2,3,6,7], target = 7", sampleOutput: "[[2,2,3],[7]]",
    explanation: "Backtrack with index to avoid duplicates. Include current or move to next candidate.",
    referenceLink: "https://leetcode.com/problems/combination-sum/",
    timeComplexity: "O(N^(T/M))", spaceComplexity: "O(T/M)", hints: ["Allow reuse of same element", "Start from current index to avoid duplicates"]
  },
  {
    id: 83, title: "Subsets", difficulty: "Medium", topic: "Backtracking",
    company: "Meta", companies: ["Meta", "Amazon", "Google", "Microsoft"], frequency: "high", solved: false, pattern: "Backtracking",
    description: "Given an integer array nums of unique elements, return all possible subsets (the power set).",
    inputFormat: "Array of unique integers", outputFormat: "List of all subsets",
    constraints: "1 <= nums.length <= 10",
    sampleInput: "[1,2,3]", sampleOutput: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
    explanation: "For each element, either include it or skip it.",
    referenceLink: "https://leetcode.com/problems/subsets/",
    timeComplexity: "O(2^n)", spaceComplexity: "O(n)", hints: ["Include or exclude each element", "Can also use bit masking"]
  },
  {
    id: 84, title: "Sort Colors (Dutch National Flag)", difficulty: "Medium", topic: "Arrays",
    company: "Microsoft", companies: ["Microsoft", "Amazon", "Google", "Samsung"], frequency: "high", solved: false, pattern: "Two Pointer",
    description: "Given an array with n objects colored red, white, or blue (0, 1, 2), sort them in-place so that objects of the same color are adjacent.",
    inputFormat: "Array of 0s, 1s, and 2s", outputFormat: "Sorted array in-place",
    constraints: "1 <= n <= 300",
    sampleInput: "[2,0,2,1,1,0]", sampleOutput: "[0,0,1,1,2,2]",
    explanation: "Use three pointers (low, mid, high). Dutch National Flag algorithm.",
    referenceLink: "https://leetcode.com/problems/sort-colors/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Three pointers: low, mid, high", "0s go to low, 2s go to high, 1s stay"]
  },
  {
    id: 85, title: "Kth Smallest in BST", difficulty: "Medium", topic: "Trees",
    company: "Amazon", companies: ["Amazon", "Meta", "Google"], frequency: "medium", solved: false, pattern: "In-order Traversal",
    description: "Given the root of a BST and an integer k, return the kth smallest value in the tree.",
    inputFormat: "BST root, integer k", outputFormat: "Kth smallest value",
    constraints: "1 <= k <= n <= 10^4",
    sampleInput: "root = [3,1,4,null,2], k = 1", sampleOutput: "1",
    explanation: "In-order traversal of BST gives sorted order. Return the kth element.",
    referenceLink: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    timeComplexity: "O(H + k)", spaceComplexity: "O(H)", hints: ["In-order traversal = sorted order in BST"]
  },
  {
    id: 86, title: "Maximum Product Subarray", difficulty: "Medium", topic: "Arrays",
    company: "Google", companies: ["Google", "Amazon", "Microsoft", "Adobe"], frequency: "high", solved: false, pattern: "DP",
    description: "Given an integer array nums, find a subarray that has the largest product, and return the product.",
    inputFormat: "Array of integers", outputFormat: "Maximum product",
    constraints: "1 <= nums.length <= 2*10^4",
    sampleInput: "[2,3,-2,4]", sampleOutput: "6",
    explanation: "Track both max and min products at each position (negative * negative = positive).",
    referenceLink: "https://leetcode.com/problems/maximum-product-subarray/",
    timeComplexity: "O(n)", spaceComplexity: "O(1)", hints: ["Track both currentMax and currentMin", "Negative number can flip min to max"]
  },
  {
    id: 87, title: "Flood Fill", difficulty: "Easy", topic: "Graphs",
    company: "TCS", companies: ["TCS", "Infosys", "Amazon"], frequency: "medium", solved: false, pattern: "DFS/BFS",
    description: "An image is represented by an m x n grid. Perform a flood fill from a starting pixel with a new color.",
    inputFormat: "Image grid, sr, sc, color", outputFormat: "Modified image",
    constraints: "1 <= m, n <= 50",
    sampleInput: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2", sampleOutput: "[[2,2,2],[2,2,0],[2,0,1]]",
    explanation: "DFS/BFS from starting pixel, change all connected same-color pixels.",
    referenceLink: "https://leetcode.com/problems/flood-fill/",
    timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", hints: ["Simple DFS/BFS from start", "Check bounds and original color"]
  },
  {
    id: 88, title: "Word Break", difficulty: "Medium", topic: "Dynamic Programming",
    company: "Amazon", companies: ["Amazon", "Google", "Meta", "Microsoft"], frequency: "high", solved: false, pattern: "DP",
    description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of dictionary words.",
    inputFormat: "String s, wordDict array", outputFormat: "Boolean",
    constraints: "1 <= s.length <= 300, 1 <= wordDict.length <= 1000",
    sampleInput: 's = "leetcode", wordDict = ["leet","code"]', sampleOutput: "true",
    explanation: "dp[i] = true if s[0:i] can be segmented. Check all possible last words.",
    referenceLink: "https://leetcode.com/problems/word-break/",
    timeComplexity: "O(n²*m)", spaceComplexity: "O(n)", hints: ["dp[i] = any(dp[j] && s[j:i] in dict) for j < i"]
  },
  {
    id: 89, title: "Letter Combinations of Phone Number", difficulty: "Medium", topic: "Backtracking",
    company: "Meta", companies: ["Meta", "Amazon", "Google"], frequency: "medium", solved: false, pattern: "Backtracking",
    description: "Given a string containing digits from 2-9, return all possible letter combinations that the number could represent.",
    inputFormat: "String of digits", outputFormat: "List of letter combinations",
    constraints: "0 <= digits.length <= 4",
    sampleInput: '"23"', sampleOutput: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
    explanation: "Map each digit to letters, generate all combinations via backtracking.",
    referenceLink: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    timeComplexity: "O(4^n)", spaceComplexity: "O(n)", hints: ["Map digits to letters", "Backtrack through each digit"]
  },
  {
    id: 90, title: "Palindrome Partitioning", difficulty: "Medium", topic: "Backtracking",
    company: "Google", companies: ["Google", "Amazon", "Microsoft"], frequency: "medium", solved: false, pattern: "Backtracking",
    description: "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitionings.",
    inputFormat: "String s", outputFormat: "List of partitions",
    constraints: "1 <= s.length <= 16",
    sampleInput: '"aab"', sampleOutput: '[["a","a","b"],["aa","b"]]',
    explanation: "Backtrack: try all prefixes that are palindromes, recurse on the rest.",
    referenceLink: "https://leetcode.com/problems/palindrome-partitioning/",
    timeComplexity: "O(n * 2^n)", spaceComplexity: "O(n)", hints: ["At each position, try all palindrome prefixes", "Use backtracking to build partitions"]
  },
];

// Utility functions
export function getExpandedProblemsByTopic(topic: string): ExpandedProblem[] {
  if (topic === "All Topics") return expandedProblems;
  return expandedProblems.filter(p => p.topic === topic);
}

export function getExpandedProblemsByDifficulty(difficulty: string): ExpandedProblem[] {
  if (difficulty === "All") return expandedProblems;
  return expandedProblems.filter(p => p.difficulty === difficulty);
}

export function getExpandedProblemsByCompany(company: string): ExpandedProblem[] {
  return expandedProblems.filter(p => p.companies.includes(company));
}

export const expandedTopics = [
  "All Topics", "Arrays", "Strings", "Hashing", "Recursion", "Linked List",
  "Stack", "Queue", "Trees", "Graphs", "Dynamic Programming", "Greedy",
  "Binary Search", "Bit Manipulation", "Backtracking", "Heap", "Math"
];

export const problemStats = {
  total: expandedProblems.length,
  easy: expandedProblems.filter(p => p.difficulty === "Easy").length,
  medium: expandedProblems.filter(p => p.difficulty === "Medium").length,
  hard: expandedProblems.filter(p => p.difficulty === "Hard").length,
  topics: [...new Set(expandedProblems.map(p => p.topic))].length,
  companies: [...new Set(expandedProblems.flatMap(p => p.companies))].length,
};
