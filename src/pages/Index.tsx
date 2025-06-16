import React, { useState, useEffect, Suspense } from 'react';
import { Moon, Sun, Search, Shuffle, BookOpen, Trophy, Gamepad2, Zap, Users, Target, LogIn, Code, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import RandomQuestionPicker from '@/components/RandomQuestionPicker';
import GameCard from '@/components/GameCard';
import { ultimateData } from '@/data/ultimateData'; // Adjust the import path as necessary

const TopicCard = React.lazy(() => import('@/components/TopicCard'));

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState<Record<string, Record<number, boolean>>>({});
  const [codeFont, setCodeFont] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load font preference
    const savedFont = localStorage.getItem('codeFont');
    if (savedFont === 'true') {
      setCodeFont(true);
      document.documentElement.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    }

    // Load progress from localStorage
    const savedProgress = localStorage.getItem('dsaProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }

    // Check login status
    const loginStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loginStatus === 'true');
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleFont = () => {
    setCodeFont(!codeFont);
    if (!codeFont) {
      document.documentElement.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
      localStorage.setItem('codeFont', 'true');
    } else {
      document.documentElement.style.fontFamily = '';
      localStorage.setItem('codeFont', 'false');
    }
  };

  const handleLogin = () => {
    // Placeholder login functionality
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  // Helper to flatten questions for a topic
  const flattenQuestions = (topic: any) => {
    if (!Array.isArray(topic.categoryList)) return [];
    return topic.categoryList.flatMap((cat: any) =>
      Array.isArray(cat.questionList)
        ? cat.questionList.map((q: any) => ({
            Problem: q.questionHeading || '',
            URL: q.gfgLink || q.leetCodeLink || q.questionLink || '',
            SolutionURL: '', // Add if available
            Difficulty: q.difficulty || 'Easy', // Default/fallback
          }))
        : []
    );
  };

  const filteredTopics = (ultimateData.data?.content || [])
    .filter(topic =>
      topic.contentHeading.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(topic => ({
      topicName: topic.contentHeading,
      questions: flattenQuestions(topic),
      raw: topic, // keep original if needed
    }));

  const totalQuestions = filteredTopics.reduce((acc, topic) => acc + (topic.questions?.length || 0), 0);
  const completedQuestions = Object.values(progress).reduce((acc, topicProgress) => 
    acc + Object.values(topicProgress || {}).filter(Boolean).length, 0
  );
  const overallProgress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  A2Z DSA Tracker
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">450+ Questions • Build Confidence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Logged In
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="hover:scale-105 transition-transform"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300"
                  size="sm"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110 transition-all duration-300"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Master <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Data Structures</span>
              <br />& Algorithms
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A comprehensive tracker with 450+ questions to build your confidence and ace your coding interviews
            </p>
          </div>

          {/* Enhanced Progress Overview */}
          <div className="mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] animate-scale-in">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Your Progress</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {completedQuestions}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">Questions Solved</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {totalQuestions}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">Total Questions</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {Math.round(overallProgress)}%
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">Completion</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Progress value={overallProgress} className="h-4 bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Progress: {Math.round(overallProgress)}%</span>
                  <span>{completedQuestions} / {totalQuestions} completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <RandomQuestionPicker questions={
              filteredTopics.flatMap(topic =>
                topic.questions.map(q => ({ ...q, topic: topic.topicName }))
              )
            } />

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] rounded-2xl">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="w-6 h-6 text-green-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Study Resources</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Access comprehensive notes and solutions</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 text-green-600 dark:text-green-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Topic Notes</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
                    <Users className="w-10 h-10 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Solutions</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Click the notes icon next to any question to access detailed explanations and solutions
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="mb-8 animate-fade-in">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 gap-8 mb-12">
            {filteredTopics.map((topic) => (
              <div key={topic.topicName}>
                <Suspense fallback={<div>Loading...</div>}>
                  <TopicCard
                    topic={topic}
                    progress={progress[topic.topicName] || {}}
                    onProgressUpdate={(questionIndex, completed) => {
                      const newProgress = {
                        ...progress,
                        [topic.topicName]: {
                          ...progress[topic.topicName],
                          [questionIndex]: completed
                        }
                      };
                      setProgress(newProgress);
                      localStorage.setItem('dsaProgress', JSON.stringify(newProgress));
                    }}
                  />
                </Suspense>
              </div>
            ))}
          </div>

          {/* Time Pass Section */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-12 animate-fade-in">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Need a Break? 🎮
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Take a quick gaming break to refresh your mind
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <GameCard />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 text-center text-gray-600 dark:text-gray-400">
            <p className="mb-3 text-lg">Built by nileshkr17</p>
            <p className="text-base">A2Z DSA Tracker by nileshkr17</p>
          </footer>
        </main>

        {/* Font Toggle Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={toggleFont}
            size="lg"
            className={`rounded-full shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 ${
              codeFont 
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
            }`}
          >
            {codeFont ? <Code className="w-5 h-5" /> : <Type className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
