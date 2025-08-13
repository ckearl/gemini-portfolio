'use client';

import { useState } from 'react';

export default function GameControls() {
  const [showTypeChart, setShowTypeChart] = useState(false);
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      {/* Action Buttons - bottom right corner */}
      <div className="fixed bottom-4 right-4 flex flex-row gap-2 z-20">
        <button 
          onClick={() => setShowTypeChart(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg border-4 border-gray-800 hover:border-gray-700 transition-colors text-sm"
        >
          TYPE CHART
        </button>
        <button 
          onClick={() => setShowRules(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg border-4 border-gray-800 hover:border-gray-700 transition-colors text-sm"
        >
          SOUL LINK RULES
        </button>
      </div>

      {/* Type Chart Modal */}
      {showTypeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Pokemon Type Chart</h2>
              <button
                onClick={() => setShowTypeChart(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold mb-2">Super Effective (2x)</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Fire:</strong> Grass, Ice, Bug, Steel</div>
                  <div><strong>Water:</strong> Fire, Ground, Rock</div>
                  <div><strong>Electric:</strong> Water, Flying</div>
                  <div><strong>Grass:</strong> Water, Ground, Rock</div>
                  <div><strong>Ice:</strong> Grass, Ground, Flying, Dragon</div>
                  <div><strong>Fighting:</strong> Normal, Ice, Rock, Steel, Dark</div>
                  <div><strong>Poison:</strong> Grass, Fairy</div>
                  <div><strong>Ground:</strong> Fire, Electric, Poison, Rock, Steel</div>
                  <div><strong>Flying:</strong> Grass, Fighting, Bug</div>
                  <div><strong>Psychic:</strong> Fighting, Poison</div>
                  <div><strong>Bug:</strong> Grass, Psychic, Dark</div>
                  <div><strong>Rock:</strong> Fire, Ice, Flying, Bug</div>
                  <div><strong>Ghost:</strong> Ghost, Psychic</div>
                  <div><strong>Dragon:</strong> Dragon</div>
                  <div><strong>Dark:</strong> Ghost, Psychic</div>
                  <div><strong>Steel:</strong> Ice, Rock, Fairy</div>
                  <div><strong>Fairy:</strong> Fighting, Dragon, Dark</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2">Not Very Effective (0.5x)</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Fire:</strong> Fire, Water, Rock, Dragon</div>
                  <div><strong>Water:</strong> Water, Grass, Dragon</div>
                  <div><strong>Electric:</strong> Electric, Grass, Dragon</div>
                  <div><strong>Grass:</strong> Fire, Grass, Poison, Flying, Bug, Dragon, Steel</div>
                  <div><strong>Ice:</strong> Fire, Water, Ice, Steel</div>
                  <div><strong>Fighting:</strong> Poison, Flying, Psychic, Bug, Fairy</div>
                  <div><strong>Poison:</strong> Poison, Ground, Rock, Ghost, Steel</div>
                  <div><strong>Ground:</strong> Grass, Bug</div>
                  <div><strong>Flying:</strong> Electric, Rock, Steel</div>
                  <div><strong>Psychic:</strong> Psychic, Steel</div>
                  <div><strong>Bug:</strong> Fire, Fighting, Poison, Flying, Ghost, Steel, Fairy</div>
                  <div><strong>Rock:</strong> Fighting, Ground, Steel</div>
                  <div><strong>Ghost:</strong> Dark</div>
                  <div><strong>Dragon:</strong> Steel</div>
                  <div><strong>Dark:</strong> Fighting, Dark, Fairy</div>
                  <div><strong>Steel:</strong> Fire, Water, Electric, Steel</div>
                  <div><strong>Fairy:</strong> Poison, Steel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Soul Link Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Soul Link Nuzlocke Rules</h2>
              <button
                onClick={() => setShowRules(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="text-lg font-bold text-red-600">Standard Nuzlocke Rules:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You can only catch the first Pokemon you encounter in each area</li>
                  <li>If a Pokemon faints, it&apos;s considered dead and must be released</li>
                  <li>You must nickname all Pokemon you catch</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-blue-600">Soul Link Rules:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Both players must catch Pokemon in the same areas</li>
                  <li>If one Pokemon dies, its linked partner must also be released</li>
                  <li>Pokemon are linked by their position in the team (slot 1 with slot 1, etc.)</li>
                  <li>Both players must progress through the game together</li>
                  <li>If one player&apos;s starter dies, both players must restart</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-green-600">Additional Challenges:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>No items in battle (optional)</li>
                  <li>No grinding (optional)</li>
                  <li>Level caps at gym leaders (optional)</li>
                  <li>Set battle style (optional)</li>
                </ul>
              </div>
              
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
                <strong>Remember:</strong> The goal is to have fun and create a challenging experience. 
                Feel free to modify these rules to suit your playstyle!
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
