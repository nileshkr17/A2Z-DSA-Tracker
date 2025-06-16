
import React, { useState } from 'react';
import { Shuffle, ExternalLink, RotateCcw, BookOpen, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Question {
  Problem: string;
  URL: string;
  SolutionURL?: string;
  Difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

interface RandomQuestionPickerProps {
  questions: Question[];
}

const RandomQuestionPicker: React.FC<RandomQuestionPickerProps> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const topics = Array.from(new Set(questions.map(q => q.topic)));
  
  const filteredQuestions = selectedTopic === 'all' 
    ? questions 
    : questions.filter(q => q.topic === selectedTopic);

  const pickRandomQuestion = () => {
    if (filteredQuestions.length === 0) return;
    
    setIsSpinning(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      setCurrentQuestion(filteredQuestions[randomIndex]);
      setIsSpinning(false);
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const openNotes = (question: Question) => {
    const notesUrl = `https://takeuforward.org/data-structure/${question.Problem.toLowerCase().replace(/\s+/g, '-')}/`;
    window.open(notesUrl, '_blank');
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
        <div className="flex items-center space-x-3 mb-2">
          <Shuffle className="w-6 h-6 text-purple-500 animate-spin" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Random Question</h3>
          <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">Let fate decide your next challenge!</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Topic Filter */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <span>Filter by Topic</span>
          </div>
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl h-12">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl">
              <SelectItem value="all" className="rounded-lg">
                All Topics ({questions.length} questions)
              </SelectItem>
              {topics.map((topic) => {
                const count = questions.filter(q => q.topic === topic).length;
                return (
                  <SelectItem key={topic} value={topic} className="rounded-lg">
                    {topic} ({count} questions)
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {currentQuestion ? (
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg animate-scale-in">
            <div className="flex items-start justify-between space-x-3">
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 leading-relaxed">
                  {currentQuestion.Problem}
                </h4>
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className={`text-xs border ${getDifficultyColor(currentQuestion.Difficulty)}`}>
                    {currentQuestion.Difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                    {currentQuestion.topic}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => openNotes(currentQuestion)}
                size="sm"
                variant="outline"
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/20 hover:scale-105 transition-all duration-300"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Notes
              </Button>
              
              <a
                href={currentQuestion.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Solve Problem
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 animate-fade-in">
            <Shuffle className="w-16 h-16 mx-auto mb-4 opacity-50 animate-bounce" />
            <p className="text-base font-medium mb-2">Choose a topic and click the button to get a random question!</p>
            <p className="text-sm">
              {selectedTopic === 'all' 
                ? `${questions.length} total questions available`
                : `${filteredQuestions.length} questions in ${selectedTopic}`
              }
            </p>
          </div>
        )}
        
        <Button
          onClick={pickRandomQuestion}
          disabled={isSpinning || filteredQuestions.length === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 h-12 text-base font-medium hover:scale-105 transition-all duration-300"
        >
          {isSpinning ? (
            <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Shuffle className="w-5 h-5 mr-2" />
          )}
          {isSpinning ? 'Picking...' : `Pick Random Question${selectedTopic !== 'all' ? ` from ${selectedTopic}` : ''}`}
        </Button>
      </div>
    </div>
  );
};

export default RandomQuestionPicker;
