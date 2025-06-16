import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, CheckCircle2, Circle, BookOpen, Trophy, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Question {
  Problem: string;
  URL: string;
  SolutionURL?: string;
  Difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface Topic {
  topicName: string;
  questions: Question[];
}

interface TopicCardProps {
  topic: Topic;
  progress: Record<number, boolean>;
  onProgressUpdate: (questionIndex: number, completed: boolean) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, progress, onProgressUpdate, isOpen: controlledIsOpen, onOpenChange }) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;
  const setIsOpen = onOpenChange || setUncontrolledIsOpen;
  
  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercentage = Array.isArray(topic.questions) && topic.questions.length > 0 ? (completedCount / topic.questions.length) * 100 : 0;

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

  const getProgressIcon = () => {
    if (progressPercentage === 100) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (progressPercentage >= 75) return <Star className="w-5 h-5 text-blue-500" />;
    return null;
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {topic.topicName}
              </h3>
              {getProgressIcon()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completedCount}/{topic.questions.length} questions completed
            </p>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 border-0 text-sm px-3 py-1"
          >
            {topic.questions.length} questions
          </Badge>
        </div>
        
        <div className="space-y-3">
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full" 
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{Math.round(progressPercentage)}% complete</span>
            <span>{completedCount} solved</span>
          </div>
        </div>
      </div>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 rounded-none border-t border-gray-200/50 dark:border-gray-700/50"
          >
            <span className="font-medium text-gray-900 dark:text-white">
              {isOpen ? 'Hide Questions' : 'View Questions'}
            </span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {topic.questions.length}
              </Badge>
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="transition-all duration-500 ease-in-out">
          <div className="p-6 pt-0">
            <ScrollArea className="h-96 w-full rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="p-4 space-y-3">
                {topic.questions.map((question, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                      progress[index] ? 'ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-900/10' : ''
                    }`}

                  >
                    <button
                      onClick={() => onProgressUpdate(index, !progress[index])}
                      className="flex-shrink-0 hover:scale-125 transition-transform duration-300"
                    >
                      {progress[index] ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 animate-pulse" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`text-sm font-medium truncate ${
                          progress[index] 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {question.Problem}
                        </span>
                      </div>
                      <Badge className={`text-xs ${getDifficultyColor(question.Difficulty)}`}>
                        {question.Difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openNotes(question)}
                        className="p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group hover:scale-110"
                        title="View Notes"
                      >
                        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:animate-bounce" />
                      </button>
                      
                      <a
                        href={question.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group hover:scale-110"
                        title="Open Problem"
                      >
                        <ExternalLink className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TopicCard;
