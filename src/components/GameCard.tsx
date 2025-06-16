
import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Star, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  name: string;
  score: number;
  rank: number;
}

const GameCard: React.FC = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    // Load leaderboard from localStorage
    const savedLeaderboard = localStorage.getItem('gameLeaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    } else {
      // Initialize with sample data
      const sampleLeaderboard = [
        { name: 'CodeMaster', score: 2840, rank: 1 },
        { name: 'AlgoNinja', score: 2650, rank: 2 },
        { name: 'DSAGuru', score: 2420, rank: 3 },
        { name: 'ByteBuster', score: 2180, rank: 4 },
        { name: 'LogicLord', score: 1960, rank: 5 }
      ];
      setLeaderboard(sampleLeaderboard);
      localStorage.setItem('gameLeaderboard', JSON.stringify(sampleLeaderboard));
    }

    // Load user score (get highest score from leaderboard)
    const savedHighScore = localStorage.getItem('spaceShooterHighScore');
    if (savedHighScore) {
      setUserScore(parseInt(savedHighScore));
    }
  }, []);

  const startGame = () => {
    navigate('/game');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2: return <Star className="w-4 h-4 text-gray-400" />;
      case 3: return <Star className="w-4 h-4 text-amber-600" />;
      default: return <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-500">#{rank}</span>;
    }
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gamepad2 className="w-5 h-5 text-purple-500" />
          <span>Space Shooter Game</span>
        </CardTitle>
        <CardDescription>Take a break with our space shooter!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Score */}
        <div className="text-center p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {userScore.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Your High Score</div>
        </div>

        {/* Mini Leaderboard */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Users className="w-4 h-4" />
            <span>Leaderboard</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {leaderboard.slice(0, 3).map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center space-x-3">
                  {getRankIcon(entry.rank)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {entry.name}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {entry.score.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={startGame}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          <Gamepad2 className="w-4 h-4 mr-2" />
          Play Space Shooter
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
